import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllBookings } from "../../redux/slices/bookingSlice";
import { 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaSpinner,
  FaMoneyBillWave,
  FaCalendar,
  FaUser,
  FaCreditCard,
  FaTimes
} from "react-icons/fa";

export default function Payments() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  const [search, setSearch] = useState("");
  const [paymentFilter, setPaymentFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleView = (booking) => {
    setViewData(booking);
    setShowViewModal(true);
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch = 
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.transaction_id?.toLowerCase().includes(search.toLowerCase()) ||
      b.package?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesPayment = paymentFilter === "all" || b.payment_status === paymentFilter;
    return matchesSearch && matchesPayment;
  });

  // Calculate stats
  const totalPayments = bookings.filter(b => b.payment_status === "completed").length;
  const pendingPayments = bookings.filter(b => b.payment_status === "pending").length;
  const failedPayments = bookings.filter(b => b.payment_status === "failed").length;
  const totalRevenue = bookings
    .filter(b => b.payment_status === "completed")
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "failed":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">💳 Payment Management</h2>
        <p className="text-gray-600">Track all payment transactions and revenue</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">✅ Completed</p>
          <p className="text-3xl font-bold">{totalPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">⏳ Pending</p>
          <p className="text-3xl font-bold">{pendingPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">❌ Failed</p>
          <p className="text-3xl font-bold">{failedPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">💰 Total Revenue</p>
          <p className="text-2xl font-bold">৳{totalRevenue.toLocaleString()}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search by name, email, transaction ID, or package..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter by Payment Status */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={paymentFilter}
              onChange={(e) => setPaymentFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none"
            >
              <option value="all">All Payments</option>
              <option value="completed">✅ Completed</option>
              <option value="pending">⏳ Pending</option>
              <option value="failed">❌ Failed</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && bookings.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading payments...</p>
          </div>
        </div>
      )}

      {/* Payments Table */}
      {!loading || bookings.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Amount</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Payment Method</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((payment) => (
                  <tr key={payment.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-sm font-mono text-gray-700">
                      {payment.transaction_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{payment.name}</p>
                        <p className="text-xs text-gray-500">{payment.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {payment.package?.title || "Package Deleted"}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                      ৳{payment.total_price ? Number(payment.total_price).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <span className="px-2 py-1 bg-gray-100 rounded text-xs font-semibold">
                        {payment.payment_method?.toUpperCase() || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getPaymentStatusColor(payment.payment_status)}`}>
                        {payment.payment_status === 'completed' ? '✅' : payment.payment_status === 'pending' ? '⏳' : '❌'} 
                        {capitalize(payment.payment_status || 'pending')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(payment.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleView(payment)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="8" className="p-12 text-center">
                      <div className="text-gray-400">
                        <FaSearch className="text-5xl mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">No payments found</p>
                        <p className="text-sm mt-2">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* View Payment Modal */}
      {showViewModal && viewData && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
              <div>
                <h2 className="text-2xl font-bold">💳 Payment Details</h2>
                <p className="text-sm text-white/80">Transaction #{viewData.transaction_id || viewData.id}</p>
              </div>
              <button 
                onClick={() => setShowViewModal(false)} 
                className="text-white hover:bg-white/20 p-2 rounded-full transition"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6">
              {/* Payment Status */}
              <div className="text-center mb-6">
                <span className={`inline-block px-6 py-3 rounded-full text-lg font-bold ${getPaymentStatusColor(viewData.payment_status)}`}>
                  {viewData.payment_status === 'completed' ? '✅' : viewData.payment_status === 'pending' ? '⏳' : '❌'} 
                  {capitalize(viewData.payment_status || 'pending')}
                </span>
              </div>

              {/* Transaction Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaCreditCard className="text-green-500" /> Transaction Information
                </h3>
                <div className="bg-green-50 p-4 rounded-lg space-y-3">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction ID:</span>
                    <span className="font-mono font-semibold text-gray-800">{viewData.transaction_id || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Payment Method:</span>
                    <span className="font-semibold text-gray-800">{viewData.payment_method?.toUpperCase() || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Amount:</span>
                    <span className="font-bold text-green-600 text-xl">৳{viewData.total_price ? Number(viewData.total_price).toLocaleString() : 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Date & Time:</span>
                    <span className="font-semibold text-gray-800">{formatDate(viewData.created_at)}</span>
                  </div>
                </div>
              </div>

              {/* Customer Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="text-blue-500" /> Customer Details
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">Name:</span>
                    <p className="font-semibold text-gray-800">{viewData.name}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Email:</span>
                    <p className="font-semibold text-gray-800">{viewData.email}</p>
                  </div>
                  <div>
                    <span className="text-gray-600 text-sm">Phone:</span>
                    <p className="font-semibold text-gray-800">{viewData.phone}</p>
                  </div>
                </div>
              </div>

              {/* Package Info */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-purple-500" /> Package Details
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg space-y-2">
                  <div>
                    <span className="text-gray-600 text-sm">Package:</span>
                    <p className="font-semibold text-gray-800">{viewData.package?.title || "Package Deleted"}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-gray-600 text-sm">Persons:</span>
                      <p className="font-semibold text-gray-800">{viewData.persons}</p>
                    </div>
                    <div>
                      <span className="text-gray-600 text-sm">Travel Date:</span>
                      <p className="font-semibold text-gray-800">{formatDate(viewData.travel_date)}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Close Button */}
              <div className="flex justify-end">
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
