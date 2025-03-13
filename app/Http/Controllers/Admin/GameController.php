<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Services\GameFilterService;
use App\Models\Game;
use Illuminate\Http\Request;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;
use App\Http\Resources\GameResource;

class GameController extends Controller
{
    protected $gameService;
    protected $filterService;

    public function __construct(GameFilterService $filterService)
    {
        $this->filterService = $filterService;
    }

    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $games = Game::query();

        if(request()->has('search')) {
            $games->where('name', 'like', '%' . request('search') . '%');
        }

        $games = $games->paginate(10);


        return Inertia::render('admin/game/index', [
            'games' => GameResource::collection($games)
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return $this->filterService->getAvailableResources(
            request('start_time'),
            request('venue') ? (int)request('venue') : null
        );
    }

    /**
     * Admin create create match between players
     */
    public function store(Request $request)
    {
        $game = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'venue_id' => 'required|exists:venues,id',
            'court_id' => 'required|exists:courts,id',
            'player_1_id' => 'required|exists:players,id',
            'player_2_id' => 'required|exists:players,id',
            'start_time' => 'required|date',
        ]);

        DB::transaction(function () use ($game) {
            $game['start_time'] = Carbon::parse($game['start_time'])->setTimezone('Asia/Kuala_Lumpur');
            Game::create($game);
        });
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $game = $request->validate([
            'name' => 'required|string|max:255',
            'status' => 'required|string|max:255',
            'type' => 'required|string|max:255',
            'venue_id' => 'required|exists:venues,id',
            'court_id' => 'required|exists:courts,id',
            'player_1_id' => 'required|exists:players,id',
            'player_2_id' => 'required|exists:players,id',
            'start_time' => 'required|date',
        ]);

        DB::transaction(function () use ($game, $id) {
            $game['start_time'] = Carbon::parse($game['start_time'])->setTimezone('Asia/Kuala_Lumpur');
            Game::findOrFail($id)->update($game);
        });
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $game = Game::findOrFail($id);

        DB::transaction(function () use ($game) {
            $game->delete();
        });

        return redirect()->route('admin.games.index')
            ->with('success', 'Game deleted successfully.');
    }
}
