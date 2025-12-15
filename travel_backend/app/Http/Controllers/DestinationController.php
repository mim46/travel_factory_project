<?php

namespace App\Http\Controllers;

use App\Models\Destination;
use Illuminate\Http\Request;

class DestinationController extends Controller
{
    // Get all destinations
    public function index()
    {
        $destinations = Destination::latest()->get();
        return response()->json($destinations);
    }

    // Get single destination
    public function show($id)
    {
        $destination = Destination::findOrFail($id);
        return response()->json($destination);
    }

    // Create destination (Admin only)
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'country' => 'required|string',
            'type' => 'required|in:domestic,international',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_popular' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $destination = Destination::create($request->all());

        return response()->json([
            'message' => 'Destination created successfully!',
            'destination' => $destination,
        ], 201);
    }

    // Update destination (Admin only)
    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'sometimes|string',
            'country' => 'sometimes|string',
            'type' => 'sometimes|in:domestic,international',
            'description' => 'nullable|string',
            'image' => 'nullable|string',
            'is_popular' => 'boolean',
            'is_featured' => 'boolean',
        ]);

        $destination = Destination::findOrFail($id);
        $destination->update($request->all());

        return response()->json([
            'message' => 'Destination updated successfully!',
            'destination' => $destination,
        ]);
    }

    // Delete destination (Admin only)
    public function destroy($id)
    {
        $destination = Destination::findOrFail($id);
        $destination->delete();

        return response()->json(['message' => 'Destination deleted successfully!']);
    }

    // Get popular destinations
    public function popular()
    {
        $destinations = Destination::where('is_popular', true)->get();
        return response()->json($destinations);
    }

    // Get featured destinations
    public function featured()
    {
        $destinations = Destination::where('is_featured', true)->get();
        return response()->json($destinations);
    }
}
