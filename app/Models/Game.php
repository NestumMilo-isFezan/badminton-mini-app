<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Carbon\Carbon;

class Game extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'status',
        'type',
        'venue_id',
        'court_id',
        'start_time',
        'end_time',
        'player_1_id',
        'player_2_id',
        'umpire_id',
        'winner_id'
    ];

    protected $casts = [
        'status' => 'string',
        'type' => 'string',
        'start_time' => 'datetime',
        'end_time' => 'datetime',
    ];

    protected function getStartTimeAttribute($value)
    {
        return Carbon::parse($value)->setTimezone('Asia/Kuala_Lumpur');
    }

    protected function getEndTimeAttribute($value)
    {
        return Carbon::parse($value)->setTimezone('Asia/Kuala_Lumpur');
    }

    public function venue(): BelongsTo
    {
        return $this->belongsTo(Venue::class);
    }

    public function court(): BelongsTo
    {
        return $this->belongsTo(Court::class);
    }

    public function scores(): HasMany
    {
        return $this->hasMany(GameScore::class);
    }

    public function player_1(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'player_1_id');
    }

    public function player_2(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'player_2_id');
    }
}
