<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserFormResource extends JsonResource
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
            'first_name' => $this->first_name,
            'last_name' => $this->last_name,
            'email' => $this->email,
            'roles' => $this->roles,
            'profile' => [
                'phone' => $this->profile?->phone,
                'gender' => $this->profile?->gender,
                'avatar' => $this->profile?->avatar,
                'address' => [
                    'address_1' => $this->profile?->address?->address_1,
                    'address_2' => $this->profile?->address?->address_2,
                    'city' => $this->profile?->address?->city,
                    'state' => $this->profile?->address?->state,
                    'zip' => $this->profile?->address?->zip,
                    'country' => $this->profile?->address?->country,
                ],
            ],
        ];
    }
}
