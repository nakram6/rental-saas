<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\PublicCatalogController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\CustomerController;
use App\Http\Controllers\Reports\CatalogReportController;

use App\Http\Controllers\Accounting\InvoiceUiController;
use App\Http\Controllers\Accounting\InvoiceController;
use App\Http\Controllers\Accounting\InvoicePdfController;
use App\Http\Controllers\Accounting\GeneralLedgerController;
use App\Http\Controllers\Accounting\JournalEntryController;
use App\Http\Controllers\Accounting\TrialBalanceController;

use App\Http\Controllers\Shop\ShopController;
use App\Http\Controllers\ContactController;

use App\Models\JournalEntry;

/*
|--------------------------------------------------------------------------
| Public Routes (Client Side)
|--------------------------------------------------------------------------
*/
Route::get('/', [PublicCatalogController::class, 'home'])->name('home');
Route::get('/catalog', [PublicCatalogController::class, 'index'])->name('catalog');

/**
 * ✅ Quote page (ONLY ONE)
 * Keep your controller method so tenant/branding props stay consistent.
 */
Route::get('/quote', [PublicCatalogController::class, 'quote'])->name('quote.index');

/**
 * Public catalog PDF share link
 */
Route::get('/public/catalog/{token}', [CatalogReportController::class, 'publicCatalog'])
    ->name('public.catalog');

/**
 * ✅ Photography + Portfolio (ONLY ONE EACH)
 */
Route::get('/photography', fn () => Inertia::render('Photography/Index'))->name('photography.index');
Route::get('/portfolio', fn () => Inertia::render('Portfolio/Index'))->name('portfolio.index');

/**
 * ✅ Contact page (GET + POST)
 */
Route::get('/contact', [ContactController::class, 'create'])->name('contact.create');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

/*
|--------------------------------------------------------------------------
| Shop (Public)
|--------------------------------------------------------------------------
*/
Route::prefix('shop')->name('shop.')->group(function () {
    Route::get('/', [ShopController::class, 'index'])->name('index');
    Route::get('/items/{item}', [ShopController::class, 'show'])->name('items.show');
});

/*
|--------------------------------------------------------------------------
| Cart (Public)
|--------------------------------------------------------------------------
| NOTE:
| Your CartPage fetch currently calls POST /api/cart/checkout
| Keep that API route inside routes/api.php.
| Here we only add the GET page route.
*/
Route::get('/cart', fn () => Inertia::render('Shop/Cart'))->name('shop.cart');

