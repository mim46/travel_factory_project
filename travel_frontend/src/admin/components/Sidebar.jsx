import { Link, useLocation } from "react-router-dom";
import { FaHome, FaUsers, FaBox, FaShoppingCart, FaEnvelope } from "react-icons/fa";

export default function Sidebar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <div className="w-64 min-h-screen bg-[#E8F8FF] text-gray-800 p-6 space-y-6 border-r border-blue-100">

      <h2 className="text-2xl font-bold mb-10 text-[#1C7DA2]">Admin Panel</h2>

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

    </div>
  );
}
