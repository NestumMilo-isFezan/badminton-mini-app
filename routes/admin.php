<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'user_access:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('users', \App\Http\Controllers\Admin\UserController::class);
    Route::post('users/{user}/verify', [\App\Http\Controllers\Auth\VerifyUserController::class, 'verify'])->name('users.verify');

    Route::resource('venues', \App\Http\Controllers\Admin\VenueController::class)->except(['create', 'edit']);
    Route::resource('games', \App\Http\Controllers\Admin\GameController::class);

    // Score routes
    Route::get('/games/{game}/score', [\App\Http\Controllers\Admin\ScoreController::class, 'show'])->name('score.show');
    Route::prefix('games/{game}/score')->group(function () {
        Route::post('/', [\App\Http\Controllers\Admin\ScoreController::class, 'store'])->name('score.store');
        Route::put('/{set}', [\App\Http\Controllers\Admin\ScoreController::class, 'update'])->name('score.update');
        Route::post('/start-set/{set}', [\App\Http\Controllers\Admin\ScoreController::class, 'startSet'])->name('score.start-set');
        Route::post('/finish-set/{set}', [\App\Http\Controllers\Admin\ScoreController::class, 'finishSet'])->name('score.finish-set');
    });
});
