<?php

namespace App\Http\Controllers\Accounting;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;
use App\Models\Customer;

class InvoiceUiController extends Controller
{
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
