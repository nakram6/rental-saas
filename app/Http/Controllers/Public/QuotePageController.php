<?php

namespace App\Http\Controllers\Public;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Inertia\Inertia;

class QuotePageController extends Controller
{
    public function index(Request $request)
    {
        // If you already share tenant in HandleInertiaRequests, keep this simple.
        // Otherwise, pass tenant however you do on Home/Catalog.
        return Inertia::render('Quote/Index', [
            'tenant' => $request->attributes->get('tenant'), // or however you store tenant
        ]);
    }
}
