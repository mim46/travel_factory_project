<?php

namespace App\Http\Controllers;

use App\Models\Country;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class CountryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $countries = Country::withCount('packages')->get();
        return response()->json($countries);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string|max:255|unique:countries',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'description']);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/countries'), $imageName);
            $data['image'] = 'uploads/countries/' . $imageName;
        }

        $country = Country::create($data);
        return response()->json($country, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $country = Country::withCount('packages')->findOrFail($id);
        return response()->json($country);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $country = Country::findOrFail($id);

        $request->validate([
            'name' => 'required|string|max:255|unique:countries,name,' . $id,
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048',
            'description' => 'nullable|string',
        ]);

        $data = $request->only(['name', 'description']);

        if ($request->hasFile('image')) {
            // Delete old image
            if ($country->image && file_exists(public_path($country->image))) {
                unlink(public_path($country->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . $image->getClientOriginalName();
            $image->move(public_path('uploads/countries'), $imageName);
            $data['image'] = 'uploads/countries/' . $imageName;
        }

        $country->update($data);
        return response()->json($country);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $country = Country::findOrFail($id);

        // Delete image
        if ($country->image && file_exists(public_path($country->image))) {
            unlink(public_path($country->image));
        }

        $country->delete();
        return response()->json(['message' => 'Country deleted successfully']);
    }
}
