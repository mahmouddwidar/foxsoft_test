<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Auth\UserAuthController;
use App\Http\Controllers\Auth\AdminAuthController;
use App\Http\Controllers\Auth\LogoutController;
use App\Http\Controllers\PostController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Test route to verify API is working
Route::get('/test', function () {
    return response()->json([
        'message' => 'API is working!',
        'timestamp' => now()
    ]);
});

// Authentication Routes
Route::post('users/login', [UserAuthController::class, 'login']);
Route::post('admins/login', [AdminAuthController::class, 'login']);

// Protected Routes
Route::middleware(['auth:sanctum'])->group(function () {
    // Unified logout for both users and admins
    Route::post('/logout', [LogoutController::class, 'logout']);

    // Posts Routes - Protected for both users and admins
    Route::apiResource('posts', PostController::class);
});
