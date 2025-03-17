<?php

namespace App\Http\Controllers\Admin;

use App\Models\User;
use Inertia\Inertia;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Http\Resources\UserFormResource;
use App\Http\Resources\UserResource;
use App\Models\Address;
use App\Models\Profile;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;
use App\Models\Player;
use App\Models\Umpire;
use App\Models\Admin;

class UserController extends Controller
{
    public function index()
    {
        $users = User::query();
        $query = request()->query();

        $filterMap = [
            'search' => fn($value) => $users->where(function($query) use ($value) {
                $query->where('first_name', 'like', "%{$value}%")
                      ->orWhere('last_name', 'like', "%{$value}%");
            }),
            'verified' => fn($value) => $users->where('verified', $value === 'true' ? '!=' : '=', null),
            'roles' => fn($value) => $users->where('roles', $value),
        ];

        // Apply filters
        foreach ($filterMap as $param => $callback) {
            if (isset($query[$param]) && $query[$param] !== '') {
                $callback($query[$param]);
            }
        }



        $users = $users->paginate(10);

        return Inertia::render('admin/user/index', [
            'users' => UserResource::collection($users),
            'queryParams' => $query ?: null,
        ]);
    }

    public function store(Request $request)
    {
        $data = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name'=> 'required|string|max:255',
            'email'=> 'required|string|email|max:255|unique:users',
            'phone' => 'required|string|max:255',
            'gender'=> 'required|in:male,female,other',
            'password'=> 'required|string|min:8',
            'roles' => 'required|string|in:player,umpire,admin',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'address_1' => 'required|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        DB::transaction(function () use ($data) {
            $user = User::create([
                'first_name'=> $data['first_name'],
                'last_name'=> $data['last_name'],
                'email'=> $data['email'],
                'password'=> Hash::make($data['password']),
                'roles' => $data['roles'],
                'verified' => true,
                'email_verified_at' => now(),
            ]);

            $address = Address::create([
                'address_1' => $data['address_1'],
                'address_2' => $data['address_2'] ?? '',
                'city' => $data['city'],
                'state' => $data['state'],
                'zip' => $data['zip'],
                'country' => $data['country'],
            ]);

            Profile::create([
                'user_id' => $user->id,
                'phone' => $data['phone'],
                'gender' => $data['gender'],
                'address_id' => $address->id,
            ]);

            // Create role-specific records
            switch ($data['roles']) {
                case 'player':
                    Player::create([
                        'user_id' => $user->id,
                        'verified' => true,
                        'wins' => 0,
                        'losses' => 0,
                        'matches' => 0,
                        'win_rate' => 0,
                    ]);
                    break;
                case 'umpire':
                    Umpire::create([
                        'user_id' => $user->id,
                        'verified' => true,
                    ]);
                    break;
                case 'admin':
                    Admin::create([
                        'user_id' => $user->id,
                    ]);
                    break;
            }
        });

        return redirect()->back()->with('success', 'User created successfully');
    }

    public function edit(string $id)
    {
        $user = User::with(['profile.address'])->findOrFail($id);
        return response()->json(new UserFormResource($user));
    }

    public function update(Request $request, User $user)
    {
        $userData = $request->validate([
            'first_name' => 'required|string|max:255',
            'last_name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => $request->filled('password') ? ['required', 'string', 'min:8'] : '', // Removed 'confirmed' rule
            'roles' => 'required|string|in:player,umpire,admin',
            'phone' => 'required|string|max:255',
            'gender' => 'required|in:male,female,other',
            'avatar' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'address_1' => 'required|string|max:255',
            'address_2' => 'nullable|string|max:255',
            'city' => 'required|string|max:255',
            'state' => 'required|string|max:255',
            'zip' => 'required|string|max:255',
            'country' => 'required|string|max:255',
        ]);

        DB::transaction(function () use ($user, $userData, $request) {
            // Update user data
            $user->update([
                'first_name' => $userData['first_name'],
                'last_name' => $userData['last_name'],
                'email' => $userData['email'],
                'roles' => $userData['roles'],
            ]);

            // Only update password if provided
            if ($request->filled('password')) {
                $user->update(['password' => Hash::make($userData['password'])]);
            }

            // Handle avatar upload if provided
            if ($request->hasFile('avatar')) {
                $avatarPath = $request->file('avatar')->store('avatars', 'public');
            }

            // Update or create profile
            $user->profile()->updateOrCreate(
                ['user_id' => $user->id],
                [
                    'phone' => $userData['phone'],
                    'gender' => $userData['gender'],
                    'avatar' => $request->hasFile('avatar') ? $avatarPath : $user->profile?->avatar,
                ]
            );

            // Update or create address
            $address = $user->profile->address()->updateOrCreate(
                [
                    'address_1' => $userData['address_1'],
                    'address_2' => $userData['address_2'] ?? '',
                    'city' => $userData['city'],
                    'state' => $userData['state'],
                    'zip' => $userData['zip'],
                    'country' => $userData['country'],
                ]
            );
        });

        return redirect()->back()->with('success', 'User updated successfully');
    }
}
