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
            "game_id"=> $this->game_id,
            "player"=> PlayerDropdownResource::make($this->player),
            "score"=> $this->score,
        ];
    }
}
