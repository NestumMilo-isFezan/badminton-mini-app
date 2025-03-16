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
            "name" => $this->name,
            "category" => $this->type,
            "status" => $this->status,
            "start_time" => $this->start_time,
            "venue" => [
                "id" => $this->venue->id,
                "name" => $this->venue->name,
                "image" => $this->venue->image ?? null,
                "address" => [
                    "name"=> $this->venue->address->address_1 . '' . $this->venue->address->address_2 ?? null,
                    "city" => $this->venue->address->city,
                    "state" => $this->venue->address->state,
                    "zip" => $this->venue->address->zip,
                    "country" => $this->venue->address->country,
                ]
            ],
            "court" => [
                "id" => $this->court->id,
                "name" => $this->court->name,
            ],
            "umpire"=> [
                "name"=> $this->umpire ? $this->umpire->user->first_name . ' ' . $this->umpire->user->last_name : null,
                "avatar"=> $this->umpire ? $this->umpire->user->profile->avatar : null,
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
            "match_details" => $this->scores->count() > 0
                ? ScoreResource::collection($this->scores)
                : [[
                    "set" => 1,
                    "player_1_score" => 0,
                    "player_2_score" => 0,
                    "status" => "not_started",
                    "start_at" => null,
                    "match_duration" => null,
                ]],

        ];
    }
}
