<?php

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
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

Route::get('/planner', function () {
        return Inertia::render('Admin/Planner');
    })->name('planner');

Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::put('/bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

 Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
 
    
Route::put('/customers/{customer}', [CustomerController::class, 'update'])
    ->name('customers.update');

Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])
    ->name('customers.destroy');







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

