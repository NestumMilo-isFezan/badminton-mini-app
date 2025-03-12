<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class Court extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'venue_id'
    ];

    public function venue()
    {
        return $this->belongsTo(Venue::class);
    }

    public function games()
    {
        return $this->hasMany(Game::class);
    }
}
