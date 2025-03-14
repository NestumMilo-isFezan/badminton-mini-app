<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\GameScore;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Http\Resources\GameScoreResource;

class ScoreController extends Controller
{
    public function show(Request $request, GameScore $gameScore)
    {
        return Inertia::render('admin/score/show', [
            'gameScore' => GameScoreResource::collection($gameScore),
        ]);
    }
}
