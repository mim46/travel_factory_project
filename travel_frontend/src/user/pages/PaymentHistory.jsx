import { FaCreditCard, FaCheckCircle, FaCalendar, FaReceipt } from "react-icons/fa";

export default function PaymentHistory() {
  // TODO: Fetch payment history from backend
  const payments = [
    {
      id: 1,
      bookingId: 5,
      packageName: "Cox's Bazar Beach Tour",
      amount: 15000,
      date: "2024-12-15",
      status: "completed",
      method: "bKash",
      transactionId: "TXN123456789"
    },
    {
      id: 2,
      bookingId: 3,
      packageName: "Sundarbans Adventure",
      amount: 18000,
      date: "2024-11-20",
      status: "completed",
      method: "Nagad",
      transactionId: "TXN987654321"
    },
  ];

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
          <p className="text-4xl font-bold">৳{payments.reduce((sum, p) => sum + p.amount, 0).toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">Last Payment</p>
          <p className="text-4xl font-bold">৳{payments[0]?.amount.toLocaleString() || 0}</p>
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
                    {payment.transactionId}
                  </td>
                  <td className="px-6 py-4">
                    <p className="font-medium text-gray-800">{payment.packageName}</p>
                    <p className="text-xs text-gray-500">Booking #{payment.bookingId}</p>
                  </td>
                  <td className="px-6 py-4 text-sm font-bold text-gray-800">
                    ৳{payment.amount.toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    <div className="flex items-center gap-2">
                      <FaCreditCard className="text-blue-600" />
                      {payment.method}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-700">
                    {new Date(payment.date).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1 w-fit">
                      <FaCheckCircle /> Completed
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