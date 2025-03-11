<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

Route::middleware(['auth', 'user_access:admin'])->prefix('admin')->name('admin.')->group(function () {
    Route::get('/dashboard', function () {
        return Inertia::render('admin/dashboard');
    })->name('dashboard');

    Route::resource('venues', \App\Http\Controllers\Admin\VenueController::class);
    Route::resource('courts', \App\Http\Controllers\Admin\CourtController::class)->except(['index']);
});
