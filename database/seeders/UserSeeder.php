<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Profile;
use App\Models\Address;
use App\Models\Player;
use App\Models\Umpire;
use App\Models\Admin;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Create Admin
        $adminUser = User::create([
            'first_name' => 'Admin',
            'last_name' => 'User',
            'email' => 'admin@example.com',
            'password' => Hash::make('terraxp13'),
            'roles' => 'admin',
            'verified' => true,
            'email_verified_at' => now(),
        ]);

        Admin::create(['user_id' => $adminUser->id]);

        // Create Players
        $players = [
            [
                'first_name' => 'Lee',
                'last_name' => 'Chong Wei',
                'email' => 'lee.chongwei@example.com',
            ],
            [
                'first_name' => 'Lin',
                'last_name' => 'Dan',
                'email' => 'lin.dan@example.com',
            ],
            [
                'first_name' => 'Viktor',
                'last_name' => 'Axelsen',
                'email' => 'viktor.axelsen@example.com',
            ],
            [
                'first_name' => 'Kento',
                'last_name' => 'Momota',
                'email' => 'kento.momota@example.com',
            ],
        ];

        foreach ($players as $playerData) {
            $user = User::create([
                'first_name' => $playerData['first_name'],
                'last_name' => $playerData['last_name'],
                'email' => $playerData['email'],
                'password' => Hash::make('terraxp13'),
                'roles' => 'player',
                'verified' => true,
                'email_verified_at' => now(),
            ]);

            $wins = rand(20, 40);
            $losses = rand(5, 15);
            $matches = $wins + $losses;
            $winRate = $matches > 0 ? ($wins / $matches) * 100 : 0;

            Player::create([
                'user_id' => $user->id,
                'verified' => true,
                'wins' => $wins,
                'losses' => $losses,
                'matches' => $matches,
                'win_rate' => $winRate,
            ]);
        }

        // Create Umpires
        $umpires = [
            [
                'first_name' => 'John',
                'last_name' => 'Smith',
                'email' => 'john.smith@example.com',
            ],
            [
                'first_name' => 'Sarah',
                'last_name' => 'Johnson',
                'email' => 'sarah.johnson@example.com',
            ],
        ];

        foreach ($umpires as $umpireData) {
            $user = User::create([
                'first_name' => $umpireData['first_name'],
                'last_name' => $umpireData['last_name'],
                'email' => $umpireData['email'],
                'password' => Hash::make('terraxp13'),
                'roles' => 'umpire',
                'verified' => true,
                'email_verified_at' => now(),
            ]);

            Umpire::create([
                'user_id' => $user->id,
                'verified' => true,
            ]);
        }

        // Create profiles and addresses for all users
        $users = User::all();
        foreach ($users as $user) {
            // Create address
            $address = Address::create([
                'address_1' => fake()->streetAddress(),
                'address_2' => fake()->secondaryAddress(),
                'city' => fake()->city(),
                'state' => fake()->state(),
                'zip' => fake()->postcode(),
                'country' => fake()->country(),
            ]);

            // Create profile
            Profile::create([
                'user_id' => $user->id,
                'phone' => fake()->phoneNumber(),
                'avatar' => null,
                'gender' => fake()->randomElement(['male', 'female', 'other']),
                'address_id' => $address->id,
            ]);
        }
    }
}
