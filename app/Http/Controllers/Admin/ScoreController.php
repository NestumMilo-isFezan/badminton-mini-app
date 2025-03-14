<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\Game;
use App\Models\GameScore;
use Illuminate\Http\Request;
use Carbon\Carbon;

class ScoreController extends Controller
{
    public function show(Game $game, GameScore $score)
    {
        return response()->json(['score' => $score]);
    }

    public function store(Request $request, Game $game)
    {
        $score = $game->scores()->create([
            'set' => $request->set,
            'player_1_id' => $game->player_1_id,
            'player_2_id' => $game->player_2_id,
            'player_1_score' => 0,
            'player_2_score' => 0,
            'start_at' => Carbon::now(),
            'status' => 'not_started'
        ]);
    }

    public function update(Request $request, Game $game, GameScore $score)
    {
        $request->validate([
            'player_id' => 'required|integer',
            'action' => 'required|in:increment,decrement'
        ]);

        $playerId = $request->input('player_id');
        $action = $request->input('action');

        // Determine which player's score to update
        $field = $playerId === $game->player_1_id ? 'player_1_score' : 'player_2_score';
        $currentScore = $score->$field;

        // Update the score based on the action
        if ($action === 'increment') {
            $score->$field = $currentScore + 1;
        } else {
            $score->$field = max(0, $currentScore - 1);
        }

        $score->save();
    }

    public function startSet(Request $request, Game $game, GameScore $score)
    {
        $score->update([
            'start_at' => now(),
            'status' => 'started'
        ]);
    }

    public function finishSet(Request $request, Game $game, GameScore $score)
    {
        $matchDuration = $request->input('match_duration');

        // Convert HH:MM:SS to seconds if string format is provided
        if (is_string($matchDuration)) {
            $parts = array_reverse(explode(':', $matchDuration));
            $matchDuration = ($parts[0] ?? 0) + // seconds
                           (($parts[1] ?? 0) * 60) + // minutes
                           (($parts[2] ?? 0) * 3600); // hours
        }

        $score->update([
            'status' => 'completed',
            'match_duration' => $matchDuration
        ]);
    }

    public function retract(Request $request, Game $game, GameScore $score)
    {
        //
    }
}
