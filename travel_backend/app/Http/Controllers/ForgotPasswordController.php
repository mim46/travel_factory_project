<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use App\Models\User;
use App\Models\Otp;

class ForgotPasswordController extends Controller
{
    /**
     * Send OTP to email
     */
    public function sendOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email'
        ]);

        // Generate 6-digit OTP
        $otp = rand(100000, 999999);

        // Delete any existing OTPs for this email
        Otp::where('email', $request->email)->delete();

        // Create new OTP (expires in 10 minutes)
        Otp::create([
            'email' => $request->email,
            'otp' => $otp,
            'expires_at' => now()->addMinutes(10),
        ]);

        // Send OTP via email
        try {
            Mail::raw("Your OTP for password reset is: {$otp}\n\nThis OTP will expire in 10 minutes.", function ($message) use ($request) {
                $message->to($request->email)
                        ->subject('Password Reset OTP');
            });

            // Log OTP for development (remove in production)
            \Log::info("OTP for {$request->email}: {$otp}");

            return response()->json([
                'success' => true,
                'message' => 'OTP sent to your email successfully',
                'otp' => config('app.debug') ? $otp : null // Only show in debug mode
            ]);
        } catch (\Exception $e) {
            // Log error for debugging
            \Log::error('Failed to send OTP: ' . $e->getMessage());
            
            // Still return success but with OTP in debug mode
            return response()->json([
                'success' => true,
                'message' => 'OTP generated successfully',
                'otp' => config('app.debug') ? $otp : null // Show OTP in debug mode
            ]);
        }
    }

    /**
     * Verify OTP
     */
    public function verifyOtp(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'otp' => 'required|string|size:6'
        ]);

        $isValid = Otp::verifyOtp($request->email, $request->otp);

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP'
            ], 400);
        }

        return response()->json([
            'success' => true,
            'message' => 'OTP verified successfully'
        ]);
    }

    /**
     * Reset Password
     */
    public function resetPassword(Request $request)
    {
        $request->validate([
            'email' => 'required|email|exists:users,email',
            'otp' => 'required|string|size:6',
            'password' => 'required|string|min:8|confirmed'
        ]);

        // Verify OTP one more time
        $isValid = Otp::verifyOtp($request->email, $request->otp);

        if (!$isValid) {
            return response()->json([
                'success' => false,
                'message' => 'Invalid or expired OTP'
            ], 400);
        }

        // Update user password
        $user = User::where('email', $request->email)->first();
        $user->password = Hash::make($request->password);
        $user->save();

        // Delete used OTP
        Otp::where('email', $request->email)->delete();

        return response()->json([
            'success' => true,
            'message' => 'Password reset successfully'
        ]);
    }
}
