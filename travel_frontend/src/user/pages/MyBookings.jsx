import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchMyBookings } from "../../redux/slices/bookingSlice";
import { fetchMyReviews } from "../../redux/slices/reviewSlice";
import ReviewModal from "../../components/ReviewModal";
import { 
  FaCalendar, 
  FaUser, 
  FaPhone, 
  FaEnvelope, 
  FaUsers, 
  FaSearch, 
  FaFilter, 
  FaEye,
  FaMapMarkerAlt,
  FaMoneyBillWave,
  FaTimes,
  FaStar
} from "react-icons/fa";

export default function MyBookings() {
  const dispatch = useDispatch();
  const { myBookings, loading } = useSelector((state) => state.bookings);
  const { myReviews } = useSelector((state) => state.reviews);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewData, setViewData] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    dispatch(fetchMyBookings());
    dispatch(fetchMyReviews());
  }, [dispatch]);

  const handleView = (booking) => {
    setViewData(booking);
    setShowViewModal(true);
  };

  const handleGiveReview = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const canReview = (booking) => {
    // Can review if: payment is paid/completed, tour has ended, and not already reviewed
    if (booking.payment_status !== 'paid' && booking.payment_status !== 'completed') return false;
    
    const travelDate = new Date(booking.travel_date);
    const today = new Date();
    
    // Extract duration days (e.g., "3 DAY" -> 3)
    const durationMatch = booking.package?.duration?.match(/(\d+)/);
    const durationDays = durationMatch ? parseInt(durationMatch[1]) : 0;
    
    // Calculate tour end date
    const tourEndDate = new Date(travelDate);
    tourEndDate.setDate(tourEndDate.getDate() + durationDays);
    
    // Tour must be completed
    if (tourEndDate > today) return false;

    const hasReviewed = myReviews.some(review => review.booking_id === booking.id);
    return !hasReviewed;
  };

  const hasReview = (booking) => {
    return myReviews.some(review => review.booking_id === booking.id);
  };

  const filtered = myBookings.filter((b) => {
    const matchesSearch = 
      b.package?.title?.toLowerCase().includes(search.toLowerCase()) ||
      b.travel_date?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700 border-yellow-300";
      case "confirmed":
        return "bg-green-100 text-green-700 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-700 border-red-300";
      default:
        return "bg-gray-100 text-gray-700 border-gray-300";
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
        <h2 className="text-3xl font-bold text-gray-800 mb-2">🎫 My Bookings</h2>
        <p className="text-gray-600">View and manage your travel bookings</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">Total Bookings</p>
          <p className="text-3xl font-bold">{myBookings.length}</p>
        </div>
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">⏳ Pending</p>
          <p className="text-3xl font-bold">{myBookings.filter(b => b.status === "pending").length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">✅ Confirmed</p>
          <p className="text-3xl font-bold">{myBookings.filter(b => b.status === "confirmed").length}</p>
        </div>
        <div className="bg-gradient-to-br from-red-500 to-red-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">❌ Cancelled</p>
          <p className="text-3xl font-bold">{myBookings.filter(b => b.status === "cancelled").length}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search by package name or travel date..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

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

      {/* Bookings Grid */}
      {loading ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-lg">Loading your bookings...</p>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <FaSearch className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No bookings found</p>
          <p className="text-gray-400 text-sm">Try adjusting your search or filter</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((booking) => (
            <div key={booking.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <div className="relative">
                <img 
                  src={booking.package?.image || "https://via.placeholder.com/400x200"} 
                  alt={booking.package?.title}
                  className="w-full h-48 object-cover"
                />
                <span className={`absolute top-3 right-3 px-3 py-1 rounded-full text-xs font-bold border-2 ${getStatusColor(booking.status)}`}>
                  {booking.status === 'pending' ? '⏳' : booking.status === 'confirmed' ? '✅' : '❌'} {capitalize(booking.status)}
                </span>
              </div>

              <div className="p-5">
                <h3 className="text-xl font-bold text-gray-800 mb-3">
                  {booking.package?.title || "Package Deleted"}
                </h3>

                <div className="space-y-2 text-sm text-gray-700 mb-4">
                  <div className="flex items-center gap-2">
                    <FaCalendar className="text-blue-600" />
                    <span><strong>Travel Date:</strong> {formatDate(booking.travel_date)}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaUsers className="text-blue-600" />
                    <span><strong>Persons:</strong> {booking.persons}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <FaMoneyBillWave className="text-blue-600" />
                    <span><strong>Total:</strong> ৳{booking.total_price ? Number(booking.total_price).toLocaleString() : 'N/A'}</span>
                  </div>
                  {booking.payment_status === 'partially_paid' && (
                    <div className="flex items-center gap-2">
                      <FaMoneyBillWave className="text-orange-600" />
                      <span><strong>Due:</strong> <span className="text-orange-600 font-bold">৳{((booking.total_price || 0) - (booking.paid_amount || 0)).toLocaleString()}</span></span>
                    </div>
                  )}
                </div>

                <div className="space-y-2">
                  <button
                    onClick={() => handleView(booking)}
                    className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition flex items-center justify-center gap-2"
                  >
                    <FaEye /> View Details
                  </button>
                  
                  {canReview(booking) && (
                    <button
                      onClick={() => handleGiveReview(booking)}
                      className="w-full px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition flex items-center justify-center gap-2"
                    >
                      <FaStar /> Give Review
                    </button>
                  )}
                  
                  {hasReview(booking) && (
                    <div className="flex items-center justify-center gap-2 text-green-600 text-sm font-semibold">
                      <FaStar /> Already Reviewed
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* View Modal */}
      {showViewModal && viewData && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
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
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg border-2 ${
                  viewData.status === 'pending' ? 'bg-yellow-500 text-white border-yellow-300' :
                  viewData.status === 'confirmed' ? 'bg-green-500 text-white border-green-300' :
                  'bg-red-500 text-white border-red-300'
                }`}>
                  {viewData.status === 'pending' ? '⏳' : viewData.status === 'confirmed' ? '✅' : '❌'} {capitalize(viewData.status)}
                </span>
              </div>
            </div>

            <div className="p-8">
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

              <div className="mb-6">
                <h3 className="text-lg font-bold text-gray-800 mb-3 flex items-center gap-2">
                  <FaUser className="text-green-500" /> Your Information
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

              {viewData.special_request && (
                <div className="mb-6">
                  <h3 className="text-lg font-bold text-gray-800 mb-3">💬 Special Request</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-gray-700">{viewData.special_request}</p>
                  </div>
                </div>
              )}

              <div className="flex justify-end">
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

      {/* Review Modal */}
      <ReviewModal 
        isOpen={showReviewModal}
        onClose={() => {
          setShowReviewModal(false);
          setSelectedBooking(null);
          dispatch(fetchMyReviews()); // Refresh reviews after submission
        }}
        booking={selectedBooking}
      />
    </div>
  );
}