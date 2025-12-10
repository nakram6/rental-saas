<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicCatalogController;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Route;
use Inertia\Inertia;

/*
|--------------------------------------------------------------------------
| Public Routes (Client Side)
|--------------------------------------------------------------------------
*/

// 🌟 Public catalog (client view)
Route::get('/', [PublicCatalogController::class, 'home'])->name('home');

Route::get('/catalog', [PublicCatalogController::class, 'index'])->name('catalog');
Route::get('/quote', [PublicCatalogController::class, 'quote'])->name('quote.show');

/*
|--------------------------------------------------------------------------
| Dashboard (Admin)
|--------------------------------------------------------------------------
*/

Route::get('/dashboard', function () {
    return Inertia::render('Dashboard');
})->middleware(['auth', 'verified'])->name('dashboard');


/*
|--------------------------------------------------------------------------
| Authenticated Admin Routes
|--------------------------------------------------------------------------
*/

Route::middleware(['auth'])->group(function () {

    // User Profile
    Route::get('/profile', [ProfileController::class, 'edit'])
        ->name('profile.edit');

    Route::patch('/profile', [ProfileController::class, 'update'])
        ->name('profile.update');

    Route::delete('/profile', [ProfileController::class, 'destroy'])
        ->name('profile.destroy');

    /*
    |--------------------------------------------------------------------------
    | Items Page (Admin Side)
    |--------------------------------------------------------------------------
    */
    Route::get('/items', function () {
        return Inertia::render('Items/Index');
    })->name('items.index');
});


/*
|--------------------------------------------------------------------------
| Debug: Tenant Test Route
|--------------------------------------------------------------------------
*/

Route::get('/test-tenant', function () {
    if (app()->bound('currentTenant')) {
        return app('currentTenant');
    }
    return ['message' => 'No currentTenant bound'];
});


/*
|--------------------------------------------------------------------------
| Auth Routes (Breeze)
|--------------------------------------------------------------------------
*/

require __DIR__.'/auth.php';
