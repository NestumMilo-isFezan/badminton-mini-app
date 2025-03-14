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
        return [
            "id"=> $this->id,
            "name" => $this->game->name,
            "category" => $this->game->category,
            "status" => $this->game->status,
            "umpire"=> [
                "name"=> $this->umpire->user->first_name . ' ' . $this->umpire->user->last_name,
                "avatar"=> $this->umpire->user->profile->avatar ?? null,
            ],
            "player_1" => [
                "id" => $this->player_1->id,
                "name"=> $this->player_1->user->first_name . ' ' . $this->player_1->user->last_name,
                "avatar"=> $this->player_1->user->profile->avatar ?? null,
                "win_rate"=> $this->player_1->win_rate,
                "win" => $this->player_1->wins,
                "losses" => $this->player_1->losses,
            ],
            "player_2" => [
                "id" => $this->player_2->id,
                "name"=> $this->player_2->user->first_name . ' ' . $this->player_2->user->last_name,
                "avatar"=> $this->player_2->user->profile->avatar ?? null,
                "win_rate"=> $this->player_2->win_rate,
                "win" => $this->player_2->wins,
                "losses" => $this->player_2->losses,
            ],
            "match_details"=> ScoreResource::collection($this->game->score),

        ];
    }
}
