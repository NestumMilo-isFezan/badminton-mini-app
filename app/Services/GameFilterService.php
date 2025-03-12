<?php

namespace App\Services;

use App\Models\Player;
use App\Models\Venue;
use App\Models\Court;
use App\Http\Resources\PlayerDropdownResource;
use App\Http\Resources\VenueDropdownResource;
use App\Http\Resources\CourtDropdownResource;
use Illuminate\Support\Collection;
use Illuminate\Support\Facades\DB;

class GameFilterService
{
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
     * Get filtered players based on availability
     */
    public function getAvailablePlayers(string $startTime, string $endTime): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllPlayers();
        }

        return PlayerDropdownResource::collection(
            Player::whereNotIn('id', function($query) use ($startTime, $endTime) {
                $query->select('player_1_id')
                    ->from('games')
                    ->where('start_time', '<=', $endTime)
                    ->where('end_time', '>=', $startTime)
                    ->union(
                        DB::table('games')
                            ->select('player_2_id')
                            ->where('start_time', '<=', $endTime)
                            ->where('end_time', '>=', $startTime)
                    );
            })->get()
        )->collection;
    }

    /**
     * Get filtered venues based on court availability
     */
    public function getAvailableVenues(string $startTime, string $endTime): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllVenues();
        }

        return VenueDropdownResource::collection(
            Venue::whereHas('courts', function ($query) use ($startTime, $endTime) {
                $query->whereDoesntHave('games', function ($gameQuery) use ($startTime, $endTime) {
                    $gameQuery->where(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $endTime)
                          ->where('end_time', '>=', $startTime);
                    });
                });
            })->get()
        )->collection;
    }

    /**
     * Get filtered courts based on availability
     */
    public function getAvailableCourts(int $venueId, string $startTime, string $endTime): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllCourts($venueId);
        }

        return CourtDropdownResource::collection(
            Court::where('venue_id', $venueId)
                ->whereDoesntHave('games', function ($query) use ($startTime, $endTime) {
                    $query->where(function ($q) use ($startTime, $endTime) {
                        $q->where('start_time', '<=', $endTime)
                          ->where('end_time', '>=', $startTime);
                    });
                })->get()
        )->collection;
    }

    /**
     * Get all available resources for game creation
     */
    public function getAvailableResources(?string $startTime = null, ?string $endTime = null, ?int $venueId = null): array
    {
        if (!$startTime || !$endTime) {
            return [
                'players' => [],
                'venues' => [],
                'courts' => [],
            ];
        }

        return [
            'players' => $this->getAvailablePlayers($startTime, $endTime),
            'venues' => $this->getAvailableVenues($startTime, $endTime),
            'courts' => $venueId ? $this->getAvailableCourts($venueId, $startTime, $endTime) : [],
        ];
    }
}
