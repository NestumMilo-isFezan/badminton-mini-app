<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Game;
use Inertia\Inertia;
use Illuminate\Support\Facades\DB;

class GameController extends Controller
{
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

        return Inertia::render('admin/game/index');
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        //
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
            'end_time' => 'required|date',
        ]);

        DB::transaction(function () use ($game) {
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
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
