<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\ListProductQrController;
use App\Http\Controllers\Api\AuthenticateController;

Route::post('/login-ci', [AuthenticateController::class, 'login']);
Route::get('/favorites', [ListProductQrController::class, 'favorites']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout-ci', [AuthenticateController::class, 'logout']);
    Route::get('/user-ci', [AuthenticateController::class, 'user']);
});
