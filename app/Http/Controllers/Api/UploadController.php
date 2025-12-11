<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'image' => 'required|image|max:5120', // 5MB
        ]);

        $path = $request->file('image')->store('decor-library', 'public');

        return response()->json([
            'url' => '/storage/' . $path,
        ]);
    }
}
