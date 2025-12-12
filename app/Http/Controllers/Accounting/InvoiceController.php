<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceLine;

class InvoiceController extends Controller
{
    public function store(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');

        $data = $request->validate([
            'customer_id' => 'required|integer',
            'booking_id' => 'nullable|integer',
            'issue_date' => 'required|date',
            'due_date' => 'nullable|date',
            'discount' => 'nullable|numeric|min:0',
            'tax' => 'nullable|numeric|min:0',
            'lines' => 'required|array|min:1',
            'lines.*.description' => 'required|string',
            'lines.*.qty' => 'required|numeric|min:0.01',
            'lines.*.unit_price' => 'required|numeric|min:0',
            'lines.*.category' => 'nullable|string',
        ]);

        $subtotal = collect($data['lines'])->sum(fn ($l) => $l['qty'] * $l['unit_price']);
        $discount = (float) ($data['discount'] ?? 0);
        $tax = (float) ($data['tax'] ?? 0);
        $total = max(0, $subtotal - $discount) + $tax;

        $next = Invoice::where('tenant_id', $user->tenant_id)->count() + 1;

        $invoice = Invoice::create([
            'tenant_id' => $user->tenant_id,
            'customer_id' => $data['customer_id'],
            'booking_id' => $data['booking_id'] ?? null,
            'invoice_no' => 'INV-' . str_pad($next, 6, '0', STR_PAD_LEFT),
            'issue_date' => $data['issue_date'],
            'due_date' => $data['due_date'] ?? null,
            'subtotal' => $subtotal,
            'discount' => $discount,
            'tax' => $tax,
            'total' => $total,
            'status' => 'sent',
        ]);

        foreach ($data['lines'] as $l) {
            InvoiceLine::create([
                'tenant_id' => $user->tenant_id,
                'invoice_id' => $invoice->id,
                'category' => $l['category'] ?? 'rental',
                'description' => $l['description'],
                'qty' => $l['qty'],
                'unit_price' => $l['unit_price'],
                'line_total' => $l['qty'] * $l['unit_price'],
            ]);
        }

        return redirect()
            ->route('accounting.invoices.create')
            ->with('success', 'Invoice created successfully');
    }
}
