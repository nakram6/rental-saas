<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;

class SetCurrentTenant
{
    public function handle(Request $request, Closure $next)
    {
        // 1) Try your desired tenant
        $tenant = Tenant::where('slug', 'harbour-decor')->first();

        // 2) Fallback for local/dev so app never crashes
        if (!$tenant) {
            $tenant = Tenant::first(); // dev fallback
        }

        // 3) If still no tenant, show a clear error
        if (!$tenant) {
            abort(500, 'No tenant found. Please create a tenant record first.');
        }

        // ✅ Always bind
        app()->instance('currentTenant', $tenant);

        return $next($request);
    }
}
