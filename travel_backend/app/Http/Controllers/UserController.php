<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    // Get all users (Admin only)
    public function index()
    {
        $users = User::with('bookings')
            ->withCount('bookings')
            ->orderBy('id', 'asc')
            ->get();

        return response()->json($users);
    }

    // Create new user (Admin only)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email',
            'password' => 'required|string|min:6',
            'phone' => 'nullable|string',
            'gender' => 'nullable|string',
            'dob' => 'nullable|date',
            'address' => 'nullable|string',
        ]);

        $user = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
            'phone' => $request->phone,
            'gender' => $request->gender,
            'dob' => $request->dob,
            'address' => $request->address,
        ]);

        return response()->json([
            'message' => 'User created successfully!',
            'user' => $user,
        ], 201);
    }

    // Get single user
    public function show($id)
    {
        $user = User::with('bookings.package')
            ->withCount('bookings')
            ->findOrFail($id);

        return response()->json($user);
    }

    // Update user (Admin only)
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string',
            'email' => 'sometimes|email|unique:users,email,' . $id,
            'phone' => 'sometimes|string',
            'gender' => 'sometimes|string',
            'dob' => 'sometimes|date',
            'address' => 'sometimes|string',
        ]);

        $user = User::findOrFail($id);
        
        // Admin cannot update password - only user profile fields
        $updateData = $request->only(['name', 'email', 'phone', 'address', 'gender', 'dob']);
        
        $user->update($updateData);

        return response()->json([
            'message' => 'User updated successfully!',
            'user' => $user,
        ]);
    }

    // Delete user (Admin only)
    public function destroy($id)
    {
        $user = User::findOrFail($id);
        $user->delete();

        return response()->json(['message' => 'User deleted successfully!']);
    }
}
