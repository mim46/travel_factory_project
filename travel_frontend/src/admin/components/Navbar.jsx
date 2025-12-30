import { FaSearch } from "react-icons/fa";

export default function Navbar() {
    return (
      <div className="w-full bg-white border-b border-blue-100 px-6 py-4 flex justify-between items-center shadow-sm">
  
        {/* Search Bar */}
        <div className="flex items-center gap-3 bg-gray-100 px-4 py-2 rounded-lg w-96">
          <FaSearch className="text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="bg-transparent focus:outline-none w-full text-gray-700"
          />
        </div>
  
        {/* Profile Section */}
        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
            alt="admin-profile"
            className="w-10 h-10 rounded-full border border-blue-300"
          />
          <span className="text-gray-700 font-medium">
            Admin
          </span>
        </div>
  
      </div>
    );
  }
  