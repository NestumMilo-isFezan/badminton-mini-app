<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class VenueResource extends JsonResource
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
            'name' => $this->name,
            'image' => $this->image ?? null,
            'address' => [
                'address_1' => $this->address->address_1,
                'address_2' => $this->address->address_2 ?? null,
                'city' => $this->address->city,
                'state' => $this->address->state,
                'zip' => $this->address->zip,
                'country' => $this->address->country,
            ],
            'courts' => $this->courts->map(fn ($court) => [
                'id' => $court->id,
                'name' => $court->name
            ])
        ];
    }
}
