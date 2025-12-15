<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

// Controllers
use App\Http\Controllers\AuthController;
use App\Http\Controllers\PackageController;
use App\Http\Controllers\BookingController;
use App\Http\Controllers\QueryController;
use App\Http\Controllers\ContactMessageController;
use App\Http\Controllers\UserController;
use App\Http\Controllers\DestinationController;
use App\Http\Controllers\ReportController;


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Public packages
Route::get('/packages', [PackageController::class, 'index']);
Route::get('/packages/{id}', [PackageController::class, 'show']);

// Public destinations
Route::get('/destinations', [DestinationController::class, 'index']);
Route::get('/destinations/popular', [DestinationController::class, 'popular']);
Route::get('/destinations/featured', [DestinationController::class, 'featured']);

// Public query/contact submission
Route::post('/queries', [QueryController::class, 'store']);
Route::post('/contact', [ContactMessageController::class, 'store']);


/*
|--------------------------------------------------------------------------
| PROTECTED ROUTES (Require Login)
|--------------------------------------------------------------------------
*/

Route::middleware('auth:sanctum')->group(function () {

    // Logout
    Route::post('/logout', [AuthController::class, 'logout']);

    // Current user
    Route::get('/user', function (Request $request) {
        return $request->user();
    });

    // User Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);

    /*
    |--------------------------------------------------------------------------
    | ADMIN ONLY ROUTES
    |--------------------------------------------------------------------------
    */

    Route::middleware('role:admin')->group(function () {
        
        // Packages Management
        Route::post('/packages', [PackageController::class, 'store']);
        Route::put('/packages/{id}', [PackageController::class, 'update']);
        Route::delete('/packages/{id}', [PackageController::class, 'destroy']);

        // Bookings Management
        Route::get('/admin/bookings', [BookingController::class, 'index']);
        Route::get('/admin/bookings/{id}', [BookingController::class, 'show']);
        Route::patch('/admin/bookings/{id}/status', [BookingController::class, 'updateStatus']);
        Route::delete('/admin/bookings/{id}', [BookingController::class, 'destroy']);

        // Users Management
        Route::get('/admin/users', [UserController::class, 'index']);
        Route::get('/admin/users/{id}', [UserController::class, 'show']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);

        // Queries Management
        Route::get('/admin/queries', [QueryController::class, 'index']);
        Route::patch('/admin/queries/{id}/read', [QueryController::class, 'markAsRead']);
        Route::delete('/admin/queries/{id}', [QueryController::class, 'destroy']);

        // Contact Messages Management
        Route::get('/admin/messages', [ContactMessageController::class, 'index']);
        Route::patch('/admin/messages/{id}/read', [ContactMessageController::class, 'markAsRead']);
        Route::delete('/admin/messages/{id}', [ContactMessageController::class, 'destroy']);

        // Destinations Management
        Route::post('/admin/destinations', [DestinationController::class, 'store']);
        Route::put('/admin/destinations/{id}', [DestinationController::class, 'update']);
        Route::delete('/admin/destinations/{id}', [DestinationController::class, 'destroy']);

        // Reports & Analytics
        Route::get('/admin/reports/dashboard', [ReportController::class, 'dashboardStats']);
        Route::get('/admin/reports/monthly-bookings', [ReportController::class, 'monthlyBookings']);
        Route::get('/admin/reports/top-packages', [ReportController::class, 'topPackages']);
        Route::get('/admin/reports/package-distribution', [ReportController::class, 'packageTypeDistribution']);
        Route::get('/admin/reports/revenue', [ReportController::class, 'revenue']);
    });
});

