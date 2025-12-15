<?php

namespace App\Http\Controllers;

use App\Models\Booking;
use App\Models\Package;
use App\Models\User;
use App\Models\Query;
use App\Models\ContactMessage;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ReportController extends Controller
{
    // Dashboard stats
    public function dashboardStats()
    {
        $stats = [
            'total_users' => User::count(),
            'total_packages' => Package::count(),
            'total_bookings' => Booking::count(),
            'pending_bookings' => Booking::where('status', 'pending')->count(),
            'confirmed_bookings' => Booking::where('status', 'confirmed')->count(),
            'cancelled_bookings' => Booking::where('status', 'cancelled')->count(),
            'total_messages' => ContactMessage::count() + Query::count(),
            'unread_messages' => ContactMessage::where('is_read', false)->count() + Query::where('is_read', false)->count(),
            'domestic_packages' => Package::where('package_type', 'domestic')->count(),
            'international_packages' => Package::where('package_type', 'international')->count(),
            'budget_packages' => Package::where('package_type', 'budget')->count(),
        ];

        return response()->json($stats);
    }

    // Monthly bookings chart data
    public function monthlyBookings()
    {
        $monthlyData = Booking::select(
            DB::raw('MONTH(created_at) as month'),
            DB::raw('COUNT(*) as bookings')
        )
            ->whereYear('created_at', date('Y'))
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        $chartData = [];

        foreach ($monthlyData as $data) {
            $chartData[] = [
                'month' => $months[$data->month - 1],
                'bookings' => $data->bookings,
            ];
        }

        return response()->json($chartData);
    }

    // Top selling packages
    public function topPackages()
    {
        $topPackages = Package::withCount('bookings')
            ->orderBy('bookings_count', 'desc')
            ->limit(5)
            ->get();

        return response()->json($topPackages);
    }

    // Package type distribution
    public function packageTypeDistribution()
    {
        $distribution = Package::select('package_type', DB::raw('count(*) as count'))
            ->groupBy('package_type')
            ->get();

        return response()->json($distribution);
    }

    // Revenue report (if you add payment tracking later)
    public function revenue()
    {
        // This can be expanded when payment system is added
        $bookings = Booking::with('package')
            ->where('status', 'confirmed')
            ->get();

        $totalRevenue = 0;
        foreach ($bookings as $booking) {
            $totalRevenue += ($booking->package->price ?? 0) * $booking->persons;
        }

        return response()->json([
            'total_revenue' => $totalRevenue,
            'confirmed_bookings' => $bookings->count(),
        ]);
    }
}
