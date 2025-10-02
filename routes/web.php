<?php

use Inertia\Inertia;
use Illuminate\Support\Facades\Route;
use App\Http\Middleware\TokenAutoLogin;
use App\Http\Controllers\PostsController;
use App\Http\Controllers\DashboardController;

Route::get('/', function () {
    return Inertia::render('welcome');
})->name('home');

Route::get('/dashboard-parfum', [DashboardController::class, 'index'])->middleware(['web', TokenAutoLogin::class]);

Route::middleware(['auth', 'verified'])->group(function () {
    Route::get('dashboard', [DashboardController::class, 'index'])->name('dashboard');
    Route::get('posts', [PostsController::class, 'index'])->name('posts.index');
    Route::post('posts/store', [PostsController::class, 'store'])->name('posts.store');
    Route::put('posts/update/{posts}', [PostsController::class, 'update'])->name('posts.update');
    Route::delete('posts/destroy/{posts}', [PostsController::class, 'destroy'])->name('posts.destroy');
});

require __DIR__ . '/settings.php';
require __DIR__ . '/auth.php';
