import { useSelector } from "react-redux";
import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-full bg-white border-b border-blue-100 px-6 py-4 flex justify-between items-center shadow-sm">

      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-blue-400">Hey, {user?.name || "User"}! 👋</h1>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4 mr-10">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <div className="text-[#1C7DA2]">
            <FaUserCircle size={32} />
          </div>
          <div>
            <p className="text-gray-800 font-medium">{user?.name || "User"}</p>
            <p className="text-gray-500 text-xs">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>
    </div>
  );
}