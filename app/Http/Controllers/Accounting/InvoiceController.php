<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Invoice;
use App\Models\InvoiceLine;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Carbon;
use App\Models\Account;
use App\Models\JournalEntry;
use App\Models\JournalLine;
class InvoiceController extends Controller
{

public function index(Request $request)
{
    $user = $request->user();
    abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');

    $invoices = \App\Models\Invoice::query()
        ->where('tenant_id', $user->tenant_id)
        ->with(['customer:id,name']) // ✅ this is required
        ->orderByDesc('id')
        ->paginate(10)
        ->through(fn ($inv) => [
            'id' => $inv->id,
            'invoice_no' => $inv->invoice_no,
            'issue_date' => $inv->issue_date,
            'due_date' => $inv->due_date,
            'status' => $inv->status,
            'total' => $inv->total,
            'customer_name' => optional($inv->customer)->name, // ✅ show name
        ]);

    return \Inertia\Inertia::render('Accounting/Invoices/Index', [
        'invoices' => $invoices,
    ]);
}




public function updateStatus(Request $request, \App\Models\Invoice $invoice)
{
    $user = $request->user();
    abort_unless($user && $user->tenant_id, 403);

    // ✅ Tenant safety
    abort_unless($invoice->tenant_id === $user->tenant_id, 403);

    // 🔒 Hard lock (return flash instead of abort → Toast friendly)
    if ($invoice->isLocked()) {
        return back()->with('error', 'Paid invoices are locked and cannot be modified.');
    }

    $data = $request->validate([
        'status' => 'required|in:draft,sent,paid,void',
    ]);

    $newStatus = $data['status'];
    $oldStatus = $invoice->status;

    DB::transaction(function () use ($invoice, $user, $newStatus, $oldStatus) {

        // ✅ Only create journal when moving → PAID
        if ($newStatus === 'paid' && $oldStatus !== 'paid') {

            // Ensure accounts exist (per tenant)
            $cash = \App\Models\Account::firstOrCreate(
                ['tenant_id' => $user->tenant_id, 'name' => 'Cash'],
                ['type' => 'asset']
            );

            $ar = \App\Models\Account::firstOrCreate(
                ['tenant_id' => $user->tenant_id, 'name' => 'Accounts Receivable'],
                ['type' => 'asset']
            );

            // Prevent duplicate journal entry for same invoice
            $exists = \App\Models\JournalEntry::where('tenant_id', $user->tenant_id)
                ->where('reference_type', 'invoice')
                ->where('reference_id', $invoice->id)
                ->exists();

            if (!$exists) {
                $entry = \App\Models\JournalEntry::create([
                    'tenant_id' => $user->tenant_id,
                    'entry_date' => \Carbon\Carbon::now()->toDateString(),
                    'reference_type' => 'invoice',
                    'reference_id' => $invoice->id,
                    'memo' => 'Invoice paid: ' . $invoice->invoice_no,
                    'posted_by' => $user->id,
                ]);

                // Debit Cash
                \App\Models\JournalLine::create([
                    'tenant_id' => $user->tenant_id,
                    'journal_entry_id' => $entry->id,
                    'account_id' => $cash->id,
                    'debit' => $invoice->total,
                    'credit' => 0,
                    'memo' => 'Cash received',
                    'description' => 'Invoice ' . $invoice->invoice_no,
                    'customer_id' => $invoice->customer_id,
                    'booking_id' => $invoice->booking_id,
                ]);

                // Credit Accounts Receivable
                \App\Models\JournalLine::create([
                    'tenant_id' => $user->tenant_id,
                    'journal_entry_id' => $entry->id,
                    'account_id' => $ar->id,
                    'debit' => 0,
                    'credit' => $invoice->total,
                    'memo' => 'Invoice settled',
                    'description' => 'Invoice ' . $invoice->invoice_no,
                    'customer_id' => $invoice->customer_id,
                    'booking_id' => $invoice->booking_id,
                ]);
            }
        }

        // ✅ Update invoice status
        $invoice->update(['status' => $newStatus]);
    });

    // ✅ Better flash message (Toast will show this)
    $msg = match ($newStatus) {
        'paid' => "Invoice {$invoice->invoice_no} marked as PAID and locked.",
        'sent' => "Invoice {$invoice->invoice_no} marked as SENT.",
        'void' => "Invoice {$invoice->invoice_no} marked as VOID.",
        default => "Invoice {$invoice->invoice_no} set to DRAFT.",
    };

    return back()->with('success', $msg);
}





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
            'notes' => 'nullable|string',
        ]);

        $subtotal = collect($data['lines'])->sum(fn ($l) => $l['qty'] * $l['unit_price']);
        $discount = (float) ($data['discount'] ?? 0);
        $tax = (float) ($data['tax'] ?? 0);
        $total = max(0, $subtotal - $discount) + $tax;

        $lastId = (int) Invoice::where('tenant_id', $user->tenant_id)->max('id');
        $next = $lastId + 1;

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
            'notes' => $data['notes'] ?? null,
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
    ->route('accounting.invoices.index')
    ->with('success', 'Invoice created successfully');
    }
}
