import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/images/logo.png";

export default function Navbar() {
  const [open, setOpen] = useState(false);

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
      <div className="relative z-10 max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center h-20">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3">
            <img src={logo} alt="Travel Factory" className="h-12 w-auto object-contain" />
          </Link>

          {/* Menu */}
          <nav className="hidden md:flex items-center gap-8 text-[15px] font-medium">
            <Link to="/" className="hover:text-blue-600">Home</Link>
            <Link to="/destinations" className="hover:text-blue-600">Destinations</Link>
            <Link to="/query" className="hover:text-blue-600">Query</Link>
            <Link to="/gallery" className="hover:text-blue-600">Gallery</Link>

            {/* ABOUT US — SCROLL TO SECTION */}
            <button
              onClick={() =>
                document.getElementById("about").scrollIntoView({ behavior: "smooth" })
              }
              className="hover:text-blue-600"
            >
              About Us
            </button>

            <Link to="/contact" className="hover:text-blue-600">Contact</Link>
          </nav>

          {/* LOGIN */}
          <div className="hidden md:flex items-center gap-4">
            <Link
              to="/login"
              className="bg-yellow-300 hover:bg-yellow-500 text-blue-700 px-5 py-2 rounded-md text-sm font-semibold shadow"
            >
              Sign In
            </Link>
          </div>

          {/* HAMBURGER */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor">
              {open ? (
                <path strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>

        </div>
      </div>
    </header>
  );
}
