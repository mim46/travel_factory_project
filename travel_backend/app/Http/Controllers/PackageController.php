<?php

namespace App\Http\Controllers;

use App\Models\Package;
use App\Models\Country;
use App\Models\Place;
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
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            'price' => 'required|numeric',
            'itinerary' => 'nullable|string',
            'inclusions' => 'nullable|string',
            'exclusions' => 'nullable|string',
        ]);

        $data = $request->except('image', 'country_image', 'place_image');

        // Handle country - create if new with image
        if ($request->country && !$request->country_id) {
            $country = Country::firstOrCreate(
                ['name' => $request->country],
                ['description' => '']
            );
            
            if ($request->hasFile('country_image')) {
                $countryImage = $request->file('country_image');
                $countryImageName = time() . '_country_' . uniqid() . '.' . $countryImage->getClientOriginalExtension();
                $countryImage->move(public_path('uploads/countries'), $countryImageName);
                $country->image = 'uploads/countries/' . $countryImageName;
                $country->save();
            }
            
            $data['country_id'] = $country->id;
        }

        // Handle place - create if new with image
        if ($request->city && !$request->place_id) {
            $place = Place::firstOrCreate(
                ['name' => $request->city],
                ['description' => '']
            );
            
            if ($request->hasFile('place_image')) {
                $placeImage = $request->file('place_image');
                $placeImageName = time() . '_place_' . uniqid() . '.' . $placeImage->getClientOriginalExtension();
                $placeImage->move(public_path('uploads/places'), $placeImageName);
                $place->image = 'uploads/places/' . $placeImageName;
                $place->save();
            }
            
            $data['place_id'] = $place->id;
        }

        // Handle package image upload
        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/packages'), $imageName);
            $data['image'] = 'uploads/packages/' . $imageName;
        }

        $package = Package::create($data);

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

        // Add tour info for group tours
        $packageData = $package->toArray();
        
        if ($package->tour_type === 'group') {
            $packageData['total_booked'] = $package->total_booked;
            $packageData['available_seats'] = $package->available_seats;
            $packageData['is_tour_confirmed'] = $package->is_confirmed;
        }

        return response()->json($packageData, 200);
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
            'image' => 'nullable|image|mimes:jpeg,jpg,png,gif|max:2048',
            'price' => 'required|numeric',
            'itinerary' => 'nullable|string',
            'inclusions' => 'nullable|string',
            'exclusions' => 'nullable|string',
        ]);

        $data = $request->except('image', 'country_image', 'place_image');

        // Handle country - create if new with image
        if ($request->country && !$request->country_id) {
            $country = Country::firstOrCreate(
                ['name' => $request->country],
                ['description' => '']
            );
            
            if ($request->hasFile('country_image')) {
                $countryImage = $request->file('country_image');
                $countryImageName = time() . '_country_' . uniqid() . '.' . $countryImage->getClientOriginalExtension();
                $countryImage->move(public_path('uploads/countries'), $countryImageName);
                $country->image = 'uploads/countries/' . $countryImageName;
                $country->save();
            }
            
            $data['country_id'] = $country->id;
        }

        // Handle place - create if new with image
        if ($request->city && !$request->place_id) {
            $place = Place::firstOrCreate(
                ['name' => $request->city],
                ['description' => '']
            );
            
            if ($request->hasFile('place_image')) {
                $placeImage = $request->file('place_image');
                $placeImageName = time() . '_place_' . uniqid() . '.' . $placeImage->getClientOriginalExtension();
                $placeImage->move(public_path('uploads/places'), $placeImageName);
                $place->image = 'uploads/places/' . $placeImageName;
                $place->save();
            }
            
            $data['place_id'] = $place->id;
        }

        // Handle package image upload
        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($package->image && file_exists(public_path($package->image))) {
                unlink(public_path($package->image));
            }

            $image = $request->file('image');
            $imageName = time() . '_' . uniqid() . '.' . $image->getClientOriginalExtension();
            $image->move(public_path('uploads/packages'), $imageName);
            $data['image'] = 'uploads/packages/' . $imageName;
        }

        $package->update($data);

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