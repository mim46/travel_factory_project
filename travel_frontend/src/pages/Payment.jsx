import { useLocation, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useSelector } from "react-redux";
import { FaCreditCard, FaMobileAlt, FaCheckCircle, FaArrowLeft } from "react-icons/fa";
import api from "../services/api";

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { token } = useSelector((state) => state.auth);
  const bookingData = location.state?.bookingData;
  const packageData = location.state?.packageData;

  const [paymentMethod, setPaymentMethod] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);

  if (!bookingData || !packageData) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-blue-50 to-blue-100">
        <div className="text-center bg-white p-8 rounded-2xl shadow-xl">
          <p className="text-2xl text-red-600 mb-4">❌ No booking data found</p>
          <button 
            onClick={() => navigate("/")} 
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Go Back Home
          </button>
        </div>
      </div>
    );
  }

  const totalAmount = packageData.price * bookingData.persons;
  
  // Calculate advance amount for group tours
  const isGroupTour = packageData.tour_type === "group";
  const advancePercentage = packageData.advance_percentage || 30;
  const advanceAmount = isGroupTour 
    ? Math.round(totalAmount * (advancePercentage / 100))
    : totalAmount;
  const balanceAmount = totalAmount - advanceAmount;

  const handlePayment = async (e) => {
    e.preventDefault();
    
    if (!paymentMethod) {
      alert("⚠️ Please select a payment method");
      return;
    }

    setIsProcessing(true);

    try {
      // Initiate SSLCommerz payment
      const response = await api.post('/payment/initiate', {
        package_id: packageData.id,
        name: bookingData.name,
        email: bookingData.email,
        phone: bookingData.phone,
        persons: bookingData.persons,
        travel_date: bookingData.travel_date,
        special_request: bookingData.special_request,
        total_amount: totalAmount,
        advance_amount: advanceAmount,
        payment_type: isGroupTour ? 'advance' : 'full',
      }, {
        headers: {
          Authorization: `Bearer ${token}`,
        }
      });

      if (response.data.success) {
        // Redirect to SSLCommerz payment gateway
        window.location.href = response.data.gateway_url;
      } else {
        alert("❌ " + response.data.message);
        setIsProcessing(false);
      }
    } catch (error) {
      console.error('Payment error:', error);
      alert("❌ Payment initialization failed: " + (error.response?.data?.message || error.message));
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        
        {/* Back Button */}
        <button 
          onClick={() => navigate(-1)}
          className="mb-6 flex items-center gap-2 text-blue-600 hover:text-blue-800 font-semibold transition"
        >
          <FaArrowLeft /> Back to Booking
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-xl p-6 sticky top-6">
              <h2 className="text-xl font-bold text-gray-800 mb-4">📋 Booking Summary</h2>
              
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Package:</span>
                  <span className="font-semibold text-gray-800">{packageData.title}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Duration:</span>
                  <span className="font-semibold text-gray-800">{packageData.duration}</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-600">Tour Type:</span>
                  <span className={`font-semibold ${isGroupTour ? 'text-purple-600' : 'text-green-600'}`}>
                    {isGroupTour ? '👥 Group Tour' : '🧳 Individual Tour'}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Persons:</span>
                  <span className="font-semibold text-gray-800">{bookingData.persons}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Travel Date:</span>
                  <span className="font-semibold text-gray-800">
                    {new Date(bookingData.travel_date).toLocaleDateString()}
                  </span>
                </div>
                
                <hr className="my-3" />
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Price per person:</span>
                  <span className="font-semibold">৳{Number(packageData.price).toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between text-lg font-bold text-gray-800">
                  <span>Total Amount:</span>
                  <span>৳{totalAmount.toLocaleString()}</span>
                </div>

                {isGroupTour && (
                  <>
                    <hr className="my-3" />
                    <div className="bg-purple-50 p-3 rounded-lg space-y-2">
                      <div className="flex justify-between text-purple-700">
                        <span className="font-semibold">Pay Now ({advancePercentage}%):</span>
                        <span className="font-bold">৳{advanceAmount.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-xs">
                        <span>Balance Due:</span>
                        <span>৳{balanceAmount.toLocaleString()}</span>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 italic">
                      💡 Pay advance now, balance before tour starts
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* Payment Form */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-2">💳 Payment</h2>
              <p className="text-gray-600 mb-6">Select your preferred payment method</p>

              <form onSubmit={handlePayment} className="space-y-6">
                
                {/* Payment Methods */}
                <div className="space-y-4">
                  
                  {/* bKash */}
                  <label className={`
                    flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition
                    ${paymentMethod === 'bkash' ? 'border-pink-500 bg-pink-50' : 'border-gray-300 hover:border-pink-300'}
                  `}>
                    <input
                      type="radio"
                      name="payment"
                      value="bkash"
                      checked={paymentMethod === 'bkash'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-pink-600"
                    />
                    <FaMobileAlt className="text-3xl text-pink-600" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">bKash</p>
                      <p className="text-sm text-gray-600">Pay via bKash mobile wallet</p>
                    </div>
                  </label>

                  {/* Nagad */}
                  <label className={`
                    flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition
                    ${paymentMethod === 'nagad' ? 'border-orange-500 bg-orange-50' : 'border-gray-300 hover:border-orange-300'}
                  `}>
                    <input
                      type="radio"
                      name="payment"
                      value="nagad"
                      checked={paymentMethod === 'nagad'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-orange-600"
                    />
                    <FaMobileAlt className="text-3xl text-orange-600" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">Nagad</p>
                      <p className="text-sm text-gray-600">Pay via Nagad mobile wallet</p>
                    </div>
                  </label>

                  {/* Credit/Debit Card */}
                  <label className={`
                    flex items-center gap-4 p-4 border-2 rounded-xl cursor-pointer transition
                    ${paymentMethod === 'card' ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-300'}
                  `}>
                    <input
                      type="radio"
                      name="payment"
                      value="card"
                      checked={paymentMethod === 'card'}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                      className="w-5 h-5 text-blue-600"
                    />
                    <FaCreditCard className="text-3xl text-blue-600" />
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">Credit/Debit Card</p>
                      <p className="text-sm text-gray-600">Pay with Visa, Mastercard, or AMEX</p>
                    </div>
                  </label>

                </div>

                {/* Payment Button */}
                <button
                  type="submit"
                  disabled={isProcessing || !paymentMethod}
                  className="w-full py-4 bg-gradient-to-r from-green-600 to-green-700 text-white text-lg font-bold rounded-lg hover:from-green-700 hover:to-green-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {isProcessing ? (
                    <>Processing...</>
                  ) : (
                    <>
                      <FaCheckCircle />
                      {isGroupTour 
                        ? `Pay Advance ৳${advanceAmount.toLocaleString()}`
                        : `Pay ৳${totalAmount.toLocaleString()}`
                      }
                    </>
                  )}
                </button>
              </form>

              {/* Security Notice */}
              <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-sm text-green-800">
                  🔒 <span className="font-semibold">Secure Payment:</span> Your payment information is encrypted and secure.
                </p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}