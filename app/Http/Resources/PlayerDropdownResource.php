<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class PlayerDropdownResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'name' => $this->user->first_name . ' ' . $this->user->last_name,
            'avatar' => $this->user->profile->avatar ?? null,
            'win_rate' => $this->win_rate,
            'gender' => $this->user->profile->gender ?? null,
        ];
    }
}
