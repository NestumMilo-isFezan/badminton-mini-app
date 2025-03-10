<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasOne;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Notifications\Notifiable;

class User extends Authenticatable
{
    use HasFactory, Notifiable;

    protected $fillable = [
        'first_name',
        'last_name',
        'email',
        'password',
        'roles'
    ];

    protected $hidden = [
        'password',
        'remember_token',
    ];

    protected $casts = [
        'email_verified_at' => 'datetime',
        'password' => 'hashed',
        'roles' => 'string'
    ];

    public function profile(): HasOne
    {
        return $this->hasOne(Profile::class);
    }

    public function player(): HasOne
    {
        return $this->hasOne(Player::class);
    }

    public function umpire(): HasOne
    {
        return $this->hasOne(Umpire::class);
    }

    public function admin(): HasOne
    {
        return $this->hasOne(Admin::class);
    }
}
