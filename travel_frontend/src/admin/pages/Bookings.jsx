import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../../redux/slices/bookingSlice";
import { 
  FaCalendar, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaEye, 
  FaCheck, 
  FaTimes, 
  FaTrash, 
  FaSpinner,
  FaClock,
  FaMapMarkerAlt,
  FaMoneyBillWave
} from "react-icons/fa";

export default function Bookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [updateLoading, setUpdateLoading] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleStatusChange = async (bookingId, newStatus) => {
    if (!confirm(`⚠️ Are you sure you want to ${newStatus} this booking?`)) return;

    setUpdateLoading(bookingId);
    try {
      await dispatch(updateBookingStatus({ id: bookingId, status: newStatus })).unwrap();
      alert(`✅ Booking ${newStatus} successfully!`);
      dispatch(fetchAllBookings());
    } catch (error) {
      alert("❌ Failed to update status: " + error);
    } finally {
      setUpdateLoading(null);
    }
  };

  const handleDelete = async (bookingId) => {
    if (!confirm("⚠️ Are you sure you want to delete this booking? This action cannot be undone.")) return;

    setDeleteLoading(bookingId);
    try {
      await dispatch(deleteBooking(bookingId)).unwrap();
      alert("✅ Booking deleted successfully!");
      dispatch(fetchAllBookings());
    } catch (error) {
      alert("❌ Failed to delete booking: " + error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleMarkAsPaid = async (bookingId) => {
    if (!confirm("✅ Mark this booking as fully paid? This will set paid_amount to total_price.")) return;

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8000/api/admin/bookings/${bookingId}/mark-paid`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        alert("✅ Booking marked as fully paid!");
        dispatch(fetchAllBookings());
      } else {
        alert("❌ Failed to mark as paid");
      }
    } catch (error) {
      alert("❌ Error: " + error.message);
    }
  };

  const handleView = (booking) => {
    setViewData(booking);
    setShowViewModal(true);
  };

  const filtered = bookings.filter((b) => {
    const matchesSearch = 
      b.name?.toLowerCase().includes(search.toLowerCase()) ||
      b.email?.toLowerCase().includes(search.toLowerCase()) ||
      b.phone?.toLowerCase().includes(search.toLowerCase()) ||
      b.package?.title?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const pendingCount = bookings.filter(b => b.status === "pending").length;
  const confirmedCount = bookings.filter(b => b.status === "confirmed").length;
  const cancelledCount = bookings.filter(b => b.status === "cancelled").length;
  const paidCount = bookings.filter(b => b.payment_status === "paid" || b.payment_status === "completed").length;
  const totalRevenue = bookings
    .filter(b => b.payment_status === "paid" || b.payment_status === "completed")
    .reduce((sum, b) => sum + (parseFloat(b.total_price) || 0), 0);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
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
      day: 'numeric' 
    });
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎫 Bookings Management</h2>
        <p className="text-gray-600">Manage all customer bookings and reservations</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">Total Bookings</p>
          <p className="text-3xl font-bold">{bookings.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">⏳ Pending</p>
          <p className="text-3xl font-bold">{pendingCount}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">✅ Confirmed</p>
          <p className="text-3xl font-bold">{confirmedCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">💳 Paid</p>
          <p className="text-3xl font-bold">{paidCount}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">💰 Revenue</p>
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
              placeholder="🔍 Search by name, email, phone, or package..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter by Status */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none"
            >
              <option value="all">All Status</option>
              <option value="pending">⏳ Pending</option>
              <option value="confirmed">✅ Confirmed</option>
              <option value="cancelled">❌ Cancelled</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && bookings.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading bookings...</p>
          </div>
        </div>
      )}

      {/* Bookings Table */}
      {!loading || bookings.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Booking ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Travel Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Persons</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Total Price</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Payment Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((booking) => (
                  <tr key={booking.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4 text-sm font-semibold text-gray-800">
                      #{booking.id}
                    </td>
                    <td className="px-6 py-4">
                      <div>
                        <p className="font-semibold text-gray-800">{booking.name}</p>
                        <p className="text-xs text-gray-500">{booking.email}</p>
                        <p className="text-xs text-gray-500">{booking.phone}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-gray-800">
                        {booking.package?.title || "Package Deleted"}
                      </p>
                      <p className="text-xs text-gray-500">
                        ৳{booking.package?.price ? Number(booking.package.price).toLocaleString() : 'N/A'}
                      </p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {formatDate(booking.travel_date)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <div className="flex items-center gap-1">
                        <FaUsers className="text-blue-500" />
                        <span className="font-semibold">{booking.persons}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                      ৳{booking.total_price ? Number(booking.total_price).toLocaleString() : 'N/A'}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        booking.payment_status === 'paid' || booking.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.payment_status === 'partially_paid' ? 'bg-blue-100 text-blue-700' :
                        booking.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {booking.payment_status === 'paid' || booking.payment_status === 'completed' ? '✅ Paid' : 
                         booking.payment_status === 'partially_paid' ? '💰 Partially Paid' :
                         booking.payment_status === 'pending' ? '⏳ Pending' : 
                         '❌ Failed'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${getStatusColor(booking.status)}`}>
                        {booking.status === 'pending' ? '⏳' : booking.status === 'confirmed' ? '✅' : '❌'} {capitalize(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleView(booking)}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="View Details"
                        >
                          <FaEye size={16} />
                        </button>
                        
                        {booking.status === "pending" && (
                          <>
                            <button
                              onClick={() => handleStatusChange(booking.id, "confirmed")}
                              disabled={updateLoading === booking.id}
                              className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition disabled:opacity-50"
                              title="Confirm Booking"
                            >
                              {updateLoading === booking.id ? (
                                <FaSpinner className="animate-spin" size={16} />
                              ) : (
                                <FaCheck size={16} />
                              )}
                            </button>
                            <button
                              onClick={() => handleStatusChange(booking.id, "cancelled")}
                              disabled={updateLoading === booking.id}
                              className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                              title="Cancel Booking"
                            >
                              <FaTimes size={16} />
                            </button>
                          </>
                        )}

                        {booking.status !== "pending" && (
                          <button
                            onClick={() => handleStatusChange(booking.id, "pending")}
                            disabled={updateLoading === booking.id}
                            className="p-2 text-yellow-600 hover:bg-yellow-100 rounded-lg transition disabled:opacity-50"
                            title="Set as Pending"
                          >
                            <FaClock size={16} />
                          </button>
                        )}

                        {booking.payment_status === 'partially_paid' && (
                          <button
                            onClick={() => handleMarkAsPaid(booking.id)}
                            className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                            title="Mark as Fully Paid"
                          >
                            <FaMoneyBillWave size={16} />
                          </button>
                        )}

                        <button
                          onClick={() => handleDelete(booking.id)}
                          disabled={deleteLoading === booking.id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                          title="Delete Booking"
                        >
                          {deleteLoading === booking.id ? (
                            <FaSpinner className="animate-spin" size={16} />
                          ) : (
                            <FaTrash size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="7" className="p-12 text-center">
                      <div className="text-gray-400">
                        <FaSearch className="text-5xl mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">No bookings found</p>
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

      {/* View Booking Modal */}
      {showViewModal && viewData && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            {/* Header with Package Image */}
            <div className="relative">
              <img 
                src={viewData.package?.image || "https://via.placeholder.com/800x300"} 
                alt={viewData.package?.title || "Booking"}
                className="w-full h-48 object-cover rounded-t-2xl"
              />
              <button 
                onClick={() => setShowViewModal(false)} 
                className="absolute top-4 right-4 bg-white text-gray-700 hover:bg-red-500 hover:text-white p-3 rounded-full transition shadow-lg"
              >
                <FaTimes size={20} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  viewData.status === 'pending' ? 'bg-yellow-500 text-white' :
                  viewData.status === 'confirmed' ? 'bg-green-500 text-white' :
                  'bg-red-500 text-white'
                }`}>
                  {viewData.status === 'pending' ? '⏳' : viewData.status === 'confirmed' ? '✅' : '❌'} {capitalize(viewData.status)}
                </span>
              </div>
            </div>

            <div className="p-8">
              {/* Booking Info Header */}
              <div className="flex justify-between items-start mb-6 border-b pb-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-1">Booking #{viewData.id}</h2>
                  <p className="text-gray-600">Booked on {formatDate(viewData.created_at)}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Total Amount</p>
                  <p className="text-2xl font-bold text-blue-600">
                    ৳{viewData.total_price ? Number(viewData.total_price).toLocaleString() : 'N/A'}
                  </p>
                  {viewData.payment_status === 'partially_paid' && (
                    <div className="mt-3">
                      <p className="text-sm text-gray-600 mb-1">Paid: <span className="text-green-600 font-bold">৳{viewData.paid_amount ? Number(viewData.paid_amount).toLocaleString() : '0'}</span></p>
                      <p className="text-sm text-gray-600">Due: <span className="text-orange-600 font-bold">৳{((viewData.total_price || 0) - (viewData.paid_amount || 0)).toLocaleString()}</span></p>
                    </div>
                  )}
                </div>
              </div>

              {/* Package Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMapMarkerAlt className="text-blue-500" /> Package Details
                </h3>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="font-semibold text-gray-800 text-lg mb-2">
                    {viewData.package?.title || "Package Deleted"}
                  </p>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <span className="text-gray-600">Duration:</span>
                      <span className="ml-2 font-semibold">{viewData.package?.duration || 'N/A'}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Price per person:</span>
                      <span className="ml-2 font-semibold">৳{viewData.package?.price ? Number(viewData.package.price).toLocaleString() : 'N/A'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Customer Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="text-green-500" /> Customer Information
                </h3>
                <div className="bg-green-50 p-4 rounded-lg space-y-2">
                  <div className="flex items-center gap-3">
                    <FaUser className="text-green-600" />
                    <span className="font-semibold">{viewData.name}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaEnvelope className="text-green-600" />
                    <span>{viewData.email}</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <FaPhone className="text-green-600" />
                    <span>{viewData.phone}</span>
                  </div>
                </div>
              </div>

              {/* Travel Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaCalendar className="text-purple-500" /> Travel Details
                </h3>
                <div className="bg-purple-50 p-4 rounded-lg grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-600">Travel Date</p>
                    <p className="font-semibold text-gray-800">{formatDate(viewData.travel_date)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Number of Persons</p>
                    <p className="font-semibold text-gray-800">{viewData.persons} person(s)</p>
                  </div>
                </div>
              </div>

              {/* Payment Details */}
              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaMoneyBillWave className="text-green-500" /> Payment Information
                </h3>
                <div className="bg-yellow-50 p-4 rounded-lg">
                  <div className="grid grid-cols-2 gap-4 mb-3">
                    <div>
                      <p className="text-sm text-gray-600">Total Amount</p>
                      <p className="font-bold text-blue-600 text-xl">
                        ৳{viewData.total_price ? Number(viewData.total_price).toLocaleString() : 'N/A'}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Payment Status</p>
                      <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                        viewData.payment_status === 'paid' || viewData.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                        viewData.payment_status === 'partially_paid' ? 'bg-blue-100 text-blue-700' :
                        viewData.payment_status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {viewData.payment_status === 'paid' || viewData.payment_status === 'completed' ? '✅ Paid' : 
                         viewData.payment_status === 'partially_paid' ? '💰 Partially Paid' :
                         viewData.payment_status === 'pending' ? '⏳ Pending' : 
                         '❌ Failed'}
                      </span>
                      {viewData.payment_status === 'partially_paid' && (
                        <div className="mt-3 space-y-1">
                          <p className="text-sm">
                            <span className="text-gray-600">Paid:</span> 
                            <span className="text-green-600 font-bold ml-2">৳{viewData.paid_amount ? Number(viewData.paid_amount).toLocaleString() : '0'}</span>
                          </p>
                          <p className="text-sm">
                            <span className="text-gray-600">Due:</span> 
                            <span className="text-orange-600 font-bold ml-2">৳{((viewData.total_price || 0) - (viewData.paid_amount || 0)).toLocaleString()}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  {viewData.payment_method && (
                    <div>
                      <p className="text-sm text-gray-600">Payment Method</p>
                      <p className="font-semibold text-gray-800">{viewData.payment_method.toUpperCase()}</p>
                    </div>
                  )}
                  {viewData.transaction_id && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">Transaction ID</p>
                      <p className="font-mono text-sm text-gray-800 bg-white px-2 py-1 rounded">
                        {viewData.transaction_id}
                      </p>
                    </div>
                  )}
                </div>
              </div>

              {/* Special Request */}
              {viewData.special_request && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">💬 Special Request</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{viewData.special_request}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-3 justify-end">
                {viewData.payment_status === 'partially_paid' && (
                  <button 
                    onClick={() => {
                      handleMarkAsPaid(viewData.id);
                      setShowViewModal(false);
                    }} 
                    className="px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg hover:from-green-700 hover:to-green-800 transition font-semibold flex items-center gap-2"
                  >
                    <FaMoneyBillWave /> Mark as Fully Paid
                  </button>
                )}
                {viewData.status === "pending" && (
                  <>
                    <button 
                      onClick={() => {
                        handleStatusChange(viewData.id, "confirmed");
                        setShowViewModal(false);
                      }} 
                      className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition font-semibold"
                    >
                      ✅ Confirm Booking
                    </button>
                    <button 
                      onClick={() => {
                        handleStatusChange(viewData.id, "cancelled");
                        setShowViewModal(false);
                      }} 
                      className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition font-semibold"
                    >
                      ❌ Cancel Booking
                    </button>
                  </>
                )}
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="px-6 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition font-semibold"
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