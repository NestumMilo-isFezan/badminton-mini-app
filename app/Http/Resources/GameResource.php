<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;
use Carbon\Carbon;

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
                'is_winner' => $this->winner_id === $player_1->id ?? false,
            ],
            'player_2' => [
                'id' => $player_2->id,
                'name' => $player_2->user->first_name . ' ' . $player_2->user->last_name,
                'avatar' => $player_2->user?->profile?->avatar ?? null,
                'win_rate' => $player_2->win_rate,
                'matches' => $player_2->matches,
                'wins' => $player_2->wins,
                'losses' => $player_2->losses,
                'is_winner' => $this->winner_id === $player_2->id ?? false,
            ],
            'start_time' => $this->start_time,
            'end_time' => $this->end_time,
            'scores' => $this->scores->map(function($score) {
                return [
                    'id' => $score->id,
                    'set' => $score->set,
                    'player_1_score' => $score->player_1_score,
                    'player_2_score' => $score->player_2_score,
                    'start_at' => $score->start_at,
                    'match_duration' => $this->formatDuration($score->match_duration),
                    'status' => $score->status,
                ];
            }),
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

    /**
     * Format duration from seconds to HH:MM:SS
     *
     * @param int|null $seconds
     * @return string|null
     */
    private function formatDuration(?int $seconds): ?string
    {
        if ($seconds === null) {
            return null;
        }

        $hours = floor($seconds / 3600);
        $minutes = floor(($seconds % 3600) / 60);
        $remainingSeconds = $seconds % 60;

        return sprintf(
            '%02d:%02d:%02d',
            $hours,
            $minutes,
            $remainingSeconds
        );
    }
}
