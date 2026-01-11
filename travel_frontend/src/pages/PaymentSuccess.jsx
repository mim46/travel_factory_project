import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle } from "react-icons/fa";

export default function PaymentSuccess() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const bookingId = searchParams.get('booking_id');

  useEffect(() => {
    // Auto redirect after 5 seconds
    const timer = setTimeout(() => {
      navigate('/user/bookings');
    }, 5000);

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-green-50 to-green-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <div className="w-24 h-24 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce">
          <FaCheckCircle className="text-5xl text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Your booking has been confirmed successfully.
        </p>
        
        {bookingId && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">Booking ID:</p>
            <p className="text-xl font-bold text-green-700">#{bookingId}</p>
          </div>
        )}
        
        <p className="text-sm text-gray-500 mb-6">
          Redirecting to your bookings in 5 seconds...
        </p>
        
        <button
          onClick={() => navigate('/user/bookings')}
          className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-lg transition"
        >
          View My Bookings
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="w-full mt-3 bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
