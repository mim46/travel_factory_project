import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitQuery } from "../redux/slices/querySlice";

export default function Query() {
  const dispatch = useDispatch();
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    destination: "",
    travel_date: "",
    persons: 1,
    budget: "",
    message: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(submitQuery(form)).unwrap();
      alert("Your query has been submitted successfully! We'll contact you soon.");
      setForm({
        name: "",
        email: "",
        phone: "",
        destination: "",
        travel_date: "",
        persons: 1,
        budget: "",
        message: "",
      });
    } catch (error) {
      alert(error || "Failed to submit query. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-yellow-200 p-4 py-16">

      {/* Glass Box */}
      <div className="bg-white/90 backdrop-blur-md shadow-2xl rounded-3xl w-full max-w-2xl p-8">
        
        <h2 className="text-3xl font-bold text-[#1a4d4f] mb-6 text-center">
          Plan Your Custom Tour
        </h2>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          
          {/* Name */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Your Name *</label>
            <input
              type="text"
              name="name"
              required
              placeholder="Enter your full name"
              value={form.name}
              onChange={handleChange}
              className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Your Email *</label>
            <input
              type="email"
              name="email"
              required
              placeholder="example@email.com"
              value={form.email}
              onChange={handleChange}
              className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Phone */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Phone Number *</label>
            <input
              type="tel"
              name="phone"
              required
              placeholder="+880 1XXX-XXXXXX"
              value={form.phone}
              onChange={handleChange}
              className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition text-sm"
            />
          </div>

          {/* Destination & Date */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Destination *</label>
              <input
                type="text"
                name="destination"
                required
                placeholder="e.g., Cox's Bazar"
                value={form.destination}
                onChange={handleChange}
                className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Travel Date *</label>
              <input
                type="date"
                name="travel_date"
                required
                value={form.travel_date}
                onChange={handleChange}
                min={new Date().toISOString().split('T')[0]}
                className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>
          </div>

          {/* Persons & Budget */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Number of Persons *</label>
              <input
                type="number"
                name="persons"
                min="1"
                required
                value={form.persons}
                onChange={handleChange}
                className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Budget (৳)</label>
              <input
                type="number"
                name="budget"
                placeholder="e.g., 50000"
                value={form.budget}
                onChange={handleChange}
                className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition text-sm"
              />
            </div>
          </div>

          {/* Message */}
          <div>
            <label className="block text-gray-700 font-semibold mb-1.5 text-sm">Additional Requirements</label>
            <textarea
              name="message"
              placeholder="Tell us about your special requirements or preferences..."
              rows="4"
              value={form.message}
              onChange={handleChange}
              className="p-3 rounded-lg w-full border border-gray-300 focus:outline-none focus:border-blue-500 transition resize-none text-sm"
            />
          </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-600 hover:to-yellow-700 text-white font-bold py-3 rounded-lg shadow-lg transition-all transform hover:scale-105 text-base"
        >
          Submit Query
        </button>
        </form>

      </div>
    </div>
  );
}
