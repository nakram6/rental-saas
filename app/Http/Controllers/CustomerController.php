<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;
use Inertia\Inertia;

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

    // 👇 THIS IS THE LINE YOU ARE ASKING ABOUT
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


    

}