/*
|--------------------------------------------------------------------------
| Dashboard (Admin)
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Authenticated Admin Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    // Profile
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    // Admin pages
    Route::get('/items', fn () => Inertia::render('Items/Index'))->name('items.index');
    Route::get('/planner', fn () => Inertia::render('Admin/Planner'))->name('planner');

    // Bookings
    Route::get('/bookings', [BookingController::class, 'index'])->name('bookings.index');
    Route::post('/bookings', [BookingController::class, 'store'])->name('bookings.store');
    Route::put('/bookings/{booking}', [BookingController::class, 'update'])->name('bookings.update');
    Route::delete('/bookings/{booking}', [BookingController::class, 'destroy'])->name('bookings.destroy');

    // Customers
    Route::get('/customers', [CustomerController::class, 'index'])->name('customers.index');
    Route::get('/customers/create', [CustomerController::class, 'create'])->name('customers.create');
    Route::post('/customers', [CustomerController::class, 'store'])->name('customers.store');
    Route::get('/customers/{customer}', [CustomerController::class, 'show'])->name('customers.show');
    Route::put('/customers/{customer}', [CustomerController::class, 'update'])->name('customers.update');
    Route::delete('/customers/{customer}', [CustomerController::class, 'destroy'])->name('customers.destroy');

    Route::get('/customers/{customer}/pdf', [CustomerController::class, 'pdf'])->name('customers.pdf');
    Route::get('/customers/{customer}/pdf/download', [CustomerController::class, 'pdfDownload'])->name('customers.pdf.download');
    Route::post('/customers/{customer}/email', [CustomerController::class, 'emailPdf'])->name('customers.email');

    // Reports pages
    Route::get('/reports', fn () => Inertia::render('Reports/Index'))->name('reports.index');
    Route::get('/reports/sales', fn () => Inertia::render('Reports/Sales'))->name('reports.sales');
    Route::get('/reports/customers', fn () => Inertia::render('Reports/Customers'))->name('reports.customers');
    Route::get('/reports/inventory', fn () => Inertia::render('Reports/Inventory'))->name('reports.inventory');
    Route::get('/reports/bookings', fn () => Inertia::render('Reports/Bookings'))->name('reports.bookings');
    Route::get('/reports/planner', fn () => Inertia::render('Reports/Planner'))->name('reports.planner');
    Route::get('/reports/rentals', fn () => Inertia::render('Reports/Rentals'))->name('reports.rentals');
    Route::get('/reports/overdue', fn () => Inertia::render('Reports/Overdue'))->name('reports.overdue');
    Route::get('/reports/payments', fn () => Inertia::render('Reports/Payments'))->name('reports.payments');
    Route::get('/reports/utilization', fn () => Inertia::render('Reports/Utilization'))->name('reports.utilization');
    Route::get('/reports/damaged', fn () => Inertia::render('Reports/Damaged'))->name('reports.damaged');
    Route::get('/reports/maintenance', fn () => Inertia::render('Reports/Maintenance'))->name('reports.maintenance');
    Route::get('/reports/quotes', fn () => Inertia::render('Reports/Quotes'))->name('reports.quotes');

    // Catalog Report
    Route::get('/reports/catalog', [CatalogReportController::class, 'index'])->name('reports.catalog');
    Route::post('/reports/catalog/email', [CatalogReportController::class, 'sendEmail'])->name('reports.catalog.email');

    /*
    |--------------------------------------------------------------------------
    | Accounting - Invoices
    |--------------------------------------------------------------------------
    */
    Route::get('/accounting/invoices', [InvoiceUiController::class, 'index'])->name('accounting.invoices.index');
    Route::get('/accounting/invoices/create', [InvoiceUiController::class, 'create'])->name('accounting.invoices.create');
    Route::post('/accounting/invoices', [InvoiceController::class, 'store'])->name('accounting.invoices.store');
    Route::patch('/accounting/invoices/{invoice}/status', [InvoiceController::class, 'updateStatus'])->name('accounting.invoices.status');
    Route::get('/accounting/invoices/{invoice}/pdf', [InvoicePdfController::class, 'stream'])->name('accounting.invoices.pdf');
    Route::get('/accounting/invoices/{invoice}/pdf/download', [InvoicePdfController::class, 'download'])->name('accounting.invoices.pdf.download');

    /*
    |--------------------------------------------------------------------------
    | Accounting - General Ledger / Trial Balance / Journal
    |--------------------------------------------------------------------------
    */
    Route::get('/accounting/general-ledger', [GeneralLedgerController::class, 'index'])->name('accounting.general-ledger');
    Route::get('/accounting/general-ledger/export', [GeneralLedgerController::class, 'export'])->name('accounting.general-ledger.export');
    Route::get('/accounting/trial-balance', [TrialBalanceController::class, 'index'])->name('accounting.trial-balance');
    Route::get('/accounting/journal-entries/{journalEntry}', [JournalEntryController::class, 'show'])->name('accounting.journal-entries.show');

    /*
    |--------------------------------------------------------------------------
    | Debug routes (Auth only)
    |--------------------------------------------------------------------------
    */
    Route::get('/_auth-test', function (Request $request) {
        $user = $request->user();
        abort_unless($user, 401);

        $payload = [
            'user_id' => $user->id,
            'tenant_id' => $user->tenant_id,
            'can_viewAny_journalEntry' => $user->can('viewAny', JournalEntry::class),
        ];

        if ($request->header('X-Inertia')) {
            return Inertia::render('Debug/AuthTest', $payload);
        }

        return response()->json($payload);
    })->name('debug.auth-test');
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
