<?php

namespace App\Http\Middleware;

use App\Models\Tenant;
use Closure;
use Illuminate\Http\Request;

class SetCurrentTenant
{
    public function handle(Request $request, Closure $next)
    {
        $tenant = Tenant::where('slug', 'harbour-decor')->first();

        if ($tenant) {
            app()->instance('currentTenant', $tenant);
        }

        return $next($request);
    }
}
