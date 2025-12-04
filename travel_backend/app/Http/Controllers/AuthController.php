<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;

class AuthController extends Controller
{
    // -------------------- REGISTER (USER) --------------------
    public function register(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|min:8'
        ]);

        // Create Normal User
        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password)
        ]);

        // 🚀 Auto Assign "user" role (IMPORTANT)
        $user->assignRole('user');

        // Token generate
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'User registered successfully!',
            'token' => $token,
            'role' => 'user',
            'user' => $user
        ], 201);
    }

    // -------------------- LOGIN --------------------
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json(['message' => 'Invalid credentials'], 401);
        }

        // Token create
        $token = $user->createToken('auth_token')->plainTextToken;

        // ⭐ Get User Role
        $role = $user->getRoleNames()->first(); // "admin" or "user"

        return response()->json([
            'message' => 'Login successful!',
            'token' => $token,
            'role' => $role,
            'user' => $user
        ]);
    }

    // -------------------- LOGOUT --------------------
    public function logout(Request $request)
    {
        $request->user()->tokens()->delete();

        return response()->json([
            'message' => 'Logged out successfully!'
        ]);
    }
}
