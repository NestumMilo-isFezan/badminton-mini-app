<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::get('/', function () {
    if(Auth::check()){
        $routes = [
            'admin' => 'admin.dashboard',
            'player' => 'player.home',
            'umpire' => 'umpire.home',
        ];

        $role = Auth::user()->roles;

        if(isset($routes[$role])){
            return redirect()->route($routes[$role]);
        }
    }
    return Inertia::render('welcome');
})->name('home');


require __DIR__.'/admin.php';
require __DIR__.'/player.php';
require __DIR__.'/umpire.php';
require __DIR__.'/settings.php';
require __DIR__.'/auth.php';
