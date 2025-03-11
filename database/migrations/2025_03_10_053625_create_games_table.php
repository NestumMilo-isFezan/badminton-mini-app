<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('venues', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('image')->nullable();
            $table->string('contact')->nullable();
            $table->foreignId('address_id')->constrained('addresses');
            $table->timestamps();
        });

        Schema::create('courts', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->foreignId('venue_id')->constrained('venues');
            $table->timestamps();
        });

        Schema::create('games', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('status', ['pending', 'in_progress', 'completed']);
            $table->enum('type', ['single', 'double']);
            $table->foreignId('venue_id')->constrained('venues');
            $table->foreignId('court_id')->constrained('courts');
            $table->datetime('start_time')->nullable();
            $table->datetime('end_time')->nullable();
            $table->foreignId('player_1_id')->constrained('players');
            $table->foreignId('player_2_id')->constrained('players');
            $table->foreignId('umpire_id')->constrained('umpires')->nullable();
            $table->foreignId('winner_id')->constrained('players')->nullable();
            $table->timestamps();
        });

        Schema::create('game_scores', function (Blueprint $table) {
            $table->id();
            $table->integer('set');
            $table->foreignId('game_id')->constrained('games');
            $table->foreignId('player_id')->constrained('players');
            $table->integer('score');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('venues');
        Schema::dropIfExists('courts');
        Schema::dropIfExists('games');
        Schema::dropIfExists('game_scores');
    }
};
