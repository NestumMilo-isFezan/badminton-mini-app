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

    private function getTimeRange(string $startTime): array
    {
        $start = Carbon::parse($startTime);
        $end = $start->copy()->addHours(self::GAME_DURATION_HOURS);
        return [$start, $end];
    }

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
     * Get available players for new game creation
     */
    private function getAvailablePlayersForCreate(string $startTime): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllPlayers();
        }

        [$startDateTime, $endDateTime] = $this->getTimeRange($startTime);

        return PlayerDropdownResource::collection(
            Player::whereNotIn('id', function($subQuery) use ($startDateTime, $endDateTime) {
                $subQuery->select('player_1_id')
                    ->from('games')
                    ->where(function($query) use ($startDateTime, $endDateTime) {
                        $query->where(function($q) use ($startDateTime, $endDateTime) {
                            $q->where('start_time', '<=', $endDateTime)
                              ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                        });
                    })
                    ->union(
                        DB::table('games')
                            ->select('player_2_id')
                            ->where(function($query) use ($startDateTime, $endDateTime) {
                                $query->where(function($q) use ($startDateTime, $endDateTime) {
                                    $q->where('start_time', '<=', $endDateTime)
                                      ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                                });
                            })
                    );
            })->get()
        )->collection;
    }

    /**
     * Get available players for game editing
     */
    private function getAvailablePlayersForEdit(string $startTime, int $gameId): Collection
    {
        [$startDateTime, $endDateTime] = $this->getTimeRange($startTime);

        return PlayerDropdownResource::collection(
            Player::whereNotIn('id', function($subQuery) use ($startDateTime, $endDateTime, $gameId) {
                $subQuery->select('player_1_id')
                    ->from('games')
                    ->where('id', '!=', $gameId) // Exclude current game
                    ->where(function($query) use ($startDateTime, $endDateTime) {
                        $query->where('start_time', '<=', $endDateTime)
                              ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                    })
                    ->union(
                        DB::table('games')
                            ->select('player_2_id')
                            ->where('id', '!=', $gameId) // Exclude current game
                            ->where(function($query) use ($startDateTime, $endDateTime) {
                                $query->where('start_time', '<=', $endDateTime)
                                      ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                            })
                    );
            })->get()
        )->collection;
    }

    /**
     * Get available venues for new game creation
     */
    private function getAvailableVenuesForCreate(string $startTime): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllVenues();
        }

        [$startDateTime, $endDateTime] = $this->getTimeRange($startTime);

        return VenueDropdownResource::collection(
            Venue::whereHas('courts', function($courtQuery) use ($startDateTime, $endDateTime) {
                $courtQuery->whereDoesntHave('games', function($gameQuery) use ($startDateTime, $endDateTime) {
                    $gameQuery->where(function($q) use ($startDateTime, $endDateTime) {
                        $q->where('start_time', '<=', $endDateTime)
                          ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                    });
                });
            })->get()
        )->collection;
    }

    /**
     * Get available venues for game editing
     */
    private function getAvailableVenuesForEdit(string $startTime, int $gameId): Collection
    {
        [$startDateTime, $endDateTime] = $this->getTimeRange($startTime);

        return VenueDropdownResource::collection(
            Venue::whereHas('courts', function($courtQuery) use ($startDateTime, $endDateTime, $gameId) {
                $courtQuery->whereDoesntHave('games', function($gameQuery) use ($startDateTime, $endDateTime, $gameId) {
                    $gameQuery->where('id', '!=', $gameId) // Exclude current game
                        ->where(function($q) use ($startDateTime, $endDateTime) {
                            $q->where('start_time', '<=', $endDateTime)
                              ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                        });
                });
            })->get()
        )->collection;
    }

    /**
     * Get available courts for new game creation
     */
    private function getAvailableCourtsForCreate(int $venueId, string $startTime): Collection
    {
        if (!$this->hasGames()) {
            return $this->getAllCourts($venueId);
        }

        [$startDateTime, $endDateTime] = $this->getTimeRange($startTime);

        return CourtDropdownResource::collection(
            Court::where('venue_id', $venueId)
                ->whereDoesntHave('games', function($gameQuery) use ($startDateTime, $endDateTime) {
                    $gameQuery->where(function($q) use ($startDateTime, $endDateTime) {
                        $q->where('start_time', '<=', $endDateTime)
                          ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                    });
                })->get()
        )->collection;
    }

    /**
     * Get available courts for game editing
     */
    private function getAvailableCourtsForEdit(int $venueId, string $startTime, int $gameId): Collection
    {
        [$startDateTime, $endDateTime] = $this->getTimeRange($startTime);

        return CourtDropdownResource::collection(
            Court::where('venue_id', $venueId)
                ->whereDoesntHave('games', function($gameQuery) use ($startDateTime, $endDateTime, $gameId) {
                    $gameQuery->where('id', '!=', $gameId) // Exclude current game
                        ->where(function($q) use ($startDateTime, $endDateTime) {
                            $q->where('start_time', '<=', $endDateTime)
                              ->where(DB::raw("DATE_ADD(start_time, INTERVAL " . self::GAME_DURATION_HOURS . " HOUR)"), '>', $startDateTime);
                        });
                })->get()
        )->collection;
    }

    /**
     * Get all available resources for game creation
     */
    public function getAvailableResourcesForCreate(?string $startTime = null, ?int $venueId = null): array
    {
        if (!$startTime) {
            return [
                'players' => [],
                'venues' => [],
                'courts' => [],
            ];
        }

        return [
            'players' => $this->getAvailablePlayersForCreate($startTime),
            'venues' => $this->getAvailableVenuesForCreate($startTime),
            'courts' => $venueId ? $this->getAvailableCourtsForCreate($venueId, $startTime) : [],
        ];
    }

    /**
     * Get all available resources for game editing
     */
    public function getAvailableResourcesForEdit(string $startTime, ?int $venueId, int $gameId): array
    {
        return [
            'players' => $this->getAvailablePlayersForEdit($startTime, $gameId),
            'venues' => $this->getAvailableVenuesForEdit($startTime, $gameId),
            'courts' => $venueId ? $this->getAvailableCourtsForEdit($venueId, $startTime, $gameId) : collect([]),
        ];
    }
}
