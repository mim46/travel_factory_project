import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchMyBookings } from "../redux/slices/bookingSlice";
import { FaUser, FaTicketAlt, FaEnvelope, FaCreditCard, FaArrowRight } from "react-icons/fa";

export default function UserDashboard() {
  const dispatch = useDispatch();
  const { myBookings, loading } = useSelector((state) => state.bookings);
  const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    dispatch(fetchMyBookings());
  }, [dispatch]);

  const totalBookings = myBookings.length;
  const totalMessages = 0; // TODO: Fetch from backend
  const totalPayments = 0; // TODO: Fetch from backend

  return (
    <div className="p-6">
      
      {/* Quick Action Cards - Light Color Background */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        
        {/* My Profile Card */}
        <Link to="/user/profile" className="group bg-gradient-to-br from-blue-50 to-blue-100 hover:from-blue-100 hover:to-blue-200 border-2 border-blue-200 hover:border-blue-400 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-blue-200 rounded-lg group-hover:bg-blue-500 transition">
              <FaUser className="text-2xl text-blue-700 group-hover:text-white transition" />
            </div>
            <FaArrowRight className="text-blue-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">My Profile</h3>
          <p className="text-gray-600 text-xs">Update personal info</p>
        </Link>

        {/* My Bookings Card */}
        <Link to="/user/bookings" className="group bg-gradient-to-br from-green-50 to-green-100 hover:from-green-100 hover:to-green-200 border-2 border-green-200 hover:border-green-400 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-green-200 rounded-lg group-hover:bg-green-500 transition">
              <FaTicketAlt className="text-2xl text-green-700 group-hover:text-white transition" />
            </div>
            <FaArrowRight className="text-green-400 group-hover:text-green-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">My Bookings</h3>
          <p className="text-gray-600 text-xs">
            <span className="font-semibold text-green-700">{totalBookings}</span> total bookings
          </p>
        </Link>

        {/* Messages Card */}
        <Link to="/user/messages" className="group bg-gradient-to-br from-purple-50 to-purple-100 hover:from-purple-100 hover:to-purple-200 border-2 border-purple-200 hover:border-purple-400 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-purple-200 rounded-lg group-hover:bg-purple-500 transition">
              <FaEnvelope className="text-2xl text-purple-700 group-hover:text-white transition" />
            </div>
            <FaArrowRight className="text-purple-400 group-hover:text-purple-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Messages</h3>
          <p className="text-gray-600 text-xs">
            <span className="font-semibold text-purple-700">{totalMessages}</span> unread
          </p>
        </Link>

        {/* Payment History Card */}
        <Link to="/user/payment-history" className="group bg-gradient-to-br from-orange-50 to-orange-100 hover:from-orange-100 hover:to-orange-200 border-2 border-orange-200 hover:border-orange-400 p-5 rounded-xl shadow-md hover:shadow-xl transition-all duration-300">
          <div className="flex items-center justify-between mb-3">
            <div className="p-3 bg-orange-200 rounded-lg group-hover:bg-orange-500 transition">
              <FaCreditCard className="text-2xl text-orange-700 group-hover:text-white transition" />
            </div>
            <FaArrowRight className="text-orange-400 group-hover:text-orange-600 group-hover:translate-x-1 transition-all" />
          </div>
          <h3 className="text-lg font-bold text-gray-800 mb-1">Payments</h3>
          <p className="text-gray-600 text-xs">
            <span className="font-semibold text-orange-700">{totalPayments}</span> transactions
          </p>
        </Link>

      </div>

      {/* Recent Activity Section */}
<div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-md p-6 border border-gray-200">
  <div className="flex items-center justify-between mb-6">
    <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
      📌 Recent Activity
    </h3>
    {myBookings.length > 0 && (
      <Link to="/user/bookings" className="text-blue-600 hover:text-blue-700 font-semibold text-sm flex items-center gap-1">
        View All <FaArrowRight className="text-xs" />
      </Link>
    )}
  </div>
  
  {loading ? (
    <div className="flex flex-col items-center justify-center py-12">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mb-4"></div>
      <p className="text-gray-500">Loading...</p>
    </div>
  ) : myBookings.length === 0 ? (
    <div className="text-center py-16 bg-white rounded-lg border-2 border-dashed border-gray-300">
      <div className="mb-4">
        <FaTicketAlt className="text-6xl text-gray-300 mx-auto" />
      </div>
      <p className="text-gray-600 text-lg font-semibold mb-2">No bookings yet</p>
      <p className="text-gray-500 text-sm mb-6">Start exploring amazing travel packages!</p>
      <Link to="/packages" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md hover:shadow-lg">
        <FaTicketAlt /> Browse Packages
      </Link>
    </div>
  ) : (
    <div className="space-y-3">
      {myBookings.slice(0, 5).map((booking) => (
        <div key={booking.id} className="group flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200 hover:border-blue-300 hover:shadow-md transition-all">
          <div className="flex items-center gap-4">
            <div className={`p-3 rounded-lg ${
              booking.status === 'confirmed' ? 'bg-green-100' :
              booking.status === 'pending' ? 'bg-yellow-100' :
              'bg-red-100'
            }`}>
              <FaTicketAlt className={`text-xl ${
                booking.status === 'confirmed' ? 'text-green-600' :
                booking.status === 'pending' ? 'text-yellow-600' :
                'text-red-600'
              }`} />
            </div>
            <div>
              <p className="font-bold text-gray-800 group-hover:text-blue-600 transition">
                {booking.package?.title}
              </p>
              <p className="text-sm text-gray-500 flex items-center gap-2 mt-1">
                <span>🗓️ {new Date(booking.travel_date).toLocaleDateString('en-US', { 
                  year: 'numeric', 
                  month: 'short', 
                  day: 'numeric' 
                })}</span>
                <span>•</span>
                <span>👥 {booking.persons} person(s)</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className={`px-4 py-1.5 rounded-full text-xs font-bold border-2 ${
              booking.status === 'confirmed' ? 'bg-green-50 text-green-700 border-green-200' :
              booking.status === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' :
              'bg-red-50 text-red-700 border-red-200'
            }`}>
              {booking.status === 'confirmed' ? '✅' : booking.status === 'pending' ? '⏳' : '❌'} {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
            </span>
            <FaArrowRight className="text-gray-400 group-hover:text-blue-600 group-hover:translate-x-1 transition-all" />
          </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}