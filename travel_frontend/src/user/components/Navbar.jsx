import { useSelector } from "react-redux";

export default function Navbar() {
  const user = useSelector((state) => state.auth.user) || JSON.parse(localStorage.getItem("user"));

  return (
    <div className="w-full bg-white border-b border-blue-100 px-6 py-4 flex justify-between items-center shadow-sm">

      {/* Welcome Message */}
      <div>
        <h1 className="text-2xl font-bold text-blue-400">Hey, {user?.name || "User"}! 👋</h1>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-4">
        {/* Profile */}
        <div className="flex items-center gap-3">
          <img
            src="https://cdn-icons-png.flaticon.com/512/3135/3135715.png"
            alt="user-profile"
            className="w-10 h-10 rounded-full border border-blue-300"
          />
          <div>
            <p className="text-gray-800 font-medium">{user?.name || "User"}</p>
            <p className="text-gray-500 text-xs">{user?.email || "user@example.com"}</p>
          </div>
        </div>
      </div>

    </div>
  );
}