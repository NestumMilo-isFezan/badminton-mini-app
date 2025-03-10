<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'user_access:umpire'])->prefix('umpire')->name('umpire.')->group(function () {
    Route::get('/home', function () {
        return Inertia::render('umpire/home');
    })->name('home');
});
