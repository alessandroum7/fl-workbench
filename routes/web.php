<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\ProjectFileController;
Route::inertia('/', 'welcome')->name('home');

Route::middleware(['auth', 'verified'])->group(function () {
    Route::inertia('dashboard', 'dashboard')->name('dashboard');
    Route::resource('projects', ProjectController::class)
        ->only(['index', 'create', 'store', 'show']);
    Route::resource('projects.files', ProjectFileController::class)
        ->only(['store', 'update', 'destroy'])
        ->shallow();
});

require __DIR__.'/settings.php';