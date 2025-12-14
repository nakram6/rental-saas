<?php

namespace App\Http\Controllers;

use App\Models\Item;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class ItemController extends Controller
{
    private function tenantId(Request $request): int
    {
        return (int) (optional($request->user())->tenant_id ?? 1);
    }

    public function index(Request $request)
    {
        $tenantId = $this->tenantId($request);

        return Item::where('tenant_id', $tenantId)
            ->orderBy('name')
            ->get();
    }

    public function show(Request $request, Item $item)
    {
        $tenantId = $this->tenantId($request);

        if ((int)$item->tenant_id !== $tenantId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        return $item;
    }

    public function store(Request $request)
    {
        $tenantId = $this->tenantId($request);

        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'sku'              => ['nullable', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'rental_type'      => ['required', 'in:bulk,trackable'],
            'qty_total'        => ['required', 'integer', 'min:0'],
            'price_per_day'    => ['required', 'numeric', 'min:0'],
            'security_deposit' => ['required', 'numeric', 'min:0'],
            'image_url'        => ['nullable', 'string', 'max:255'],
        ]);

        $meta = [];
        if (!empty($data['image_url'])) {
            $meta['image_url'] = $data['image_url'];
        }

        $item = Item::create([
            'tenant_id'        => $tenantId, // ✅ always set
            'name'             => $data['name'],
            'sku'              => $data['sku'] ?? null,
            'description'      => $data['description'] ?? null,
            'rental_type'      => $data['rental_type'],
            'qty_total'        => $data['qty_total'],
            'price_per_day'    => $data['price_per_day'],
            'security_deposit' => $data['security_deposit'],
            'is_active'        => true,
            'meta'             => $meta,
        ]);

        return response()->json($item->fresh(), 201);
    }

    public function update(Request $request, Item $item)
    {
        $tenantId = $this->tenantId($request);

        if ((int)$item->tenant_id !== $tenantId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $data = $request->validate([
            'name'             => ['required', 'string', 'max:255'],
            'sku'              => ['nullable', 'string', 'max:255'],
            'description'      => ['nullable', 'string'],
            'rental_type'      => ['required', 'in:bulk,trackable'],
            'qty_total'        => ['required', 'integer', 'min:0'],
            'price_per_day'    => ['required', 'numeric', 'min:0'],
            'security_deposit' => ['required', 'numeric', 'min:0'],
            'image_url'        => ['nullable', 'string', 'max:255'],
        ]);

        $item->name             = $data['name'];
        $item->sku              = $data['sku'] ?? null;
        $item->description      = $data['description'] ?? null;
        $item->rental_type      = $data['rental_type'];
        $item->qty_total        = $data['qty_total'];
        $item->price_per_day    = $data['price_per_day'];
        $item->security_deposit = $data['security_deposit'];

        $meta = $item->meta ?? [];

        if ($request->has('image_url')) {
            $imageUrl = $request->input('image_url');
            if ($imageUrl) $meta['image_url'] = $imageUrl;
            else unset($meta['image_url']);
        }

        $item->meta = $meta;
        $item->save();

        return response()->json($item->fresh());
    }

    public function destroy(Request $request, Item $item)
    {
        $tenantId = $this->tenantId($request);

        if ((int)$item->tenant_id !== $tenantId) {
            return response()->json(['message' => 'Forbidden'], 403);
        }

        $item->delete();

        return response()->json(['message' => 'Deleted']);
    }

    public function uploadImage(Request $request)
    {
        $tenantId = $this->tenantId($request);

        $request->validate([
            'image' => ['required', 'image', 'max:10240'],
        ]);

        $path = $request->file('image')->store("items/{$tenantId}", 'public');
        $url  = Storage::url($path);

        return response()->json(['url' => $url]);
    }
}
