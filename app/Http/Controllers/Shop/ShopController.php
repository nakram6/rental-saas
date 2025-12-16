<?php

namespace App\Http\Controllers\Shop;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Models\Tenant;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ShopController extends Controller
{
    private function resolveTenantId(Request $request): ?int
    {
        // 1) If middleware sets tenant_id directly
        $tenantId = $request->attributes->get('tenant_id');
        if ($tenantId) return (int) $tenantId;

        // 2) If middleware sets tenant object
        $tenant = $request->attributes->get('tenant');
        if ($tenant && isset($tenant->id)) return (int) $tenant->id;

        // 3) If tenant is bound in container
        try {
            $tenant = app()->bound('tenant') ? app('tenant') : null;
            if ($tenant && isset($tenant->id)) return (int) $tenant->id;
        } catch (\Throwable $e) {
            // ignore
        }

        // 4) If logged-in user exists
        if ($request->user() && $request->user()->tenant_id) {
            return (int) $request->user()->tenant_id;
        }

        // 5) DEV fallback (optional): use first tenant
        // ⚠️ Remove this in production if tenant MUST be resolved by domain.
        $first = Tenant::query()->orderBy('id')->first();
        return $first?->id ? (int) $first->id : null;
    }

    public function index(Request $request)
    {
        $tenantId = $this->resolveTenantId($request);
        abort_unless($tenantId, 404);

        $q = trim((string) $request->query('q', ''));

        $items = Item::query()
            ->where('tenant_id', $tenantId)
            ->where('is_active', true)
            ->when($q !== '', function ($qr) use ($q) {
                $qr->where(function ($w) use ($q) {
                    $w->where('name', 'like', "%{$q}%")
                      ->orWhere('sku', 'like', "%{$q}%");
                });
            })
            ->orderBy('name')
            ->paginate(24)
            ->withQueryString();

        return Inertia::render('Shop/Index', [
            'items' => $items,
            'filters' => ['q' => $q],
        ]);
    }

    public function show(Request $request, Item $item)
    {
        $tenantId = $this->resolveTenantId($request);
        abort_unless($tenantId, 404);

        if ((int) $item->tenant_id !== (int) $tenantId) abort(404);
        if (!$item->is_active) abort(404);

        return Inertia::render('Shop/Show', [
            'item' => $item->only([
                'id','name','sku','description','rental_type','qty_total',
                'price_per_day','security_deposit','meta'
            ]),
        ]);
    }
}
