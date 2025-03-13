<?php

namespace App\Services;

use App\Models\Player;
use App\Models\Venue;
use App\Models\Court;
use App\Models\Game;
use App\Http\Resources\PlayerDropdownResource;
use App\Http\Resources\VenueDropdownResource;
use App\Http\Resources\CourtDropdownResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class GameFilterService
{
    private const GAME_DURATION_HOURS = 2;

    /**
     * Get all players without filtering
     */
    private function getAllPlayers(): Collection
    {
        return PlayerDropdownResource::collection(Player::all())->collection;
    }

    /**
     * Get all venues without filtering
     */
    private function getAllVenues(): Collection
    {
        return VenueDropdownResource::collection(Venue::all())->collection;
    }

    /**
     * Get all courts for a venue without filtering
     */
    private function getAllCourts(int $venueId): Collection
    {
        return CourtDropdownResource::collection(Court::where('venue_id', $venueId)->get())->collection;
    }

    /**
     * Check if any games exist in the system
     */
    private function hasGames(): bool
    {
        return Court::whereHas('games')->exists();
    }

    /**
     * Get filtered players based on availability, including current players if editing
     */
    public function getAvailablePlayers(string $startTime, ?Game $currentGame = null): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllPlayers();
        }

        $startDateTime = Carbon::parse($startTime);

        // First, get all players
        $query = Player::query();

        if (!$currentGame) {
            // For new games, exclude players who are already in games at this time
            $query->whereNotIn('id', function($subQuery) use ($startDateTime) {
                $subQuery->select('player_1_id')
                    ->from('games')
                    ->where('start_time', $startDateTime)
                    ->union(
                        DB::table('games')
                            ->select('player_2_id')
                            ->where('start_time', $startDateTime)
                    );
            });
        } else {
            // For existing games, exclude players who are in OTHER games at this time
            $query->where(function($q) use ($startDateTime, $currentGame) {
                $q->whereNotIn('id', function($subQuery) use ($startDateTime, $currentGame) {
                    $subQuery->select('player_1_id')
                        ->from('games')
                        ->where('start_time', $startDateTime)
                        ->where('id', '!=', $currentGame->id)
                        ->union(
                            DB::table('games')
                                ->select('player_2_id')
                                ->where('start_time', $startDateTime)
                                ->where('id', '!=', $currentGame->id)
                        );
                })
                // Always include the current game's players
                ->orWhereIn('id', [$currentGame->player_1_id, $currentGame->player_2_id]);
            });
        }

        return PlayerDropdownResource::collection($query->get())->collection;
    }

    /**
     * Get filtered venues based on court availability, including current venue if editing
     */
    public function getAvailableVenues(string $startTime, ?Game $currentGame = null): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllVenues();
        }

        $startDateTime = Carbon::parse($startTime);

        // Start with all venues
        $query = Venue::query();

        if (!$currentGame) {
            // For new games, exclude venues with no available courts
            $query->whereHas('courts', function($courtQuery) use ($startDateTime) {
                $courtQuery->whereDoesntHave('games', function($gameQuery) use ($startDateTime) {
                    $gameQuery->where('start_time', $startDateTime);
                });
            });
        } else {
            // For existing games, include current venue and venues with available courts
            $query->where(function($q) use ($startDateTime, $currentGame) {
                $q->whereHas('courts', function($courtQuery) use ($startDateTime, $currentGame) {
                    $courtQuery->whereDoesntHave('games', function($gameQuery) use ($startDateTime, $currentGame) {
                        $gameQuery->where('start_time', $startDateTime)
                            ->where('id', '!=', $currentGame->id);
                    });
                })
                // Always include the current game's venue
                ->orWhere('id', $currentGame->venue_id);
            });
        }

        return VenueDropdownResource::collection($query->get())->collection;
    }

    /**
     * Get filtered courts based on availability, including current court if editing
     */
    public function getAvailableCourts(int $venueId, string $startTime, ?Game $currentGame = null): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllCourts($venueId);
        }

        $startDateTime = Carbon::parse($startTime);

        // Start with courts from the selected venue
        $query = Court::where('venue_id', $venueId);

        if (!$currentGame) {
            // For new games, exclude courts that are booked
            $query->whereDoesntHave('games', function($gameQuery) use ($startDateTime) {
                $gameQuery->where('start_time', $startDateTime);
            });
        } else {
            // For existing games, include current court and available courts
            $query->where(function($q) use ($startDateTime, $currentGame) {
                $q->whereDoesntHave('games', function($gameQuery) use ($startDateTime, $currentGame) {
                    $gameQuery->where('start_time', $startDateTime)
                        ->where('id', '!=', $currentGame->id);
                })
                // Always include the current game's court
                ->orWhere('id', $currentGame->court_id);
            });
        }

        return CourtDropdownResource::collection($query->get())->collection;
    }

    /**
     * Get all available resources for game creation or editing
     */
    public function getAvailableResources(?string $startTime = null, ?int $venueId = null, ?int $gameId = null): array
    {
        if (!$startTime) {
            return [
                'players' => [],
                'venues' => [],
                'courts' => [],
            ];
        }

        $currentGame = $gameId ? Game::find($gameId) : null;

        return [
            'players' => $this->getAvailablePlayers($startTime, $currentGame),
            'venues' => $this->getAvailableVenues($startTime, $currentGame),
            'courts' => $venueId ? $this->getAvailableCourts($venueId, $startTime, $currentGame) : [],
        ];
    }
}
