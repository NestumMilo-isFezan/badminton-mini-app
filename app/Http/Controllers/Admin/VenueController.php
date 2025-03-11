<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Address;
use App\Models\Venue;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use App\Http\Resources\VenueResource;

class VenueController extends Controller
{
    public function index()
    {
        $venues = Venue::query();

        if(request()->has('search')) {
            $venues->where('name', 'like', '%' . request('search') . '%');
        }
        $venues = $venues->paginate(10);
        return Inertia::render('admin/venue/index', [
            'venues' => VenueResource::collection($venues)
        ]);
    }

    public function create()
    {
        return Inertia::render('admin/venues/create');
    }

    public function store(Request $request)
    {
        $address = $request->validate([
            'address_1' => 'required|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        $venue = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image:jpg,jpeg,png|max:2048',
        ]);

        $courts = $request->validate([
            'courts' => 'required|array',
            'courts.*.name' => 'required|string|max:255',
        ]);

        if ($request->hasFile('image')) {
            $venue['image'] = $request->file('image')->store('venues', 'public');
        }

        DB::transaction(function () use ($address, $venue, $courts) {
            $address = Address::create($address);
            $venue['address_id'] = $address->id;
            $venue = Venue::create($venue);

            foreach ($courts['courts'] as $court) {
                $court['venue_id'] = $venue->id;
                $venue->courts()->create($court);
            }
        });

        return redirect()->route('admin.venues.index')
            ->with('success', 'Venue created successfully.');
    }

    public function show(string $id)
    {
        //
    }

    public function edit(string $id)
    {
        //
    }

    public function update(Request $request, string $id)
    {
        $address = $request->validate([
            'address_1' => 'required|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        $venue = $request->validate([
            'name' => 'required|string|max:255',
            'image' => 'nullable|image:jpg,jpeg,png|max:2048',
        ]);

        $courts = $request->validate([
            'courts' => 'required|array',
            'courts.*.id' => 'nullable|exists:courts,id',
            'courts.*.name' => 'required|string|max:255',
        ]);
        if ($request->hasFile('image')) {
            $venue['image'] = $request->file('image')->store('venues', 'public');
        }

        $venueModel = Venue::findOrFail($id);

        DB::transaction(function () use ($address, $venue, $courts, $venueModel) {
            // Update address
            $venueModel->address->update($address);

            // Update venue
            $venueModel->update($venue);

            // Get existing court IDs
            $existingCourtIds = $venueModel->courts->pluck('id')->toArray();
            $updatedCourtIds = collect($courts['courts'])->pluck('id')->filter()->toArray();

            // Delete courts that are not in the updated list
            $courtsToDelete = array_diff($existingCourtIds, $updatedCourtIds);
            if (!empty($courtsToDelete)) {
                $venueModel->courts()->whereIn('id', $courtsToDelete)->delete();
            }

            // Update or create courts
            foreach ($courts['courts'] as $court) {
                if (isset($court['id'])) {
                    $venueModel->courts()->where('id', $court['id'])->update(['name' => $court['name']]);
                } else {
                    $venueModel->courts()->create(['name' => $court['name']]);
                }
            }
        });

        return redirect()->route('admin.venues.index')
            ->with('success', 'Venue updated successfully.');
    }

    public function destroy(string $id)
    {
        $venue = Venue::findOrFail($id);
        $venue->delete();

        return redirect()->route('admin.venues.index')
            ->with('success', 'Venue deleted successfully.');
    }
}
