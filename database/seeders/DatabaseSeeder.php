<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        User::create([
            'email' => 'miloadmin@gmail.com',
            'password' => Hash::make('terraxp13'),
            'first_name' => 'Admin',
            'last_name' => 'User',
            'roles' => 'admin'
        ]);

        User::create([
            'email' => 'nestumumpire@gmail.com',
            'password' => Hash::make('terraxp13'),
            'first_name' => 'Umpire',
            'last_name' => 'User',
            'roles' => 'umpire'
        ]);

        User::create([
            'email' => 'nestumplayer@gmail.com',
            'password' => Hash::make('terraxp13'),
            'first_name' => 'Player',
            'last_name' => 'User',
            'roles' => 'player'
        ]);
    }
}
