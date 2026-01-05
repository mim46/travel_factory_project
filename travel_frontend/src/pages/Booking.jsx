import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackageById } from "../redux/slices/packageSlice";
import api from "../services/api";
import { FaUser, FaPhone, FaEnvelope, FaUsers, FaCalendar, FaCommentDots, FaSpinner } from "react-icons/fa";

export default function Booking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { currentPackage: pkg, loading } = useSelector((state) => state.packages);
  const { user, token } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: user?.phone || "",
    persons: 1,
    travel_date: "",
    special_request: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!token) {
      alert("⚠️ Please login to book a package");
      navigate("/login");
      return;
    }

    if (id) {
      dispatch(fetchPackageById(id));
    }
  }, [id, dispatch, token, navigate]);

  // Pre-fill user data when it's available
  useEffect(() => {
    if (user) {
      setFormData(prev => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
  }, [user]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    
    if (!token) {
      alert("⚠️ Please login to book a package");
      navigate("/login");
      return;
    }

    setIsSubmitting(true);

    try {
      const bookingData = {
        package_id: id,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        persons: formData.persons,
        travel_date: formData.travel_date,
        special_request: formData.special_request,
      };

      await api.post("/bookings", bookingData, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      alert("✅ Booking successful! We will contact you soon.");
      navigate("/");
    } catch (error) {
      console.error("Booking error:", error);
      alert("❌ Failed to book package: " + (error.response?.data?.message || error.message || "Unknown error"));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <FaSpinner className="animate-spin text-5xl text-blue-600 mx-auto mb-4" />
          <p className="text-gray-600 text-lg">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen flex justify-center items-center">
        <div className="text-center">
          <p className="text-2xl text-red-600 mb-4">❌ Package not found</p>
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

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        {/* Package Info Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden mb-8">
          <div className="relative h-64">
            <img
              src={pkg.image || "https://via.placeholder.com/800x400"}
              alt={pkg.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end">
              <div className="p-6 text-white">
                <h1 className="text-3xl font-bold mb-2">{pkg.title}</h1>
                <p className="text-lg">
                  <span className="font-semibold">৳{Number(pkg.price).toLocaleString()}</span> | {pkg.duration}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 mb-2">📝 Complete Your Booking</h2>
            <p className="text-gray-600">Fill in the details below to confirm your reservation</p>
          </div>

          <form onSubmit={handleBooking} className="space-y-6">
            {/* Name */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaUser className="text-blue-600" /> Full Name *
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="Enter your full name"
              />
            </div>

            {/* Email */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaEnvelope className="text-blue-600" /> Email Address *
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="your.email@example.com"
              />
            </div>

            {/* Phone */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaPhone className="text-blue-600" /> Phone Number *
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                placeholder="+880 1XXX-XXXXXX"
              />
            </div>

            {/* Persons and Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <FaUsers className="text-blue-600" /> Number of Persons *
                </label>
                <input
                  type="number"
                  name="persons"
                  value={formData.persons}
                  onChange={handleChange}
                  min="1"
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>

              <div>
                <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                  <FaCalendar className="text-blue-600" /> Travel Date *
                </label>
                <input
                  type="date"
                  name="travel_date"
                  value={formData.travel_date}
                  onChange={handleChange}
                  min={today}
                  required
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                />
              </div>
            </div>

            {/* Special Request */}
            <div>
              <label className="flex items-center gap-2 text-gray-700 font-semibold mb-2">
                <FaCommentDots className="text-blue-600" /> Special Requests (Optional)
              </label>
              <textarea
                name="special_request"
                value={formData.special_request}
                onChange={handleChange}
                rows="4"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                placeholder="Any special requirements or preferences..."
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-lg font-bold rounded-lg hover:from-blue-700 hover:to-blue-800 transition shadow-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <FaSpinner className="animate-spin" />
                  Processing...
                </>
              ) : (
                "Confirm Booking"
              )}
            </button>
          </form>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded-lg mt-8">
          <p className="text-gray-700">
            <span className="font-semibold">📞 Need Help?</span> Contact us at{" "}
            <a href="tel:+880123456789" className="text-blue-600 hover:underline">
              +880 123-456-789
            </a>{" "}
            or email{" "}
            <a href="mailto:info@travelfactory.com" className="text-blue-600 hover:underline">
              info@travelfactory.com
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}