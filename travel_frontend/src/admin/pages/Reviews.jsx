import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllReviews, fetchPendingReviews, approveReview, adminDeleteReview } from "../../redux/slices/reviewSlice";
import { FaStar, FaCheck, FaTrash, FaEye, FaTimes, FaClock } from "react-icons/fa";

export default function Reviews() {
  const dispatch = useDispatch();
  const { allReviews, pendingReviews, loading } = useSelector((state) => state.reviews);
  
  const [activeTab, setActiveTab] = useState("pending"); // pending, all
  const [viewModal, setViewModal] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    dispatch(fetchPendingReviews());
    dispatch(fetchAllReviews());
  }, [dispatch]);

  const handleApprove = async (id) => {
    if (window.confirm("Approve this review?")) {
      await dispatch(approveReview(id));
      alert("✅ Review approved!");
      dispatch(fetchPendingReviews());
      dispatch(fetchAllReviews());
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this review? This action cannot be undone.")) {
      await dispatch(adminDeleteReview(id));
      alert("✅ Review deleted!");
      dispatch(fetchPendingReviews());
      dispatch(fetchAllReviews());
    }
  };

  const handleView = (review) => {
    setSelectedReview(review);
    setViewModal(true);
  };

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            size={16}
          />
        ))}
      </div>
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const reviews = activeTab === "pending" ? pendingReviews : allReviews;

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-2">⭐ Reviews Management</h1>
        <p className="text-gray-600">Approve or delete customer reviews</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">⏳ Pending Reviews</p>
          <p className="text-3xl font-bold">{pendingReviews.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">✅ Approved Reviews</p>
          <p className="text-3xl font-bold">{allReviews.filter(r => r.is_approved).length}</p>
        </div>
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">📊 Total Reviews</p>
          <p className="text-3xl font-bold">{allReviews.length}</p>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-md mb-6">
        <div className="flex border-b">
          <button
            onClick={() => setActiveTab("pending")}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === "pending"
                ? "text-yellow-600 border-b-2 border-yellow-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaClock className="inline mr-2" />
            Pending ({pendingReviews.length})
          </button>
          <button
            onClick={() => setActiveTab("all")}
            className={`flex-1 py-4 px-6 font-semibold transition ${
              activeTab === "all"
                ? "text-blue-600 border-b-2 border-blue-600"
                : "text-gray-600 hover:text-gray-800"
            }`}
          >
            <FaStar className="inline mr-2" />
            All Reviews ({allReviews.length})
          </button>
        </div>
      </div>

      {/* Reviews Table */}
      {loading ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <p className="text-gray-500">Loading reviews...</p>
        </div>
      ) : reviews.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-xl shadow-md">
          <FaStar className="text-6xl text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg">No reviews to show</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Package</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Comment</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                  <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-center text-sm font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviews.map((review) => (
                  <tr key={review.id} className="border-b hover:bg-gray-50 transition">
                    <td className="px-6 py-4 text-sm text-gray-700">#{review.id}</td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {review.user?.name || "Unknown"}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {review.package?.title || "N/A"}
                    </td>
                    <td className="px-6 py-4">
                      {renderStars(review.rating)}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700 max-w-xs truncate">
                      {review.comment}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 whitespace-nowrap">
                      {formatDate(review.created_at)}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        review.is_approved
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                      }`}>
                        {review.is_approved ? "✅ Approved" : "⏳ Pending"}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleView(review)}
                          className="p-2 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition"
                          title="View"
                        >
                          <FaEye />
                        </button>
                        {!review.is_approved && (
                          <button
                            onClick={() => handleApprove(review.id)}
                            className="p-2 bg-green-100 text-green-600 rounded-lg hover:bg-green-200 transition"
                            title="Approve"
                          >
                            <FaCheck />
                          </button>
                        )}
                        <button
                          onClick={() => handleDelete(review.id)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition"
                          title="Delete"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* View Modal */}
      {viewModal && selectedReview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-8 relative">
            <button
              onClick={() => setViewModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
            >
              <FaTimes size={24} />
            </button>

            <h2 className="text-2xl font-bold text-gray-800 mb-6">Review Details</h2>

            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Customer</p>
                  <p className="text-lg font-semibold">{selectedReview.user?.name || "Unknown"}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Rating</p>
                  {renderStars(selectedReview.rating)}
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Package</p>
                <p className="text-lg font-semibold">{selectedReview.package?.title || "N/A"}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Comment</p>
                <div className="bg-gray-50 p-4 rounded-lg">
                  <p className="text-gray-700">{selectedReview.comment}</p>
                </div>
              </div>

              <div className="flex items-center justify-between text-sm text-gray-600">
                <div>
                  <p>Submitted: {formatDate(selectedReview.created_at)}</p>
                </div>
                <div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    selectedReview.is_approved
                      ? "bg-green-100 text-green-700"
                      : "bg-yellow-100 text-yellow-700"
                  }`}>
                    {selectedReview.is_approved ? "✅ Approved" : "⏳ Pending"}
                  </span>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                {!selectedReview.is_approved && (
                  <button
                    onClick={() => {
                      handleApprove(selectedReview.id);
                      setViewModal(false);
                    }}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg hover:bg-green-700 transition font-semibold"
                  >
                    <FaCheck className="inline mr-2" /> Approve Review
                  </button>
                )}
                <button
                  onClick={() => {
                    handleDelete(selectedReview.id);
                    setViewModal(false);
                  }}
                  className="flex-1 bg-red-600 text-white py-3 rounded-lg hover:bg-red-700 transition font-semibold"
                >
                  <FaTrash className="inline mr-2" /> Delete Review
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
