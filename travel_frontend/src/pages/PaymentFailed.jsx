import { useNavigate } from "react-router-dom";
import { FaTimesCircle } from "react-icons/fa";

export default function PaymentFailed() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <div className="w-24 h-24 bg-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaTimesCircle className="text-5xl text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Failed</h1>
        <p className="text-gray-600 mb-6">
          Unfortunately, your payment could not be processed. Please try again.
        </p>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-red-800">
            If the amount was deducted from your account, it will be refunded within 5-7 business days.
          </p>
        </div>
        
        <button
          onClick={() => navigate(-1)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition mb-3"
        >
          Try Again
        </button>
        
        <button
          onClick={() => navigate('/')}
          className="w-full bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-3 rounded-lg transition"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
}
