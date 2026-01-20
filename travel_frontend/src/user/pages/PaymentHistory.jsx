import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import axios from "axios";
import { FaCreditCard, FaCheckCircle, FaCalendar, FaReceipt } from "react-icons/fa";

const API_URL = "http://127.0.0.1:8000/api";

export default function PaymentHistory() {
  const { token } = useSelector((state) => state.auth);
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const response = await axios.get(`${API_URL}/my-bookings`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Filter only paid bookings
      const paidBookings = response.data.filter(
        booking => booking.payment_status === 'paid' || booking.payment_status === 'partially_paid'
      );
      
      setPayments(paidBookings);
    } catch (error) {
      console.error("Failed to fetch payment history:", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 text-center">
        <p className="text-gray-500">Loading payment history...</p>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">💳 Payment History</h2>
        <p className="text-gray-600">View all your payment transactions</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">Total Payments</p>
          <p className="text-4xl font-bold">{payments.length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">Total Spent</p>
          <p className="text-4xl font-bold">৳{payments.reduce((sum, p) => sum + (Number(p.paid_amount) || 0), 0).toFixed(2)}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">Last Payment</p>
          <p className="text-4xl font-bold">৳{Number(payments[0]?.paid_amount || 0).toFixed(2)}</p>
        </div>
      </div>

      {/* Payment List */}
      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Transaction ID</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Package</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Amount</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Payment Method</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {payments.map((payment) => (
                <tr key={payment.id} className="hover:bg-blue-50 transition">
                  <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                    {payment.transaction_id || `BK${payment.id.toString().padStart(6, '0')}`}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{payment.package?.title || 'Package'}</p>
                    <p className="text-xs text-gray-500">Booking #{payment.id}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    ৳{payment.paid_amount?.toLocaleString() || 0}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-blue-600" />
                      {payment.payment_method || 'N/A'}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(payment.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold flex items-center gap-1 w-fit ${
                      payment.payment_status === 'paid' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-yellow-100 text-yellow-700'
                    }`}>
                      <FaCheckCircle /> {payment.payment_status === 'paid' ? 'Completed' : 'Partially Paid'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}