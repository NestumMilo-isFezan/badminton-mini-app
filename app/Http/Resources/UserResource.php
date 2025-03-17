<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class UserResource extends JsonResource
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
            "name"=> $this->first_name . ' ' . $this->last_name,
            'email'=> $this->email,
            "avatar"=> $this->profile->avatar ?? null,
            "created_at"=> $this->created_at,
            "updated_at"=> $this->updated_at,
            "phone" => $this->profile->phone ?? null,
            "gender" => $this->profile->gender ?? null,
            "verified" => $this->email_verified_at ? true : false,
            "roles" => $this->roles,
            "address" => [
                "name"=> $this->profile->address->address_1 . '' . $this->profile->address->address_2 ?? null,
                "city" => $this->profile->address->city,
                "state" => $this->profile->address->state,
                "zip" => $this->profile->address->zip,
                "country" => $this->profile->address->country,
            ]
        ];
    }
}
