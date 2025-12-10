<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;

// Example existing route (keep it if you want)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// 👇 Items API
// For now I’m keeping them PUBLIC for easy testing.
// Later you can wrap these in Route::middleware('auth:sanctum')->group(...)
Route::get('/items', [ItemController::class, 'index']);
Route::post('/items', [ItemController::class, 'store']);
Route::get('/items/{item}', [ItemController::class, 'show']);
Route::put('/items/{item}', [ItemController::class, 'update']);
Route::delete('/items/{item}', [ItemController::class, 'destroy']);

// Simple ping test (optional)
Route::get('/ping', function () {
    return ['message' => 'pong'];
});
