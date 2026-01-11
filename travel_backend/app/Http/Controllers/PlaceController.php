<?php

namespace App\Http\Controllers;

use App\Models\Place;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class PlaceController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $places = Place::withCount('packages')->get();
        return response()->json($places);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:places',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'description']);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/places'), $imageName);
            $data['image'] = 'uploads/places/' . $imageName;
        }

        $place = Place::create($data);
        return response()->json($place, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $place = Place::withCount('packages')->findOrFail($id);
        return response()->json($place);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $place = Place::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:places,name,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'description']);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($place->image && file_exists(public_path($place->image))) {
                unlink(public_path($place->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/places'), $imageName);
            $data['image'] = 'uploads/places/' . $imageName;
        }

        $place->update($data);
        return response()->json($place);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $place = Place::findOrFail($id);

        // Delete image
        if ($place->image && file_exists(public_path($place->image))) {
            unlink(public_path($place->image));
        }

        $place->delete();
        return response()->json(['message' => 'Place deleted successfully']);
    }
}
