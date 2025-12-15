<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ItemController;
use App\Http\Controllers\Api\AssistantController;

// Example existing route (keep it if you want)
Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

/*
|--------------------------------------------------------------------------
| Items API
|--------------------------------------------------------------------------
| For now these are PUBLIC for easy testing.
| Later, you can wrap them in a Route::middleware('auth:sanctum')->group(...)
| so only logged-in users can access them.
*/

// 👇 Image upload must come BEFORE /items/{item}
Route::post('/items/upload-image', [ItemController::class, 'uploadImage']);

Route::get('/items', [ItemController::class, 'index']);
Route::post('/items', [ItemController::class, 'store']);
Route::get('/items/{item}', [ItemController::class, 'show']);
Route::put('/items/{item}', [ItemController::class, 'update']);
Route::delete('/items/{item}', [ItemController::class, 'destroy']);

// Simple ping test (optional)
Route::get('/ping', function () {
    return ['message' => 'pong'];
});

Route::post('/assistant', [AssistantController::class, 'chat'])
    ->middleware('throttle:30,1');
