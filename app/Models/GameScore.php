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
        'set',
        'player_1_id',
        'player_2_id',
        'player_1_score',
        'player_2_score',
        'status',
        'start_at',
        'match_duration'
    ];

    protected $casts = [
        'player_1_score' => 'integer',
        'player_2_score' => 'integer',
        'start_at' => 'datetime',
        'match_duration' => 'integer'
    ];

    public function game(): BelongsTo
    {
        return $this->belongsTo(Game::class);
    }

    public function player1(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'player_1_id');
    }

    public function player2(): BelongsTo
    {
        return $this->belongsTo(Player::class, 'player_2_id');
    }
}
