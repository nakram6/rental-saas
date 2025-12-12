<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PublicCatalogController extends Controller
{
    // HOME PAGE
    public function home()
    {
        $tenant = $this->tenantOrFail();

        // Featured items (limit 8)
        $items = Item::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->take(8)
            ->get();

        return Inertia::render('Home', [
            'tenant' => $tenant,
            'items'  => $items,
        ]);
    }

    // CATALOG PAGE
    public function index()
    {
        $tenant = $this->tenantOrFail();

        $items = Item::where('tenant_id', $tenant->id)
            ->where('is_active', true)
            ->orderBy('name')
            ->get();

        return Inertia::render('Public/Catalog', [
            'tenant' => $tenant,
            'items'  => $items,
        ]);
    }


  // NEW: quote page (front-end only for now)
    public function quote()
    {
        $tenant = $this->tenantOrFail();

        return Inertia::render('Public/Quote', [
            'tenant' => $tenant,
        ]);
    }



    
private function tenantOrFail()
{
    if (!app()->bound('currentTenant')) {
        abort(404, 'Tenant not resolved (currentTenant not bound).');
    }

    $tenant = app('currentTenant');

    if (!$tenant) {
        abort(404, 'Tenant not found.');
    }

    return $tenant;
}







}
