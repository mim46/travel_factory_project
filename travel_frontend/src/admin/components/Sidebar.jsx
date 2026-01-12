import { Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { logoutUser } from "../../redux/slices/authSlice";
import { FaHome, FaUsers, FaBox, FaShoppingCart, FaEnvelope, FaMoneyBillWave, FaChartLine, FaSignOutAlt, FaMapMarkerAlt, FaImages, FaFileAlt, FaChevronDown, FaChevronUp } from "react-icons/fa";
import logo from "../../assets/images/logo.png";
import { useState } from "react";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [isPagesOpen, setIsPagesOpen] = useState(false);
  
  const isActive = (path) => location.pathname === path;
  const isPageActive = location.pathname.includes("/admin/pages");

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
        to="/admin"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaHome /> Dashboard
      </Link>

      {/* Users */}
      <Link
        to="/admin/users"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/users") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaUsers /> Users
      </Link>

      {/* Destinations */}
      <Link
        to="/admin/destinations"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/destinations") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaMapMarkerAlt /> Destinations
      </Link>

      {/* Packages */}
      <Link
        to="/admin/packages"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/packages") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaBox /> Packages
      </Link>

      {/* Bookings */}
      <Link
        to="/admin/bookings"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/bookings") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaShoppingCart /> Bookings
      </Link>

      {/* Gallery */}
      <Link
        to="/admin/gallery"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/gallery") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaImages /> Gallery
      </Link>

      {/* Pages - Collapsible */}
      <div>
        <button
          onClick={() => setIsPagesOpen(!isPagesOpen)}
          className={`flex items-center justify-between w-full px-4 py-3 rounded-lg text-lg transition 
          ${isPageActive ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
        >
          <div className="flex items-center gap-3">
            <FaFileAlt /> Pages
          </div>
          {isPagesOpen ? <FaChevronUp size={14} /> : <FaChevronDown size={14} />}
        </button>
        
        {isPagesOpen && (
          <div className="ml-4 mt-2 space-y-1">
            <Link
              to="/admin/pages/home"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base transition 
              ${isActive("/admin/pages/home") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
            >
              Home
            </Link>
            <Link
              to="/admin/pages/about"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base transition 
              ${isActive("/admin/pages/about") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
            >
              About Us
            </Link>
            <Link
              to="/admin/pages/contact"
              className={`flex items-center gap-3 px-4 py-2 rounded-lg text-base transition 
              ${isActive("/admin/pages/contact") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
            >
              Contact
            </Link>
          </div>
        )}
      </div>

      {/* Messages */}
      <Link
        to="/admin/messages"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/messages") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaEnvelope /> Messages
      </Link>

      {/* Payments */}
      <Link
        to="/admin/payments"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/payments") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaMoneyBillWave /> Payments
      </Link>

      {/* Reports */}
      <Link
        to="/admin/reports"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/reports") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaChartLine /> Reports
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