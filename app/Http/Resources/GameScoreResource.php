<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameScoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        // take from Game
        // Score model with the same set have 2 array for each player
        // thus like this
        $scores = $this->scores->groupBy('set');

        return [
            "set"=> $this->set,
            "player_1"=> ScoreResource::collection($scores[$this->set][0]),
            "player_2"=> ScoreResource::collection($scores[$this->set][1]),
        ];
    }
}
