<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\DecorLibraryItem;   // 👈 VERY IMPORTANT
use Illuminate\Http\Request;

class DecorLibraryItemController extends Controller
{
    /**
     * TEMP tenant logic.
     * For now we just always use tenant_id = 1 so it works
     * even when there is no authenticated user.
     */
    protected function tenantId(Request $request): int
    {
        // If later you want to use the real tenant from middleware,
        // you can change this method only.
        return 1;
    }

    public function index(Request $request)
    {
        $tenantId = $this->tenantId($request);

        return DecorLibraryItem::where('tenant_id', $tenantId)
            ->orderBy('name')
            ->get();
    }

    public function store(Request $request)
    {
        $tenantId = $this->tenantId($request);

        $data = $request->validate([
            'name'      => 'required|string|max:255',
            'type'      => 'required|string|max:255',
            'tag'       => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:1024',
            'meta'      => 'nullable|array',
        ]);

        $item = DecorLibraryItem::create([
            'tenant_id' => $tenantId,
            'name'      => $data['name'],
            'type'      => $data['type'],
            'tag'       => $data['tag'] ?? null,
            'image_url' => $data['image_url'] ?? null,
            'meta'      => $data['meta'] ?? null,
        ]);

        return response()->json($item, 201);
    }

    public function update(Request $request, DecorLibraryItem $decorLibraryItem)
    {
        $tenantId = $this->tenantId($request);

        // basic safety: don’t let a different tenant edit this record
        if ($decorLibraryItem->tenant_id !== $tenantId) {
            abort(403, 'Not allowed');
        }

        $data = $request->validate([
            'name'      => 'sometimes|required|string|max:255',
            'type'      => 'sometimes|required|string|max:255',
            'tag'       => 'nullable|string|max:255',
            'image_url' => 'nullable|string|max:1024',
            'meta'      => 'nullable|array',
        ]);

        $decorLibraryItem->update($data);

        return response()->json($decorLibraryItem);
    }

    public function destroy(Request $request, DecorLibraryItem $decorLibraryItem)
    {
        $tenantId = $this->tenantId($request);

        if ($decorLibraryItem->tenant_id !== $tenantId) {
            abort(403, 'Not allowed');
        }

        $decorLibraryItem->delete();

        return response()->json(['message' => 'Deleted']);
    }
}
