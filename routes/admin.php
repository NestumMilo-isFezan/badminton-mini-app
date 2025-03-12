<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'user_access:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('venues', \App\Http\Controllers\Admin\VenueController::class)->except(['create', 'edit']);
    Route::resource('games', \App\Http\Controllers\Admin\GameController::class)->except(['create', 'edit']);
});
