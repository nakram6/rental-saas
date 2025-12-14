<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer;
use App\Models\Invoice;
use Illuminate\Support\Carbon;

class InvoiceUiController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');

        $invoices = Invoice::query()
            ->where('tenant_id', $user->tenant_id)
            ->with(['customer:id,name']) // ✅ customer name
            ->orderByDesc('id')
            ->paginate(10)
            ->through(function ($inv) {
                return [
                    'id' => $inv->id,
                    'invoice_no' => $inv->invoice_no,

                    // ✅ force strings so React always displays
                    'issue_date' => $inv->issue_date ? Carbon::parse($inv->issue_date)->format('Y-m-d') : null,
                    'due_date'   => $inv->due_date ? Carbon::parse($inv->due_date)->format('Y-m-d') : null,

                    // ✅ required by your table + badges
                    'status' => $inv->status,
                    'total'  => (float) $inv->total,

                    // ✅ customer name
                    'customer_name' => optional($inv->customer)->name,
                ];
            });

        return Inertia::render('Accounting/Invoices/Index', [
            'invoices' => $invoices,
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');

        $customers = Customer::where('tenant_id', $user->tenant_id)
            ->orderBy('name')
            ->get(['id','name','email']);

        return Inertia::render('Accounting/Invoices/Create', [
            'customers' => $customers,
        ]);
    }
}
