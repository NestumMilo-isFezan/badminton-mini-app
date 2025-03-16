<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Http\Resources\GameScoreResource;
use App\Models\Game;
use App\Models\GameScore;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ScoreController extends Controller
{
    public function show(Request $request, Game $game)
    {
        return Inertia::render('admin/score/show', [
            'gameScore' => new GameScoreResource($game),
        ]);
    }

    public function store(Request $request, Game $game)
    {
        $game->scores()->create([
            'set' => $request->set,
            'player_1_id' => $game->player_1_id,
            'player_2_id' => $game->player_2_id,
            'player_1_score' => 0,
            'player_2_score' => 0,
            'start_at' => null,
            'status' => 'not_started'
        ]);
    }

    public function update(Request $request, Game $game, int $set)
    {
        $request->validate([
            'player_id' => 'required|integer',
            'action' => 'required|in:increment,decrement'
        ]);

        $score = $game->scores()->where('set', $set)->first();

        if ($score->status !== 'started') {
            return response()->json(['message' => 'Cannot update score. Set is not in progress.'], 422);
        }

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

    public function startSet(Request $request, Game $game, int $set)
    {
        // Find or create the score for this set
        $score = $game->scores()->firstOrCreate(
            ['set' => $set],
            [
                'player_1_id' => $game->player_1_id,  // Add player 1 ID
                'player_2_id' => $game->player_2_id,  // Add player 2 ID
                'player_1_score' => 0,
                'player_2_score' => 0,
                'status' => 'not_started'
            ]
        );

        $score->update([
            'status' => 'started',
            'start_at' => now()
        ]);
    }

    public function finishSet(Request $request, Game $game, int $set)
    {
        $request->validate([
            'match_duration' => 'required|integer'
        ]);

        $score = $game->scores()->where('set', $set)->first();

        // Check if the set is not started
        if ($score->status !== 'started') {
            return response()->json(['message' => 'Cannot finish a set that hasn\'t started'], 422);
        }

        $score->update([
            'status' => 'completed',
            'match_duration' => $request->match_duration
        ]);

        // Check if this was the final set or if there's a clear winner
        $completedSets = $game->scores()->where('status', 'completed')->count();
        $player1Wins = $game->scores()
            ->where('status', 'completed')
            ->where('player_1_score', '>', 'player_2_score')
            ->count();

        // If either player has won 2 sets, or we've completed 3 sets, end the game
        if ($player1Wins >= 2 || ($completedSets - $player1Wins) >= 2 || $completedSets >= 3) {
            $game->update([
                'status' => 'completed',
                'end_time' => now()
            ]);
        }
    }

    public function retract(Request $request, Game $game, int $set)
    {
        // Implement retraction logic here
        // This could involve reverting the last score change
        // or canceling a completed set
    }
}
