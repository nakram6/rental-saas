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
        $tenant = app('currentTenant');

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
        $tenant = app('currentTenant');

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
        $tenant = app('currentTenant');

        return Inertia::render('Public/Quote', [
            'tenant' => $tenant,
        ]);
    }








}
