<?php

namespace App\Http\Controllers;

use App\Models\Quote;
use App\Services\QuoteService;
use Illuminate\Http\Request;

class QuoteController extends Controller
{
    /**
     * Create/refresh the PDF for a quote and stream it in browser.
     * (For now open access; later protect with signed URL or auth.)
     */
    public function pdf(Request $request, Quote $quote, QuoteService $quotes)
    {
        $tenantName = optional($quote->tenant)->name ?? config('app.name');

        // Generate PDF if missing
        if (!$quote->pdf_path) {
            $quote = $quotes->generatePdf($quote, $tenantName);
        }

        return response()->file(storage_path('app/public/' . $quote->pdf_path));
    }
}
