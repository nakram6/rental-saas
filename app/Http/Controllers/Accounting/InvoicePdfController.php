<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use App\Models\Invoice;
use Illuminate\Http\Request;
use Barryvdh\DomPDF\Facade\Pdf;

class InvoicePdfController extends Controller
{
    private function makePdf(Request $request, Invoice $invoice)
    {
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');
        abort_unless($invoice->tenant_id === $user->tenant_id, 403, 'Forbidden');

        $invoice->load('lines');

        return Pdf::loadView('pdf.invoice', [
            'invoice' => $invoice,
        ])->setPaper('a4');
    }

    public function stream(Request $request, Invoice $invoice)
    {
        $pdf = $this->makePdf($request, $invoice);
        $name = ($invoice->invoice_no ?: 'invoice') . '.pdf';
        return $pdf->stream($name);
    }

    public function download(Request $request, Invoice $invoice)
    {
        $pdf = $this->makePdf($request, $invoice);
        $name = ($invoice->invoice_no ?: 'invoice') . '.pdf';
        return $pdf->download($name);
    }
}
