<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Address extends Model
{
    use HasFactory;

    protected $fillable = [
        'address_1',
        'address_2',
        'city',
        'state',
        'zip'
    ];

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function venue(): HasOne
    {
        return $this->hasOne(Venue::class);
    }
}