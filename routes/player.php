<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'user_access:player'])->prefix('player')->name('player.')->group(function () {
    Route::get('/home', function () {
        return Inertia::render('player/home');
    })->name('home');
});
