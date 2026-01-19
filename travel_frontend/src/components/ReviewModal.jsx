import { useState } from "react";
import { FaStar, FaTimes } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { submitReview } from "../redux/slices/reviewSlice";

export default function ReviewModal({ isOpen, onClose, booking }) {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.reviews);
  
  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (rating === 0) {
      alert("Please select a rating");
      return;
    }

    if (comment.trim().length < 10) {
      alert("Please write at least 10 characters");
      return;
    }

    try {
      await dispatch(submitReview({
        package_id: booking.package_id,
        booking_id: booking.id,
        rating,
        comment
      })).unwrap();

      alert("✅ Review submitted successfully! It will be visible after admin approval.");
      setRating(0);
      setComment("");
      onClose();
    } catch (error) {
      alert(error?.error || "Failed to submit review");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 relative">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition"
        >
          <FaTimes size={24} />
        </button>

        {/* Header */}
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Write a Review</h2>
        <p className="text-sm text-gray-600 mb-6">
          Share your experience with <span className="font-semibold">{booking?.package?.name}</span>
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Star Rating */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Rating
            </label>
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  onMouseEnter={() => setHover(star)}
                  onMouseLeave={() => setHover(0)}
                  className="transition-transform hover:scale-110"
                >
                  <FaStar
                    size={32}
                    className={
                      star <= (hover || rating)
                        ? "text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
            {rating > 0 && (
              <p className="text-sm text-gray-600 mt-2">
                {rating === 1 && "Poor"}
                {rating === 2 && "Fair"}
                {rating === 3 && "Good"}
                {rating === 4 && "Very Good"}
                {rating === 5 && "Excellent"}
              </p>
            )}
          </div>

          {/* Comment */}
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Your Review
            </label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows="5"
              placeholder="Share details about your experience..."
              minLength={10}
              maxLength={1000}
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              {comment.length}/1000 characters (min 10)
            </p>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={loading || rating === 0 || comment.trim().length < 10}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}
