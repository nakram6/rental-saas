<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

// ✅ NEW imports
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;

class CustomerController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->tenant_id) {
            return response()->json(['message' => 'tenant_id is missing for this user'], 403);
        }

        $q = $request->string('q')->toString();
        $status = $request->string('status')->toString(); // All|Active|VIP|New

        $query = Customer::query()
            ->where('tenant_id', $user->tenant_id);

        if ($q) {
            $query->where(function ($sub) use ($q) {
                $sub->where('name', 'like', "%{$q}%")
                    ->orWhere('email', 'like', "%{$q}%")
                    ->orWhere('phone', 'like', "%{$q}%")
                    ->orWhere('city', 'like', "%{$q}%");
            });
        }

        if ($status && $status !== 'All') {
            $query->where('status', $status);
        }

        $customers = $query
            ->orderBy('name')
            ->get([
                'id',
                'name',
                'email',
                'phone',
                'city',
                'status',
                'total_bookings',
                'total_spent',
                'created_at',
            ]);

        return Inertia::render('Customers/Index', [
            'customers' => $customers,
            'filters' => [
                'q' => $q,
                'status' => $status ?: 'All',
            ],
        ]);
    }

    public function create(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->tenant_id) {
            abort(403, 'tenant_id is missing for this user');
        }

        return Inertia::render('Customers/Create');
    }

    public function store(Request $request)
    {
        $user = $request->user();

        if (!$user || !$user->tenant_id) {
            abort(403, 'tenant_id is missing for this user');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:Active,VIP,New',
        ]);

        $data['tenant_id'] = $user->tenant_id;

        Customer::create($data);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer created successfully.');
    }

    public function show(Request $request, Customer $customer)
    {
        $user = $request->user();

        if (!$user || !$user->tenant_id) {
            abort(403, 'tenant_id is missing for this user');
        }

        if ($customer->tenant_id !== $user->tenant_id) {
            abort(403, 'Forbidden');
        }

        return Inertia::render('Customers/Show', [
            'customer' => $customer,
        ]);
    }

    public function update(Request $request, Customer $customer)
    {
        $user = $request->user();

        if (!$user || !$user->tenant_id) {
            abort(403, 'tenant_id is missing for this user');
        }

        if ($customer->tenant_id !== $user->tenant_id) {
            abort(403, 'Forbidden');
        }

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:50',
            'city' => 'nullable|string|max:100',
            'address' => 'nullable|string|max:255',
            'notes' => 'nullable|string',
            'status' => 'required|string|in:Active,VIP,New',
        ]);

        $customer->update($data);

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer updated successfully.');
    }

    public function destroy(Request $request, Customer $customer)
    {
        $user = $request->user();

        if (!$user || !$user->tenant_id) {
            abort(403, 'tenant_id is missing for this user');
        }

        if ($customer->tenant_id !== $user->tenant_id) {
            abort(403, 'Forbidden');
        }

        $customer->delete();

        return redirect()
            ->route('customers.index')
            ->with('success', 'Customer deleted successfully.');
    }

    /*
    |--------------------------------------------------------------------------
    | ✅ NEW: PDF + Email actions
    |--------------------------------------------------------------------------
    */

    public function pdf(Request $request, Customer $customer)
    {
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');
        abort_unless($customer->tenant_id === $user->tenant_id, 403, 'Forbidden');

        $pdf = Pdf::loadView('pdf.customer', [
            'customer' => $customer,
            // put your real branding here later
            'company' => [
                'name' => 'Harbour Decor Rentals',
                'phone' => '000-000-0000',
                'address' => 'Your Address Here',
                'email' => 'dev@harbourdecor.test',
            ],
        ]);

        return $pdf->stream("customer-{$customer->id}.pdf");
    }

    public function pdfDownload(Request $request, Customer $customer)
    {
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');
        abort_unless($customer->tenant_id === $user->tenant_id, 403, 'Forbidden');

        $pdf = Pdf::loadView('pdf.customer', [
            'customer' => $customer,
            'company' => [
                'name' => 'Harbour Decor Rentals',
                'phone' => '000-000-0000',
                'address' => 'Your Address Here',
                'email' => 'dev@harbourdecor.test',
            ],
        ]);

        return $pdf->download("customer-{$customer->id}.pdf");
    }

    public function emailPdf(Request $request, Customer $customer)
    {
        $user = $request->user();
        abort_unless($user && $user->tenant_id, 403, 'tenant_id missing');
        abort_unless($customer->tenant_id === $user->tenant_id, 403, 'Forbidden');

        $data = $request->validate([
            'to' => 'nullable|email',
            'subject' => 'nullable|string|max:255',
            'message' => 'nullable|string',
        ]);

        $to = $data['to'] ?? $customer->email;
        abort_unless($to, 422, 'Customer email is missing');

        $pdf = Pdf::loadView('pdf.customer', [
            'customer' => $customer,
            'company' => [
                'name' => 'Harbour Decor Rentals',
                'phone' => '000-000-0000',
                'address' => 'Your Address Here',
                'email' => 'dev@harbourdecor.test',
            ],
        ]);

        Mail::raw($data['message'] ?? 'Customer profile attached.', function ($m) use ($to, $data, $pdf, $customer) {
            $m->to($to)
                ->subject($data['subject'] ?? "Customer Profile: {$customer->name}")
                ->attachData($pdf->output(), "customer-{$customer->id}.pdf");
        });

        return back()->with('success', 'Email sent with customer PDF');
    }
}
