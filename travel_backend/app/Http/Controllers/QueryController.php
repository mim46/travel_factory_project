<?php

namespace App\Http\Controllers;

use App\Models\Query;
use Illuminate\Http\Request;

class QueryController extends Controller
{
    // Submit query (Public)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'email' => 'required|email',
            'message' => 'required|string',
        ]);

        $query = Query::create([
            'name' => $request->name,
            'email' => $request->email,
            'message' => $request->message,
        ]);

        return response()->json([
            'message' => 'Query submitted successfully!',
            'query' => $query,
        ], 201);
    }

    // Get all queries (Admin only)
    public function index()
    {
        $queries = Query::latest()->get();
        return response()->json($queries);
    }

    // Mark as read (Admin only)
    public function markAsRead($id)
    {
        $query = Query::findOrFail($id);
        $query->update(['is_read' => true]);

        return response()->json([
            'message' => 'Query marked as read!',
            'query' => $query,
        ]);
    }

    // Delete query (Admin only)
    public function destroy($id)
    {
        $query = Query::findOrFail($id);
        $query->delete();

        return response()->json(['message' => 'Query deleted successfully!']);
    }
}
