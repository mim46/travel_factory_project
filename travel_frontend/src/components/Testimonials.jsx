import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchFeaturedReviews } from "../redux/slices/reviewSlice";
import { FaStar, FaQuoteLeft } from "react-icons/fa";

export default function Testimonials() {
  const dispatch = useDispatch();
  const { featuredReviews, loading } = useSelector((state) => state.reviews);

  useEffect(() => {
    dispatch(fetchFeaturedReviews());
  }, [dispatch]);

  const renderStars = (rating) => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <FaStar
            key={star}
            className={star <= rating ? "text-yellow-400" : "text-gray-300"}
            size={20}
          />
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-500">Loading testimonials...</p>
        </div>
      </div>
    );
  }

  if (featuredReviews.length === 0) {
    return null; // Don't show section if no reviews
  }

  return (
    <div className="py-16 bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            What Our Customers Say
          </h2>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Real experiences from real travelers who chose Travel Factory for their adventures
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredReviews.map((review) => (
            <div
              key={review.id}
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition transform hover:-translate-y-1"
            >
              {/* Quote Icon */}
              <div className="flex justify-center mb-4">
                <div className="bg-blue-100 p-3 rounded-full">
                  <FaQuoteLeft className="text-blue-600 text-2xl" />
                </div>
              </div>

              {/* Star Rating */}
              <div className="mb-4">
                {renderStars(review.rating)}
              </div>

              {/* Review Comment */}
              <p className="text-gray-700 text-center mb-4 line-clamp-4">
                "{review.comment}"
              </p>

              {/* Reviewer Info */}
              <div className="border-t pt-4 text-center">
                <p className="font-semibold text-gray-800">
                  {review.user?.name || "Anonymous"}
                </p>
                <p className="text-sm text-blue-600">
                  {review.package?.title || "Travel Package"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
