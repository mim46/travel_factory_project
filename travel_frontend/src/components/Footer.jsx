import {
  FaFacebook,
  FaLinkedin,
  FaGlobe,
  FaPhone,
  FaEnvelope,
  FaWhatsapp,
  FaMapMarkerAlt
} from "react-icons/fa";

import logo from "../assets/images/logo.png";

export default function Footer() {
  return (
    <footer className="bg-[#d9fffa] text-gray-800 pt-14 pb-6 mt-16 border-t border-blue-200">
      
      {/* Main Grid */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-14">

        {/* BRAND + ABOUT */}
        <div className="flex flex-col items-center text-center">
          <img
            src={logo}
            alt="Travel Factory Logo"
            className="h-20 w-auto mb-3"
          />

          <p className="text-gray-700 leading-7">
            From dream destinations to budget-friendly tours,
            <span className="font-semibold text-[#1a4d4f]"> Travel Factory </span>
            delivers seamless and secure travel experiences — whether it's a
            family vacation, honeymoon trip, or adventure escape.
          </p>
        </div>

        {/* QUICK LINKS */}
        <div className="text-left">
          <h3 className="text-xl font-semibold mb-4 text-[#1a4d4f]">Quick Links</h3>
          <ul className="space-y-2 text-gray-700">
            <li><a href="/" className="hover:text-[#00796b]">Home</a></li>
            <li><a href="/about" className="hover:text-[#00796b]">About Us</a></li>
            <li><a href="/packages" className="hover:text-[#00796b]">Packages</a></li>
            <li><a href="/gallery" className="hover:text-[#00796b]">Gallery</a></li>
            <li><a href="/contact" className="hover:text-[#00796b]">Contact</a></li>
          </ul>
        </div>

        {/* ADDRESS */}
        <div className="text-left">
          <h3 className="text-xl font-semibold mb-4 text-[#1a4d4f]">Address</h3>

          <p className="flex items-start text-sm text-gray-700 leading-6 mb-6">
            <FaMapMarkerAlt className="text-[#00796b] mr-3 mt-1 text-lg" />
            Suite-605 (5th Floor), Syed Grand Center, Plot-89, Road-28,
            Sector-07, Uttara C/A, Dhaka, Bangladesh
          </p>

          <h3 className="text-xl font-semibold mb-4 text-[#1a4d4f]">Contact Us</h3>

          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-center">
              <FaPhone className="text-[#00796b] mr-3 text-lg" />
              <a href="tel:+8801919492959" className="hover:text-[#00796b]">
                01919-492959
              </a>
            </li>

            <li className="flex items-center">
              <FaWhatsapp className="text-[#25D366] mr-3 text-lg" />
              <a
                href="https://wa.me/8801819492959"
                target="_blank"
                className="hover:text-[#00796b]"
              >
                +880 1819-492959
              </a>
            </li>

            <li className="flex items-center">
              <FaEnvelope className="text-[#00796b] mr-3 text-lg" />
              <a
                href="mailto:travelfactorybd@gmail.com"
                className="hover:text-[#00796b]"
              >
                travelfactorybd@gmail.com
              </a>
            </li>
          </ul>
        </div>

        {/* FOLLOW US */}
        <div className="text-left">
          <h3 className="text-xl font-semibold mb-4 text-[#1a4d4f]">Follow Us</h3>
          <div className="flex space-x-6 text-2xl mt-2">
            <a href="#" className="hover:text-[#00796b]"><FaFacebook /></a>
            <a href="#" className="hover:text-[#00796b]"><FaLinkedin /></a>
            <a href="#" className="hover:text-[#00796b]"><FaGlobe /></a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="mt-10 pt-4 border-t border-blue-200">
        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center text-sm text-gray-600">

          {/* Left side */}
          <p className="mb-2 sm:mb-0">
            © 2025 <span className="font-semibold text-[#1a4d4f]">Travel Factory</span>.  
            All Rights Reserved.
          </p>

          {/* Right side */}
          <p className="font-medium">
            Technology Partner: <span className="text-[#1a4d4f] font-semibold">CODETREE</span>
          </p>

        </div>
      </div>

    </footer>
  );
}
