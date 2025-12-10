<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;

class ItemController extends Controller
{
    /**
     * List all items for the current tenant.
     */
    public function index(Request $request)
    {
        $tenant = app('currentTenant');

        if (! $tenant) {
            return response()->json(['message' => 'No tenant resolved'], 500);
        }

        $items = Item::where('tenant_id', $tenant->id)
            ->orderBy('name')
            ->get();

        return response()->json($items);
    }

    /**
     * Create a new item for the current tenant.
     */
    public function store(Request $request)
    {
        $tenant = app('currentTenant');

        if (! $tenant) {
            return response()->json(['message' => 'No tenant resolved'], 500);
        }

        $data = $request->validate([
            'name'             => 'required|string|max:255',
            'sku'              => 'nullable|string|max:100',
            'description'      => 'nullable|string',
            'rental_type'      => 'nullable|in:bulk,trackable',
            'qty_total'        => 'nullable|integer|min:0',
            'price_per_day'    => 'nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'meta'             => 'nullable|array',
        ]);

        $data['tenant_id'] = $tenant->id;

        $item = Item::create($data);

        return response()->json($item, 201);
    }

    /**
     * Show a single item (must belong to current tenant).
     */
    public function show(Item $item)
    {
        $tenant = app('currentTenant');

        if (! $tenant || $item->tenant_id !== $tenant->id) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        return response()->json($item);
    }

    /**
     * Update an item.
     */
    public function update(Request $request, Item $item)
    {
        $tenant = app('currentTenant');

        if (! $tenant || $item->tenant_id !== $tenant->id) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $data = $request->validate([
            'name'             => 'sometimes|required|string|max:255',
            'sku'              => 'nullable|string|max:100',
            'description'      => 'nullable|string',
            'rental_type'      => 'nullable|in:bulk,trackable',
            'qty_total'        => 'nullable|integer|min:0',
            'price_per_day'    => 'nullable|numeric|min:0',
            'security_deposit' => 'nullable|numeric|min:0',
            'meta'             => 'nullable|array',
        ]);

        $item->update($data);

        return response()->json($item);
    }

    /**
     * Delete an item.
     */
    public function destroy(Item $item)
    {
        $tenant = app('currentTenant');

        if (! $tenant || $item->tenant_id !== $tenant->id) {
            return response()->json(['message' => 'Item not found'], 404);
        }

        $item->delete();

        return response()->json(['message' => 'Item deleted']);
    }
}
