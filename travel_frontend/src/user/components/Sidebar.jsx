import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { FaHome, FaTicketAlt, FaUser, FaCreditCard, FaCog, FaSignOutAlt, FaEnvelope } from "react-icons/fa";
import logo from "../../assets/images/logo.png";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const isActive = (path) => location.pathname === path;

  const handleSignOut = async () => {
    await dispatch(logoutUser());
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  return (
    <div className="w-64 min-h-screen bg-[#E8F8FF] text-gray-800 p-6 space-y-6 border-r border-blue-100">

      {/* Logo - Clickable to landing page */}
      <Link to="/" className="mb-10 flex justify-center cursor-pointer">
        <img src={logo} alt="Travel Factory Logo" className="w-20 h-auto object-contain hover:opacity-80 transition" />
      </Link>

      {/* Dashboard */}
      <Link
        to="/user"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/user") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaHome /> Dashboard
      </Link>

      {/* My Profile */}
      <Link
        to="/user/profile"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/user/profile") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaUser /> My Profile
      </Link>

      {/* My Bookings */}
      <Link
        to="/user/bookings"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/user/bookings") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaTicketAlt /> My Bookings
      </Link>

      {/* Messages */}
      <Link
        to="/user/messages"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/user/messages") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaEnvelope /> Messages
      </Link>

      {/* Payment History */}
      <Link
        to="/user/payment-history"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/user/payment-history") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaCreditCard /> Payment History
      </Link>

      {/* Sign Out */}
      <button
        onClick={handleSignOut}
        className="flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition hover:bg-red-100 text-red-600 w-full"
      >
        <FaSignOutAlt /> Sign Out
      </button>

    </div>
  );
}