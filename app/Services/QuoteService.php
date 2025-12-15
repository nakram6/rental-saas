<?php

namespace App\Services;

use App\Models\Quote;
use App\Models\QuoteItem;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class QuoteService
{
    public function __construct(
        protected QuoteNumberService $numbers
    ) {}

    public function createDraft(int $tenantId, array $data, ?int $userId = null): Quote
    {
        $quote = Quote::create([
            'tenant_id'     => $tenantId,
            'user_id'       => $userId,
            'quote_no'      => $this->numbers->next(),

            'event_date'    => $data['event_date'] ?? null,
            'city'          => $data['city'] ?? null,
            'venue'         => $data['venue'] ?? null,
            'event_type'    => $data['event_type'] ?? null,
            'guest_count'   => $data['guest_count'] ?? null,
            'theme_colors'  => $data['theme_colors'] ?? null,
            'budget'        => $data['budget'] ?? null,
            'notes'         => $data['notes'] ?? null,

            'status'        => 'draft',
            'subtotal'      => 0,
            'tax'           => 0,
            'total'         => 0,
        ]);

        // Create line items (optional)
        $items = $data['items'] ?? [];
        foreach ($items as $it) {
            $qty  = max(1, (int)($it['qty'] ?? 1));
            $unit = (float)($it['unit_price'] ?? 0);

            QuoteItem::create([
                'quote_id'    => $quote->id,
                'name'        => (string)($it['name'] ?? 'Decor Package'),
                'category'    => $it['category'] ?? null,
                'qty'         => $qty,
                'unit_price'  => $unit,
                'line_total'  => round($qty * $unit, 2),
                'notes'       => $it['notes'] ?? null,
            ]);
        }

        $quote->load('items');

        // Totals
        $subtotal = round((float) $quote->items->sum('line_total'), 2);
        $tax      = 0.00; // add HST later if needed
        $total    = round($subtotal + $tax, 2);

        $quote->update([
            'subtotal' => $subtotal,
            'tax'      => $tax,
            'total'    => $total,
        ]);

        return $quote->fresh(['items']);
    }

    public function generatePdf(Quote $quote, string $tenantName): Quote
    {
        $quote->loadMissing('items');

        $pdf = Pdf::loadView('pdf.quote', [
            'quote'      => $quote,
            'tenantName' => $tenantName,
        ]);

        // Make filename safe
        $safeNo = Str::of($quote->quote_no)->replace(['/', '\\', ' '], '-')->toString();
        $path   = "quotes/{$safeNo}.pdf";

        Storage::disk('public')->put($path, $pdf->output());

        $quote->update([
            'pdf_path' => $path,
        ]);

        return $quote->fresh(['items']);
    }
}
