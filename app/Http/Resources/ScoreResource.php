<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ScoreResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            "id"=> $this->id,
            "set"=> $this->set,
            "player_1_score"=> $this->player_1_score,
            "player_2_score"=> $this->player_2_score,
            "status"=> $this->status,
            "start_at"=> $this->start_at,
            "match_duration"=> $this->match_duration,
        ];
    }
}
