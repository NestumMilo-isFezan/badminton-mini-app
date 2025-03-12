<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class GameResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        $player_1 = $this->player_1;
        $player_2 = $this->player_2;
        return [
            'id' => $this->id,
            'name' => $this->name,
            'status' => $this->status,
            'type' => $this->type,
            'venue' => [
                'id' => $this->venue->id,
                'name' => $this->venue->name,
                'image' => $this->venue->image ?? null,
                'address' => [
                    'address' => $this->venue->address->address_1 . '' . $this->venue->address->address_2 ?? null,
                    'city' => $this->venue->address->city,
                    'state' => $this->venue->address->state,
                    'zip' => $this->venue->address->zip,
                    'country' => $this->venue->address->country,
                ]
            ],
            'court' => [
                'id' => $this->court->id,
                'name' => $this->court->name,
            ],
            'player_1' => [
                'id' => $player_1->id,
                'name' => $player_1->user->first_name . ' ' . $player_1->user->last_name,
                'avatar' => $player_1->user?->profile?->avatar ?? null,
                'win_rate' => $player_1->win_rate,
                'matches' => $player_1->matches,
                'wins' => $player_1->wins,
                'losses' => $player_1->losses,
            ],
            'player_2' => [
                'id' => $player_2->id,
                'name' => $player_2->user->first_name . ' ' . $player_2->user->last_name,
                'avatar' => $player_2->user?->profile?->avatar ?? null,
                'win_rate' => $player_2->win_rate,
                'matches' => $player_2->matches,
                'wins' => $player_2->wins,
                'losses' => $player_2->losses,
            ],
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,

            /*
            * Score will shown like this
            * Set 1 : 21-19
            * Set 2 : 15-12
            * Set 3 : 11-8
            */
            'scores' => $this->scores
                ->groupBy('set')
                ->map(function($setScores) {
                    $player1Score = $setScores->where('player_id', $this->player_1_id)->first()?->score ?? 0;
                    $player2Score = $setScores->where('player_id', $this->player_2_id)->first()?->score ?? 0;

                    return [
                        'set' => $setScores->first()->set,
                        'player_1_score' => $player1Score,
                        'player_2_score' => $player2Score,
                    ];
                })
                ->values()
                ->toArray(),
            'winner' => $this->winner_id ? [
                'id' => $this->winner->id,
                'name' => $this->winner->name,
                'avatar' => $this->winner->avatar ?? null,
            ] : [
                'id' => null,
                'name' => null,
                'avatar' => null,
            ],
            'umpire' => $this->umpire_id ? [
                'id' => $this->umpire->id,
                'name' => $this->umpire->name,
                'avatar' => $this->umpire->avatar ?? null,
            ] : [
                'id' => null,
                'name' => null,
                'avatar' => null,
            ]
        ];
    }
}
