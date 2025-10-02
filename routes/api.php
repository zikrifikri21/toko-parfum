<?php

use App\Http\Controllers\Api\AuthenticateController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/login-ci', [AuthenticateController::class, 'login']);

Route::middleware('auth:sanctum')->group(function () {
    Route::post('/logout-ci', [AuthenticateController::class, 'logout']);
    Route::get('/user-ci', [AuthenticateController::class, 'user']);
});
