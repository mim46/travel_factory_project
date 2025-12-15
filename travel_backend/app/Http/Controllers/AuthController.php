<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // ===========================
    // ⭐ REGISTER (Normal User)
    // ===========================
    public function register(Request $request)
    {
        $request->validate([
            'name'     => 'required|string',
            'email'    => 'required|email|unique:users,email',
            'password' => 'required|min:8',
            'phone'    => 'required|string|max:20',
            'gender'   => 'required|string',
            'dob'      => 'required|date',
            'address'  => 'required|string',
        ]);

        // Create user
        $user = User::create([
            'name'     => $request->name,
            'email'    => $request->email,
            'password' => Hash::make($request->password),
            'phone'    => $request->phone,
            'gender'   => $request->gender,
            'dob'      => $request->dob,
            'address'  => $request->address,
        ]);

        // Assign default role → user
        $user->assignRole('user');

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'token'   => $token,
            'role'    => 'user',
            'user'    => $user,
        ], 201);
    }

    // ===========================
    // ⭐ LOGIN
    // ===========================
    public function login(Request $request)
    {
        $request->validate([
            'email'    => 'required|email',
            'password' => 'required'
        ]);

        // Find user
        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Generate token
        $token = $user->createToken('auth_token')->plainTextToken;

        // Get ROLE → "admin" or "user"
        $role = $user->getRoleNames()->first();

        return response()->json([
            'message' => 'Login successful!',
            'token'   => $token,
            'role'    => $role,
            'user'    => $user
        ], 200);
    }

    // ===========================
    // ⭐ LOGOUT
    // ===========================
    public function logout(Request $request)
    {
        // Delete all user tokens
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully!'
        ]);
    }
}
