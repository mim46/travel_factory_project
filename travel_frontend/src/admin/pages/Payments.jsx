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
  const [viewMode, setViewMode] = useState("latest"); // latest, all
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
  }).sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Get Latest 5
  const latestPayments = [...bookings].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5);

  // Determine what to display
  const displayPayments = search || paymentFilter !== "all" || viewMode === "all" ? filtered : latestPayments;

  // Calculate stats
  const totalPayments = bookings.filter(b => b.payment_status === "completed" || b.payment_status === "paid").length;
  const pendingPayments = bookings.filter(b => b.payment_status === "pending").length;
  const failedPayments = bookings.filter(b => b.payment_status === "failed").length;
  const totalRevenue = bookings
    .filter(b => b.payment_status === "completed" || b.payment_status === "paid")
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  const getPaymentStatusColor = (status) => {
    switch (status) {
      case "completed":
      case "paid":
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
    <div>
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-[#1C7DA2] mb-2">Payment Management</h2>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div
          onClick={() => setPaymentFilter("all")}
          className={`bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white cursor-pointer hover:shadow-xl transition transform hover:scale-105 ${paymentFilter === "all" ? "ring-4 ring-blue-300" : ""}`}
        >
          <p className="text-white/90 text-base font-semibold mb-1">Total Transactions</p>
          <p className="text-2xl font-extrabold">{bookings.length}</p>
        </div>
        <div
          onClick={() => setPaymentFilter("completed")}
          className={`bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white cursor-pointer hover:shadow-xl transition transform hover:scale-105 ${paymentFilter === "completed" ? "ring-4 ring-green-300" : ""}`}
        >
          <p className="text-white/90 text-base font-semibold mb-1">✅ Completed</p>
          <p className="text-2xl font-extrabold">{totalPayments}</p>
        </div>
        <div
          onClick={() => setPaymentFilter("pending")}
          className={`bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-xl shadow-lg text-white cursor-pointer hover:shadow-xl transition transform hover:scale-105 ${paymentFilter === "pending" ? "ring-4 ring-yellow-300" : ""}`}
        >
          <p className="text-white/90 text-base font-semibold mb-1">⏳ Pending</p>
          <p className="text-2xl font-extrabold">{pendingPayments}</p>
        </div>
        <div
          onClick={() => setPaymentFilter("failed")}
          className={`bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl shadow-lg text-white cursor-pointer hover:shadow-xl transition transform hover:scale-105 ${paymentFilter === "failed" ? "ring-4 ring-red-300" : ""}`}
        >
          <p className="text-white/90 text-base font-semibold mb-1">❌ Failed</p>
          <p className="text-2xl font-extrabold">{failedPayments}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/90 text-base font-semibold mb-1">💰 Total Revenue</p>
          <p className="text-xl font-extrabold">৳{totalRevenue.toLocaleString()}</p>
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
              placeholder="Search by name, email, transaction ID, or package..."
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
              onChange={(e) => {
                setPaymentFilter(e.target.value);
                if (e.target.value !== "all") setViewMode("all");
              }}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none"
            >
              <option value="all">Status: All</option>
              <option value="completed">Status: Completed</option>
              <option value="pending">Status: Pending</option>
              <option value="failed">Status: Failed</option>
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
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 bg-gray-50 border-b">
            <h3 className="text-lg font-semibold text-gray-800">
              {search ? "Search Results" :
                paymentFilter !== "all" ? `Filtered Payments (${capitalize(paymentFilter)})` :
                  viewMode === "latest" ? "Latest 5 Payments" : "All Payments"}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Transaction ID</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Customer</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Package</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Amount</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Method</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                  <th className="px-6 py-4 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {displayPayments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-xs font-mono text-gray-600">
                      {payment.transaction_id || 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="h-8 w-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white text-xs font-bold">
                          {payment.name?.charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">{payment.name}</p>
                          <p className="text-[10px] text-gray-500">{payment.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-3 text-sm text-gray-800">
                      {payment.package?.title || "N/A"}
                    </td>
                    <td className="px-6 py-3 text-sm font-bold text-blue-600">
                      ৳{payment.total_price ? Number(payment.total_price).toLocaleString() : '0'}
                    </td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-0.5 bg-gray-100 rounded text-[10px] font-bold text-gray-600 uppercase">
                        {payment.payment_method || 'N/A'}
                      </span>
                    </td>
                    <td className="px-6 py-3">
                      <span className={`text-xs font-bold ${getPaymentStatusColor(payment.payment_status).replace('bg-', 'text-').replace('-100', '')}`}>
                        {capitalize(payment.payment_status || 'pending')}
                      </span>
                    </td>
                    <td className="px-6 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {formatDate(payment.created_at).split(',')[0]}
                    </td>
                    <td className="px-6 py-3 text-center">
                      <button
                        onClick={() => handleView(payment)}
                        className="bg-blue-600 hover:bg-blue-700 text-white w-16 py-1.5 rounded-md text-[10px] font-bold transition shadow-sm"
                      >
                        Details
                      </button>
                    </td>
                  </tr>
                ))}
                {displayPayments.length === 0 && (
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
