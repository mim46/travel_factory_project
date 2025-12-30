<?php

namespace App\Http\Controllers;

use App\Models\Package;
use Illuminate\Http\Request;

class PackageController extends Controller
{
    /**
     * 🔹 LIST ALL PACKAGES (User + Admin)
     */
    public function index()
    {
        return response()->json(Package::all(), 200);
    }


    /**
     * 🔹 CREATE PACKAGE (Admin Only)
     */
    public function store(Request $request)
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'package_type' => 'required|in:domestic,international,budget',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'price' => 'required|numeric',
            'itinerary' => 'nullable|string',
            'inclusions' => 'nullable|string',
            'exclusions' => 'nullable|string',
        ]);

        $package = Package::create($request->all());

        return response()->json([
            'message' => 'Package created successfully!',
            'package' => $package
        ], 201);
    }

    /**
     * 🔹 VIEW SINGLE PACKAGE (User + Admin)
     */
    public function show($id)
    {
        $package = Package::find($id);

        if (!$package) {
            return response()->json([
                'message' => 'Package not found'
            ], 404);
        }

        return response()->json($package, 200);
    }

    /**
     * 🔹 UPDATE PACKAGE (Admin Only)
     */
    public function update(Request $request, $id)
    {
        $package = Package::find($id);

        if (!$package) {
            return response()->json([
                'message' => 'Package not found'
            ], 404);
        }

        $request->validate([
            'title' => 'required|string|max:255',
            'country' => 'required|string|max:255',
            'city' => 'nullable|string|max:255',
            'package_type' => 'required|in:domestic,international,budget',
            'duration' => 'required|string',
            'description' => 'required|string',
            'image' => 'nullable|string',
            'price' => 'required|numeric',
            'itinerary' => 'nullable|string',
            'inclusions' => 'nullable|string',
            'exclusions' => 'nullable|string',
        ]);

        $package->update($request->all());

        return response()->json([
            'message' => 'Package updated successfully!',
            'package' => $package
        ], 200);
    }

    /**
     * 🔹 DELETE PACKAGE (Admin Only)
     */
    public function destroy($id)
    {
        $package = Package::find($id);

        if (!$package) {
            return response()->json([
                'message' => 'Package not found'
            ], 404);
        }

        $package->delete();

        return response()->json([
            'message' => 'Package deleted successfully!'
        ], 200);
    }
}