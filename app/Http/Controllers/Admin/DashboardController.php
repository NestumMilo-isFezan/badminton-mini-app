<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Venue;
use App\Models\Game;
use App\Models\Player;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;
use Carbon\Carbon;

class DashboardController extends Controller
{
    /*
    * Display the admin dashboard.
    * 1. User count except admin, details of user count per roles
    * 2. Venue count, details of venue count per category
    * 3. Game count, details of game count per status
    * Tabs :
    * 1. Match (Upcoming, Live, Past)
    * 2. Player with highest win rate
    */
    public function index()
    {
        // 1. User statistics - using the roles enum from users table
        $userStats = [
            'total' => User::where('roles', '!=', 'admin')->count(),
            'by_role' => [
                'player' => User::where('roles', 'player')->count(),
                'umpire' => User::where('roles', 'umpire')->count(),
            ],
            'verified' => User::where('verified', true)->count()
        ];

        // 2. Venue statistics - including courts relationship
        $venueStats = [
            'total' => Venue::count(),
            'courts_count' => DB::table('courts')->count(),
            'venues_with_courts' => Venue::has('courts')->count()
        ];

        // 3. Game statistics - using the status enum from games table
        $gameStats = [
            'total' => Game::count(),
            'by_status' => [
                'pending' => Game::where('status', 'pending')->count(),
                'in_progress' => Game::where('status', 'in_progress')->count(),
                'completed' => Game::where('status', 'completed')->count(),
            ],
            'by_type' => [
                'single' => Game::where('type', 'single')->count(),
                'double' => Game::where('type', 'double')->count(),
            ]
        ];

        // 4. Match tabs data with proper relationships
        $matches = [
            'upcoming' => Game::with([
                'venue.address',
                'court',
                'player1.user',
                'player2.user',
                'umpire.user'
            ])
                ->where('status', 'pending')
                ->where('start_time', '>', now())
                ->orderBy('start_time')
                ->take(5)
                ->get(),

            'live' => Game::with([
                'venue.address',
                'court',
                'player1.user',
                'player2.user',
                'umpire.user',
                'gameScores'
            ])
                ->where('status', 'in_progress')
                ->orderBy('start_time')
                ->get(),

            'past' => Game::with([
                'venue.address',
                'court',
                'player1.user',
                'player2.user',
                'umpire.user',
                'winner.user',
                'gameScores'
            ])
                ->where('status', 'completed')
                ->orderBy('start_time', 'desc')
                ->take(5)
                ->get(),
        ];

        // 5. Top players - using the players table stats
        $topPlayers = Player::with(['user', 'user.profile'])
            ->where('matches', '>', 0)
            ->orderBy('win_rate', 'desc')
            ->orderBy('wins', 'desc')
            ->take(5)
            ->get()
            ->map(function($player) {
                return [
                    'id' => $player->id,
                    'name' => $player->user->first_name . ' ' . $player->user->last_name,
                    'avatar' => $player->user->profile->avatar,
                    'matches' => $player->matches,
                    'wins' => $player->wins,
                    'losses' => $player->losses,
                    'win_rate' => $player->win_rate
                ];
            });

        return Inertia::render('admin/dashboard', [
            'stats' => [
                'users' => $userStats,
                'venues' => $venueStats,
                'games' => $gameStats,
            ],
            'matches' => $matches,
            'topPlayers' => $topPlayers,
        ]);
    }
}
