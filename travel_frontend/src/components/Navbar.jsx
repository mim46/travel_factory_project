import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser } from "../redux/slices/authSlice";
import logo from "../assets/images/logo.png";
import { FaUser } from "react-icons/fa";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  // Get auth state
  const { user, token, role } = useSelector((state) => state.auth);
  const isLoggedIn = !!token;

  const handleLogout = async () => {
    await dispatch(logoutUser());
    alert("✅ Logged out successfully!");
    navigate("/");
  };

  // Role-based dashboard navigation
  const handleDashboardClick = () => {
    if (role === "admin") {
      navigate("/admin");
    } else {
      navigate("/user");
    }
  };

  return (
    <header className="relative bg-blue-50 border-b shadow-sm overflow-visible">

      {/* ✨ DECORATIONS LAYER */}
      <div className="absolute inset-0 pointer-events-none z-0">

        {/* ✈️ Plane Left */}
        <div className="absolute top-3 left-6 text-blue-500 text-xl animate-plane">
          ✈️
        </div>

        {/* ✈️ Plane Right */}
        <div className="absolute top-5 right-10 text-blue-500 text-lg animate-plane-rev">
          ✈️
        </div>

        {/* ⭐ Twinkling Stars */}
        <div className="absolute top-2 left-1/3 text-yellow-400 text-xl animate-twinkle">✦</div>
        <div className="absolute top-10 right-3/4 text-blue-500 text-xl animate-twinkle">✦</div>
        <div className="absolute top-4 left-3/4 text-blue-500 text-lg animate-twinkle">✦</div>

        {/* ☁️ Clouds */}
        <div className="absolute bottom-1 left-10 text-3xl animate-cloud">
          ☁️
        </div>
        <div className="absolute bottom-1 right-16 text-3xl animate-cloud-slow ">
          ☁️
        </div>
        <div className="absolute bottom-4 right-96 text-3xl animate-cloud">
          ☁️
        </div>
        <div className="absolute top-2 left-96 text-3xl animate-cloud-slow ">
          ☁️
        </div>
        

        {/* 🪂 Parachute */}
        <div className="absolute top-1 right-1/2 translate-x-10 text-red-400 text-lg animate-parachute">
          🪂
        </div>

      </div>

      {/* NAVBAR CONTENT */}
      <div className="relative z-10 max-w-7xl mx-auto px-2 ">
        <div className="grid grid-cols-[auto_1fr_auto] items-center h-20 gap-8">

          {/* Logo */}
          <Link to="/" className="grid grid-cols-[auto_1fr] items-center gap-3">
            <img src={logo} alt="Travel Factory" className="h-12 w-auto object-contain" />
          </Link>

          {/* Menu */}
          <nav className="hidden md:grid grid-flow-col auto-cols-max gap-8 text-[15px] font-medium justify-center">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/destinations" className="hover:text-blue-600">Destinations</Link>
            <Link to="/query" className="hover:text-blue-600">Query</Link>
            <Link to="/gallery" className="hover:text-blue-600">Gallery</Link>

            {/* ABOUT US — SCROLL TO SECTION */}
            <button
              onClick={() =>
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-blue-600"
            >
              About Us
            </button>

            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>

          {/* RIGHT SIDE - Conditional rendering */}
          <div className="hidden md:flex items-center gap-4">
            {isLoggedIn ? (
              // Logged in: Show user info + logout (dashboard style)
              <>
                <button
                  onClick={handleDashboardClick}
                  className="flex items-center gap-3 hover:opacity-80 transition cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold border border-blue-300">
                    {user?.name?.charAt(0).toUpperCase() || <FaUser />}
                  </div>
                  <span className="text-gray-700 font-medium">{user?.name}</span>
                </button>
                <button
                  onClick={handleLogout}
                  className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold shadow transition"
                >
                  Sign Out
                </button>
              </>
            ) : (
              // Not logged in: Show Sign In button
              <Link
                to="/login"
                className="bg-yellow-300 hover:bg-yellow-500 text-blue-700 px-5 py-2 rounded-md text-sm font-semibold shadow transition"
              >
                Sign In
              </Link>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden text-blue-600 text-2xl"
          >
            {open ? "✕" : "☰"}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <div className="md:hidden py-4 space-y-3 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg mt-2 px-6">
            <Link to="/" className="block hover:text-blue-600">Home</Link>
            <Link to="/destinations" className="block hover:text-blue-600">Destinations</Link>
            <Link to="/query" className="block hover:text-blue-600">Query</Link>
            <Link to="/gallery" className="block hover:text-blue-600">Gallery</Link>

            <button
              onClick={() => {
                document.getElementById("about")?.scrollIntoView({ behavior: "smooth" });
                setOpen(false);
              }}
              className="block hover:text-blue-600 w-full text-left"
            >
              About Us
            </button>

            <Link to="/contact" className="block hover:text-blue-600">Contact</Link>

            {isLoggedIn ? (
              <>
                <button
                  onClick={() => {
                    handleDashboardClick();
                    setOpen(false);
                  }}
                  className="flex items-center gap-3 py-2 cursor-pointer"
                >
                  <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white text-lg font-bold border border-blue-300">
                    {user?.name?.charAt(0).toUpperCase() || <FaUser />}
                  </div>
                  <span className="text-gray-700 font-medium">{user?.name}</span>
                </button>
                <button
                  onClick={() => {
                    handleLogout();
                    setOpen(false);
                  }}
                  className="block w-full text-left bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-md text-sm font-semibold"
                >
                  Sign Out
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="block bg-yellow-300 hover:bg-yellow-500 text-blue-700 px-5 py-2 rounded-md text-sm font-semibold text-center"
              >
                Sign In
              </Link>
            )}
          </div>
        )}
      </div>
    </header>
  );
}