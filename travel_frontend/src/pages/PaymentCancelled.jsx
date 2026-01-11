import { useNavigate } from "react-router-dom";
import { FaBan } from "react-icons/fa";

export default function PaymentCancelled() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-yellow-50 to-yellow-100 p-4">
      <div className="bg-white rounded-3xl shadow-2xl p-12 text-center max-w-md w-full">
        <div className="w-24 h-24 bg-yellow-500 rounded-full flex items-center justify-center mx-auto mb-6">
          <FaBan className="text-5xl text-white" />
        </div>
        
        <h1 className="text-3xl font-bold text-gray-800 mb-3">Payment Cancelled</h1>
        <p className="text-gray-600 mb-6">
          You have cancelled the payment process.
        </p>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
          <p className="text-sm text-yellow-800">
            No amount has been charged. You can try booking again whenever you're ready.
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
