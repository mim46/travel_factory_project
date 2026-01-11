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
use App\Http\Controllers\MessageController;
use App\Http\Controllers\ForgotPasswordController;
use App\Http\Controllers\PaymentController;


/*
|--------------------------------------------------------------------------
| PUBLIC ROUTES
|--------------------------------------------------------------------------
*/

// Auth
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Forgot Password
Route::post('/forgot-password', [ForgotPasswordController::class, 'sendOtp']);
Route::post('/verify-otp', [ForgotPasswordController::class, 'verifyOtp']);
Route::post('/reset-password', [ForgotPasswordController::class, 'resetPassword']);

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

// Payment Callbacks (SSLCommerz) - Support both GET and POST
Route::match(['get', 'post'], '/payment/success', [PaymentController::class, 'success']);
Route::match(['get', 'post'], '/payment/fail', [PaymentController::class, 'fail']);
Route::match(['get', 'post'], '/payment/cancel', [PaymentController::class, 'cancel']);


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

  
    // User Profile Management
    Route::get('/profile', [UserController::class, 'profile']);
    Route::put('/profile', [UserController::class, 'updateProfile']);
    Route::put('/profile/password', [UserController::class, 'updatePassword']);

    // User Bookings
    Route::post('/bookings', [BookingController::class, 'store']);
    Route::get('/my-bookings', [BookingController::class, 'myBookings']);

    // Payment
    Route::post('/payment/initiate', [PaymentController::class, 'initiate']);

    // User Messages
Route::get('/my-messages', [MessageController::class, 'myMessages']);
Route::post('/messages', [MessageController::class, 'store']);
Route::patch('/messages/{id}/read', [MessageController::class, 'markAsRead']);


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
        Route::post('/admin/users', [UserController::class, 'store']);
        Route::get('/admin/users/{id}', [UserController::class, 'show']);
        Route::put('/admin/users/{id}', [UserController::class, 'update']);
        Route::delete('/admin/users/{id}', [UserController::class, 'destroy']);

        // Queries Management
        Route::get('/admin/queries', [QueryController::class, 'index']);
        Route::patch('/admin/queries/{id}/read', [QueryController::class, 'markAsRead']);
        Route::delete('/admin/queries/{id}', [QueryController::class, 'destroy']);
        

        // Admin Messages Management (User Messages)
        Route::get('/admin/messages', [MessageController::class, 'index']);
        Route::post('/admin/messages/{id}/reply', [MessageController::class, 'reply']);
        Route::delete('/admin/messages/{id}', [MessageController::class, 'destroy']);

        // Contact Messages Management (Contact Form Messages)
        Route::get('/admin/contact-messages', [ContactMessageController::class, 'index']); // Changed endpoint
        Route::patch('/admin/contact-messages/{id}/read', [ContactMessageController::class, 'markAsRead']);
        Route::delete('/admin/contact-messages/{id}', [ContactMessageController::class, 'destroy']);

        
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

