<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Item;
use App\Services\QuoteService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CartCheckoutController extends Controller
{
    public function store(Request $request, QuoteService $quoteService)
    {
        // ✅ Adjust this to match your tenant middleware
        $tenantId = $request->attributes->get('tenant_id');
        if (!$tenantId && $request->user()) {
            $tenantId = $request->user()->tenant_id;
        }
        abort_unless($tenantId, 404);

        $v = Validator::make($request->all(), [
            'event' => ['array'],
            'event.event_date' => ['nullable', 'date'],
            'event.city' => ['nullable', 'string', 'max:100'],
            'event.venue' => ['nullable', 'string', 'max:150'],
            'event.event_type' => ['nullable', 'string', 'max:100'],
            'event.guest_count' => ['nullable', 'integer', 'min:0'],
            'event.theme_colors' => ['nullable', 'string', 'max:200'],
            'event.budget' => ['nullable', 'numeric', 'min:0'],
            'event.notes' => ['nullable', 'string', 'max:5000'],

            'items' => ['required', 'array', 'min:1'],
            'items.*.id' => ['required', 'integer'],
            'items.*.qty' => ['required', 'integer', 'min:1'],
            'items.*.start_date' => ['required', 'date'],
            'items.*.end_date' => ['required', 'date'],
            'items.*.days' => ['required', 'integer', 'min:1'],
        ]);

        if ($v->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $v->errors(),
            ], 422);
        }

        $cartItems = $request->input('items', []);
        $ids = collect($cartItems)->pluck('id')->unique()->values()->all();

        $dbItems = Item::query()
            ->where('tenant_id', $tenantId)
            ->whereIn('id', $ids)
            ->where('is_active', true)
            ->get()
            ->keyBy('id');

        // ensure every cart item exists + belongs to tenant
        foreach ($cartItems as $ci) {
            if (!$dbItems->has((int)$ci['id'])) {
                return response()->json([
                    'message' => 'One or more items are not available.',
                ], 422);
            }
        }

        // If user didn't provide event_date, use first cart start_date
        $event = (array) $request->input('event', []);
        if (empty($event['event_date']) && !empty($cartItems[0]['start_date'])) {
            $event['event_date'] = $cartItems[0]['start_date'];
        }

        // Build quote_items from cart
        $quoteItems = [];
        foreach ($cartItems as $ci) {
            $it = $dbItems[(int)$ci['id']];

            $qty  = (int) $ci['qty'];
            $days = (int) $ci['days'];

            $unit = (float) ($it->price_per_day ?? 0);
            $lineTotal = $unit * $qty * $days;

            $noteParts = [
                'Rental: ' . ($ci['start_date'] ?? '') . ' → ' . ($ci['end_date'] ?? ''),
                'Days: ' . $days,
            ];

            $quoteItems[] = [
                'name' => $it->name,
                'category' => $it->rental_type ?? 'rental',
                'qty' => $qty,
                'unit_price' => $unit,
                'line_total' => $lineTotal,
                'notes' => implode(' | ', $noteParts),
            ];
        }

        // Put cart snapshot inside notes (helpful for admin)
        $eventNotes = trim((string)($event['notes'] ?? ''));
        $event['notes'] = trim($eventNotes . "\n\nCart Snapshot:\n" . json_encode($cartItems, JSON_PRETTY_PRINT));

        // Create Draft Quote using your existing service
        // We assume QuoteService::createDraft($tenantId, $data, $userId?) supports quote_items.
        $data = [
            'event_date' => $event['event_date'] ?? null,
            'city' => $event['city'] ?? null,
            'venue' => $event['venue'] ?? null,
            'event_type' => $event['event_type'] ?? null,
            'guest_count' => $event['guest_count'] ?? null,
            'theme_colors' => $event['theme_colors'] ?? null,
            'budget' => $event['budget'] ?? null,
            'notes' => $event['notes'] ?? null,
            'quote_items' => $quoteItems,
        ];

        $userId = $request->user()?->id;

        $quote = $quoteService->createDraft($tenantId, $data, $userId);

        // If your QuoteService returns pdf_path like "quotes/....pdf"
        $pdfUrl = $quote->pdf_path
            ? asset('storage/' . ltrim($quote->pdf_path, '/'))
            : null;

        return response()->json([
            'quote_id' => $quote->id,
            'quote_no' => $quote->quote_no,
            'pdf_url' => $pdfUrl,
        ]);
    }
}
