<?php

use Illuminate\Support\Facades\Route;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

use App\Http\Controllers\ProfileController;
use App\Http\Controllers\Shop\ShopController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\Public\PortfolioController;

use App\Models\JournalEntry;

/*
|--------------------------------------------------------------------------
| Public Routes
|--------------------------------------------------------------------------


*/

Route::get('/_portfolio-test', function () {
    return 'portfolio route file loaded';
});
Route::get('/photography', fn () => Inertia::render('Photography/Index'))->name('photography.index');

Route::get('/', [PublicCatalogController::class, 'home'])->name('home');
Route::get('/catalog', [PublicCatalogController::class, 'index'])->name('catalog');
Route::get('/quote', [PublicCatalogController::class, 'quote'])->name('quote.index');

Route::get('/portfolio', [PortfolioController::class, 'index'])
    ->name('portfolio.index');

Route::get('/contact', [ContactController::class, 'create'])->name('contact.create');
Route::post('/contact', [ContactController::class, 'store'])->name('contact.store');

/*
|--------------------------------------------------------------------------
| Shop
|--------------------------------------------------------------------------
*/
Route::prefix('shop')->name('shop.')->group(function () {
    Route::get('/', [ShopController::class, 'index'])->name('index');
    Route::get('/items/{item}', [ShopController::class, 'show'])->name('items.show');
});

Route::get('/cart', fn () => Inertia::render('Shop/Cart'))
    ->name('shop.cart');

    Route::get('/photography', fn () => Inertia::render('photography'));
    

/*
|--------------------------------------------------------------------------
| Dashboard
|--------------------------------------------------------------------------
*/
Route::get('/dashboard', fn () => Inertia::render('Dashboard'))
    ->middleware(['auth', 'verified'])
    ->name('dashboard');

/*
|--------------------------------------------------------------------------
| Authenticated Routes
|--------------------------------------------------------------------------
*/
Route::middleware(['auth'])->group(function () {

    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/items', fn () => Inertia::render('Items/Index'))->name('items.index');
    Route::get('/planner', fn () => Inertia::render('Admin/Planner'))->name('planner');

    Route::resource('bookings', BookingController::class)->except(['create', 'edit']);
    Route::resource('customers', CustomerController::class);

    Route::get('/customers/{customer}/pdf', [CustomerController::class, 'pdf'])->name('customers.pdf');
    Route::get('/customers/{customer}/pdf/download', [CustomerController::class, 'pdfDownload'])->name('customers.pdf.download');
    Route::post('/customers/{customer}/email', [CustomerController::class, 'emailPdf'])->name('customers.email');

    Route::get('/reports/catalog', [CatalogReportController::class, 'index'])->name('reports.catalog');
    Route::post('/reports/catalog/email', [CatalogReportController::class, 'sendEmail'])->name('reports.catalog.email');

    Route::get('/accounting/invoices', [InvoiceUiController::class, 'index'])->name('accounting.invoices.index');
    Route::post('/accounting/invoices', [InvoiceController::class, 'store'])->name('accounting.invoices.store');

    Route::get('/accounting/general-ledger', [GeneralLedgerController::class, 'index'])->name('accounting.general-ledger');
    Route::get('/accounting/trial-balance', [TrialBalanceController::class, 'index'])->name('accounting.trial-balance');

    Route::get('/_auth-test', function (Request $request) {
        abort_unless($request->user(), 401);

        return [
            'user_id' => $request->user()->id,
            'tenant_id' => $request->user()->tenant_id,
            'can_viewAny_journalEntry' => $request->user()->can('viewAny', JournalEntry::class),
        ];
    })->name('debug.auth-test');
});

/*
|--------------------------------------------------------------------------
| Tenant Debug
|--------------------------------------------------------------------------
*/
Route::get('/test-tenant', fn () =>
    app()->bound('currentTenant')
        ? app('currentTenant')
        : ['message' => 'No currentTenant bound']
);

/*
|--------------------------------------------------------------------------
| Auth Routes
|--------------------------------------------------------------------------
*/
require __DIR__.'/auth.php';
