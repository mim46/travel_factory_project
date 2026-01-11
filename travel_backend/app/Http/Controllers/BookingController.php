<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;

class BookingController extends Controller
{
    // Create new booking
    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'persons' => 'required|integer|min:1',
            'travel_date' => 'required|date',
            'special_request' => 'nullable|string',
        ]);

        $package = Package::findOrFail($request->package_id);

        // Group tour validation
        if ($package->tour_type === 'group') {
            // Check available seats
            $available = $package->available_seats;
            
            if ($available !== null && $request->persons > $available) {
                return response()->json([
                    'message' => "Only {$available} seats available"
                ], 422);
            }

            // Check max capacity
            if ($package->max_persons && $request->persons > $package->max_persons) {
                return response()->json([
                    'message' => "Maximum {$package->max_persons} persons allowed per booking"
                ], 422);
            }
        }

        $booking = Booking::create([
            'user_id' => auth()->id(),
            'package_id' => $request->package_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'persons' => $request->persons,
            'travel_date' => $request->travel_date,
            'special_request' => $request->special_request,
            'status' => 'confirmed',
        ]);

        return response()->json([
            'message' => 'Booking created successfully!',
            'booking' => $booking->load('package'),
        ], 201);
    }

    // Get user's bookings
    public function myBookings()
    {
        $bookings = Booking::where('user_id', auth()->id())
            ->with('package')
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    // Get all bookings (Admin only)
    public function index()
    {
        $bookings = Booking::with(['user', 'package'])
            ->latest()
            ->get();

        return response()->json($bookings);
    }

    // Get single booking
    public function show($id)
    {
        $booking = Booking::with(['user', 'package'])->findOrFail($id);
        return response()->json($booking);
    }

    // Update booking status (Admin only)
    public function updateStatus(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:pending,confirmed,cancelled',
        ]);

        $booking = Booking::findOrFail($id);
        $booking->update(['status' => $request->status]);

        return response()->json([
            'message' => 'Booking status updated!',
            'booking' => $booking->load(['user', 'package']),
        ]);
    }

    // Delete booking (Admin only)
    public function destroy($id)
    {
        $booking = Booking::findOrFail($id);
        $booking->delete();

        return response()->json(['message' => 'Booking deleted successfully!']);
    }
}
