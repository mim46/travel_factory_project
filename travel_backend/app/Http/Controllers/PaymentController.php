<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;
use App\Models\Booking;

class PaymentController extends Controller
{
    /**
     * Initialize SSLCommerz Payment
     */
    public function initiate(Request $request)
    {
        $request->validate([
            'package_id' => 'required|integer',
            'name' => 'required|string',
            'email' => 'required|email',
            'phone' => 'required|string',
            'persons' => 'required|integer|min:1',
            'travel_date' => 'required|date',
            'total_amount' => 'required|numeric',
            'advance_amount' => 'nullable|numeric',
            'payment_type' => 'nullable|string|in:advance,full',
        ]);

        $user = $request->user();
        
        // Determine payment amount (advance or full)
        $paymentAmount = $request->advance_amount ?? $request->total_amount;
        $paymentType = $request->payment_type ?? 'full';

        // Create booking first with confirmed status
        $booking = Booking::create([
            'user_id' => $user->id,
            'package_id' => $request->package_id,
            'name' => $request->name,
            'email' => $request->email,
            'phone' => $request->phone,
            'persons' => $request->persons,
            'travel_date' => $request->travel_date,
            'special_request' => $request->special_request,
            'total_price' => $request->total_amount,
            'payment_method' => 'sslcommerz',
            'payment_status' => 'pending',
            'status' => 'confirmed', // Always confirmed for users
        ]);

        // SSLCommerz Credentials
        $storeId = config('services.sslcommerz.store_id');
        $storePassword = config('services.sslcommerz.store_password');
        $isSandbox = config('services.sslcommerz.sandbox', true);

        $apiUrl = $isSandbox 
            ? 'https://sandbox.sslcommerz.com/gwprocess/v4/api.php'
            : 'https://securepay.sslcommerz.com/gwprocess/v4/api.php';

        // Prepare payment data
        $postData = [
            'store_id' => $storeId,
            'store_passwd' => $storePassword,
            'total_amount' => $paymentAmount,
            'currency' => 'BDT',
            'tran_id' => 'TXN_' . $booking->id . '_' . time(),
            'success_url' => config('services.sslcommerz.success_url'),
            'fail_url' => config('services.sslcommerz.fail_url'),
            'cancel_url' => config('services.sslcommerz.cancel_url'),
            'ipn_url' => config('services.sslcommerz.ipn_url'),
            
            // Customer Information
            'cus_name' => $request->name,
            'cus_email' => $request->email,
            'cus_phone' => $request->phone,
            'cus_add1' => 'Dhaka',
            'cus_city' => 'Dhaka',
            'cus_country' => 'Bangladesh',
            
            // Product Information
            'product_name' => 'Travel Package Booking - ' . ($paymentType === 'advance' ? 'Advance Payment' : 'Full Payment'),
            'product_category' => 'Travel',
            'product_profile' => 'general',
            
            // Shipment Information
            'shipping_method' => 'NO',
            'num_of_item' => $request->persons,
            
            // Additional
            'value_a' => $booking->id, // Booking ID for reference
        ];

        try {
            $response = Http::asForm()->post($apiUrl, $postData);
            $result = $response->json();

            if (isset($result['status']) && $result['status'] === 'SUCCESS') {
                // Save transaction ID
                $booking->update(['transaction_id' => $postData['tran_id']]);

                return response()->json([
                    'success' => true,
                    'gateway_url' => $result['GatewayPageURL'],
                    'booking_id' => $booking->id,
                ]);
            } else {
                Log::error('SSLCommerz Error: ', $result);
                return response()->json([
                    'success' => false,
                    'message' => $result['failedreason'] ?? 'Payment initialization failed'
                ], 400);
            }
        } catch (\Exception $e) {
            Log::error('SSLCommerz Exception: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Payment gateway error: ' . $e->getMessage()
            ], 500);
        }
    }

    /**
     * Payment Success Callback
     */
    public function success(Request $request)
    {
        $tranId = $request->tran_id;
        $bookingId = $request->value_a;

        // Validate payment
        if ($this->validatePayment($tranId, $request->all())) {
            $booking = Booking::find($bookingId);
            if ($booking) {
                $booking->update([
                    'payment_status' => 'completed',
                    'status' => 'confirmed',
                    'payment_details' => json_encode($request->all()),
                ]);

                // Redirect to frontend success page
                $frontendUrl = config('services.sslcommerz.frontend_url');
                return redirect($frontendUrl . '/payment/success?booking_id=' . $bookingId);
            }
        }

        return redirect(config('services.sslcommerz.frontend_url') . '/payment/failed');
    }

    /**
     * Payment Fail Callback
     */
    public function fail(Request $request)
    {
        $bookingId = $request->value_a;
        
        if ($bookingId) {
            $booking = Booking::find($bookingId);
            if ($booking) {
                $booking->update([
                    'payment_status' => 'failed',
                    'status' => 'cancelled',
                ]);
            }
        }

        $frontendUrl = config('services.sslcommerz.frontend_url');
        return redirect($frontendUrl . '/payment/failed');
    }

    /**
     * Payment Cancel Callback
     */
    public function cancel(Request $request)
    {
        $bookingId = $request->value_a;
        
        if ($bookingId) {
            $booking = Booking::find($bookingId);
            if ($booking) {
                $booking->update([
                    'payment_status' => 'cancelled',
                    'status' => 'cancelled',
                ]);
            }
        }

        $frontendUrl = config('services.sslcommerz.frontend_url');
        return redirect($frontendUrl . '/payment/cancelled');
    }

    /**
     * Validate Payment with SSLCommerz
     */
    private function validatePayment($tranId, $data)
    {
        $storeId = config('services.sslcommerz.store_id');
        $storePassword = config('services.sslcommerz.store_password');
        $isSandbox = config('services.sslcommerz.sandbox', true);

        $validationUrl = $isSandbox
            ? 'https://sandbox.sslcommerz.com/validator/api/validationserverAPI.php'
            : 'https://securepay.sslcommerz.com/validator/api/validationserverAPI.php';

        $response = Http::get($validationUrl, [
            'val_id' => $data['val_id'] ?? '',
            'store_id' => $storeId,
            'store_passwd' => $storePassword,
            'format' => 'json',
        ]);

        $result = $response->json();

        return isset($result['status']) && $result['status'] === 'VALID';
    }
}
