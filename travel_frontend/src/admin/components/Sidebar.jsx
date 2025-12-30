import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaHome, FaUsers, FaBox, FaShoppingCart, FaEnvelope, FaMoneyBillWave, FaChartLine, FaCog, FaSignOutAlt } from "react-icons/fa";
import logo from "../../assets/images/logo.png";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const isActive = (path) => location.pathname === path;

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <div className="w-64 min-h-screen bg-[#E8F8FF] text-gray-800 p-6 space-y-6 border-r border-blue-100">

      <div className="mb-10 flex justify-center">
        <img src={logo} alt="Travel Factory Logo" className="w-20 h-auto object-contain" />
      </div>

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

      {/* Settings */}
      <Link
        to="/admin/settings"
        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-lg transition 
        ${isActive("/admin/settings") ? "bg-[#4DBEE3] text-white shadow" : "hover:bg-[#E3F7FF] text-[#1C7DA2]"}`}
      >
        <FaCog /> Settings
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
