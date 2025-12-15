<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;

class UserController extends Controller
{
    // Get all users (Admin only)
    public function index()
    {
        $users = User::with('bookings')
            ->withCount('bookings')
            ->latest()
            ->get();

        return response()->json($users);
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
        ]);

        $user = User::findOrFail($id);
        $user->update($request->only(['name', 'email', 'phone', 'address']));

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
