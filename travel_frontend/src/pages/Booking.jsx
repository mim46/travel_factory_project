import { useParams } from "react-router-dom";
import { useState } from "react";
import { domesticPackages } from "../data/packageData";
import { internationalPackages } from "../data/internationalData";
import { budgetPackages } from "../data/budgetData";
import { FaUser, FaPhone, FaCalendar, FaUsers } from "react-icons/fa";

export default function Booking() {
  const { id } = useParams();

  const pkg =
    domesticPackages.find((p) => p.id === Number(id)) ||
    internationalPackages.find((p) => p.id === Number(id)) ||
    budgetPackages.find((p) => p.id === Number(id));

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    persons: 1,
    date: "",
    request: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleBooking = (e) => {
    e.preventDefault();
    alert("Booking submitted successfully!");
  };

  return (
    <div className="min-h-screen bg-blue-50 p-8">

      <h1 className="text-4xl font-bold text-blue-900 mb-6 text-center">
        Book Your Tour
      </h1>

      {/* Package Title */}
      {pkg && (
        <p className="text-center text-xl mb-6 text-gray-700">
          <strong>Package:</strong> {pkg.title}
        </p>
      )}

      <form
        onSubmit={handleBooking}
        className="max-w-2xl mx-auto bg-white shadow-xl rounded-2xl p-8 space-y-6"
      >

        {/* Name */}
        <div>
          <label className="font-semibold">Full Name</label>
          <div className="flex items-center gap-3 border p-3 mt-1 rounded-lg">
            <FaUser className="text-blue-700" />
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full focus:outline-none"
              placeholder="Enter your full name"
            />
          </div>
        </div>

        {/* Email */}
        <div>
          <label className="font-semibold">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mt-1 focus:outline-none"
            placeholder="example@mail.com"
          />
        </div>

        {/* Phone */}
        <div>
          <label className="font-semibold">Phone Number</label>
          <div className="flex items-center gap-3 border p-3 mt-1 rounded-lg">
            <FaPhone className="text-blue-700" />
            <input
              type="text"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full focus:outline-none"
              placeholder="Enter your phone number"
            />
          </div>
        </div>

        {/* Persons */}
        <div>
          <label className="font-semibold">Number of Persons</label>
          <div className="flex items-center gap-3 border p-3 mt-1 rounded-lg">
            <FaUsers className="text-blue-700" />
            <input
              type="number"
              name="persons"
              min="1"
              value={formData.persons}
              onChange={handleChange}
              className="w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Date */}
        <div>
          <label className="font-semibold">Travel Date</label>
          <div className="flex items-center gap-3 border p-3 mt-1 rounded-lg">
            <FaCalendar className="text-blue-700" />
            <input
              type="date"
              name="date"
              required
              value={formData.date}
              onChange={handleChange}
              className="w-full focus:outline-none"
            />
          </div>
        </div>

        {/* Special Request */}
        <div>
          <label className="font-semibold">Special Request (optional)</label>
          <textarea
            name="request"
            rows="3"
            value={formData.request}
            onChange={handleChange}
            className="w-full border p-3 rounded-lg mt-1 focus:outline-none"
            placeholder="Write any message..."
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-3 rounded-xl text-lg font-semibold hover:bg-green-800 transition"
        >
          Confirm Booking
        </button>
      </form>
    </div>
  );
}
