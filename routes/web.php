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

// Public (shareable) catalog link
Route::get('/public/catalog/{token}', [CatalogReportController::class, 'publicCatalog'])
    ->name('public.catalog');

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



// Reports Home
Route::get('/reports', fn() => Inertia::render('Reports/Index'))->name('reports.index');

// Core reports
Route::get('/reports/sales', fn() => Inertia::render('Reports/Sales'))->name('reports.sales');
Route::get('/reports/customers', fn() => Inertia::render('Reports/Customers'))->name('reports.customers');
Route::get('/reports/inventory', fn() => Inertia::render('Reports/Inventory'))->name('reports.inventory');
Route::get('/reports/bookings', fn() => Inertia::render('Reports/Bookings'))->name('reports.bookings');
Route::get('/reports/planner', fn() => Inertia::render('Reports/Planner'))->name('reports.planner');

// ✅ More reports
Route::get('/reports/rentals', fn() => Inertia::render('Reports/Rentals'))->name('reports.rentals');
Route::get('/reports/overdue', fn() => Inertia::render('Reports/Overdue'))->name('reports.overdue');
Route::get('/reports/payments', fn() => Inertia::render('Reports/Payments'))->name('reports.payments');
Route::get('/reports/utilization', fn() => Inertia::render('Reports/Utilization'))->name('reports.utilization');
Route::get('/reports/damaged', fn() => Inertia::render('Reports/Damaged'))->name('reports.damaged');
Route::get('/reports/maintenance', fn() => Inertia::render('Reports/Maintenance'))->name('reports.maintenance');
Route::get('/reports/quotes', fn() => Inertia::render('Reports/Quotes'))->name('reports.quotes');

Route::middleware(['auth'])->group(function () {
    Route::get('/reports/catalog', [\App\Http\Controllers\Reports\CatalogReportController::class, 'index'])
        ->name('reports.catalog');

    Route::post('/reports/catalog/email', [\App\Http\Controllers\Reports\CatalogReportController::class, 'sendEmail'])
        ->name('reports.catalog.email');
});

Route::get('/reports/catalog', [CatalogReportController::class, 'index'])->name('reports.catalog');
    Route::post('/reports/catalog/email', [CatalogReportController::class, 'sendEmail'])->name('reports.catalog.email');


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

