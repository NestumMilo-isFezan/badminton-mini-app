<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\Admin\ScoreController;
use App\Http\Controllers\Admin\GameController;
use App\Http\Controllers\Admin\VenueController;

Route::middleware(['auth', 'user_access:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('venues', VenueController::class)->except(['create', 'edit']);
    Route::resource('games', GameController::class);

    // Update the score routes to match the frontend calls
    Route::prefix('games/{game}/scores')->name('games.scores.')->group(function () {
        Route::get('/{score}', [ScoreController::class, 'show'])->name('show');
        Route::post('/', [ScoreController::class, 'store'])->name('store');
        Route::put('/{score}/update', [ScoreController::class, 'update'])->name('update');
        Route::put('/{score}/start', [ScoreController::class, 'startSet'])->name('start');
        Route::put('/{score}/finish', [ScoreController::class, 'finishSet'])->name('finish');
        Route::put('/{score}/retract', [ScoreController::class, 'retract'])->name('retract');
    });
});
