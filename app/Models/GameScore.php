<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Factories\HasFactory;

class GameScore extends Model
{
    use HasFactory;

    protected $fillable = [
        'game_id',
        'player_id',
        'score',
        'set',
    ];

    protected $casts = [
        'score' => 'integer'
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function player(): BelongsTo
    {
        return $this->belongsTo(Player::class);
    }
}
