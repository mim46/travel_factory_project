<?php

namespace App\Http\Controllers;

use App\Models\Review;
use App\Models\Booking;
use App\Models\Package;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class ReviewController extends Controller
{
    // Get all approved reviews for a package
    public function getPackageReviews($packageId)
    {
        $reviews = Review::where('package_id', $packageId)
            ->where('is_approved', true)
            ->with(['user:id,name'])
            ->orderBy('created_at', 'desc')
            ->get();

        $averageRating = $reviews->avg('rating');
        $totalReviews = $reviews->count();

        return response()->json([
            'reviews' => $reviews,
            'average_rating' => round($averageRating, 1),
            'total_reviews' => $totalReviews
        ]);
    }

    // Get featured reviews for landing page
    public function getFeaturedReviews()
    {
        $reviews = Review::where('is_approved', true)
            ->with(['user:id,name', 'package:id,title'])
            ->orderBy('created_at', 'desc')
            ->limit(6)
            ->get();

        return response()->json($reviews);
    }

    // Submit a review
    public function store(Request $request)
    {
        $request->validate([
            'package_id' => 'required|exists:packages,id',
            'booking_id' => 'required|exists:bookings,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:1000',
        ]);

        $user = Auth::user();

        // Check if booking belongs to user and is completed
        $booking = Booking::where('id', $request->booking_id)
            ->where('user_id', $user->id)
            ->where('package_id', $request->package_id)
            ->first();

        if (!$booking) {
            return response()->json(['error' => 'Booking not found or does not belong to you'], 403);
        }

        // Optional: Check if booking is completed/paid
        if ($booking->payment_status !== 'paid' && $booking->payment_status !== 'completed') {
            return response()->json(['error' => 'You can only review after completing payment'], 403);
        }

        // Check if user already reviewed this package
        $existingReview = Review::where('user_id', $user->id)
            ->where('package_id', $request->package_id)
            ->first();

        if ($existingReview) {
            return response()->json(['error' => 'You have already reviewed this package'], 409);
        }

        $review = Review::create([
            'user_id' => $user->id,
            'package_id' => $request->package_id,
            'booking_id' => $request->booking_id,
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => false
        ]);

        return response()->json([
            'message' => 'Review submitted successfully! It will be visible after admin approval.',
            'review' => $review
        ], 201);
    }

    // Get current user's reviews
    public function myReviews()
    {
        $reviews = Review::where('user_id', Auth::id())
            ->with('package:id,title,image')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    // Update user's own review
    public function update(Request $request, $id)
    {
        $request->validate([
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'required|string|min:10|max:1000',
        ]);

        $review = Review::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        $review->update([
            'rating' => $request->rating,
            'comment' => $request->comment,
            'is_approved' => false // Reset approval after edit
        ]);

        return response()->json([
            'message' => 'Review updated successfully! It will be reviewed again by admin.',
            'review' => $review
        ]);
    }

    // Delete user's own review
    public function destroy($id)
    {
        $review = Review::where('id', $id)
            ->where('user_id', Auth::id())
            ->first();

        if (!$review) {
            return response()->json(['error' => 'Review not found'], 404);
        }

        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }

    // Admin: Get all reviews
    public function adminIndex()
    {
        $reviews = Review::with(['user:id,name', 'package:id,title'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    // Admin: Get pending reviews
    public function pendingReviews()
    {
        $reviews = Review::where('is_approved', false)
            ->with(['user:id,name', 'package:id,title'])
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($reviews);
    }

    // Admin: Approve review
    public function approve($id)
    {
        $review = Review::findOrFail($id);
        $review->update(['is_approved' => true]);

        return response()->json([
            'message' => 'Review approved successfully',
            'review' => $review
        ]);
    }

    // Admin: Delete any review
    public function adminDestroy($id)
    {
        $review = Review::findOrFail($id);
        $review->delete();

        return response()->json(['message' => 'Review deleted successfully']);
    }
}

