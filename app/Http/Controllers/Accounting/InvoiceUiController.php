<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer;
use App\Models\Invoice;

class InvoiceUiController extends Controller
{
   public function index(Request $request)
{
    $user = $request->user();
    abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');

    $invoices = Invoice::where('tenant_id', $user->tenant_id)
        ->orderByDesc('id')
        ->paginate(15)
        ->through(fn ($inv) => [
            'id' => $inv->id,
            'invoice_no' => $inv->invoice_no,
            'issue_date' => optional($inv->issue_date)->format('Y-m-d'),
            'due_date' => optional($inv->due_date)->format('Y-m-d'),
            'status' => $inv->status,
            'total' => (float) $inv->total,
        ]);

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
