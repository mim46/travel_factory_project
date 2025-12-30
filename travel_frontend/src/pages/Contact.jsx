import { useState } from "react";
import { useDispatch } from "react-redux";
import { submitContact } from "../redux/slices/querySlice";

export default function Contact() {
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  const [showMessageBox, setShowMessageBox] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      await dispatch(submitContact(formData)).unwrap();
      alert("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", subject: "", message: "" });
      setShowMessageBox(false);
    } catch (error) {
      alert(error || "Failed to send message. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-6">

      {/* Heading */}
      <h1 className="text-5xl font-extrabold text-blue-700 text-center mb-10">
        Contact Us
      </h1>

      <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-10 items-start">

        {/* Contact Info Card */}
        <div className="bg-white p-8 rounded-3xl shadow-xl border border-blue-100">
          <h2 className="text-3xl font-bold text-blue-800 mb-6">Get in Touch</h2>

          <div className="space-y-4 text-lg text-gray-700">

            {/* Phone */}
            <p className="flex items-center gap-3">
              <span className="text-blue-600 text-2xl">📞</span>
              <strong>Phone:</strong> +880 1919-492959
            </p>

            {/* Email */}
            <p className="flex items-center gap-3">
              <span className="text-blue-600 text-2xl">📧</span>
              <strong>Email:</strong> travelfactorybd@gmail.com
            </p>

            {/* Address */}
            <p className="flex items-start gap-3">
              <span className="text-blue-600 text-2xl">📍</span>
              <span>
                <strong>Address:</strong> Suite-605 (5th Floor) Syed Grand Center, 
                Plot-89, Road-28, Sector-07, Uttara C/A, Dhaka, Bangladesh.
              </span>
            </p>

            {/* Support Line */}
            <p className="mt-6 text-gray-700 leading-relaxed">
              Our support team is available <span className="text-blue-800 font-semibold">24/7</span>  
              to assist you with travel information, booking queries, and customer support.
            </p>
          </div>

          {/* Decorative Icons */}
          <div className="flex gap-6 text-3xl mt-8 text-blue-500 opacity-80">
            <span>✈️</span>
            <span>🌍</span>
          </div>

          {/* Message Us Button (under "Get in Touch", right-aligned) */}
          <div className="flex justify-end mt-6">
            <button
              onClick={() => setShowMessageBox(true)}
              className="flex items-center gap-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
            >
              <span className="text-xl">💬</span>
              Message Us
            </button>
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-blue-100">
          <iframe
            title="Google Map"
            src="https://maps.google.com/maps?width=100%25&amp;height=380&amp;hl=en&amp;q=Syed%20Grand%20Center,%20Plot-89,%20Road-28,%20Sector-07,%20Uttara,%20Dhaka+(Travel%20Factory)&amp;t=&amp;z=16&amp;ie=UTF8&amp;iwloc=B&amp;output=embed"
            className="w-full h-[380px] rounded-2xl"
            allowFullScreen=""
            loading="lazy"
          ></iframe>
        </div>

      </div>

      {/* Message Form Modal */}
      {showMessageBox && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-3xl shadow-2xl border border-blue-100 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-3xl font-bold text-blue-800">
                Send Us a Message
              </h2>
              <button
                onClick={() => setShowMessageBox(false)}
                className="text-gray-500 hover:text-red-600 text-3xl font-bold transition"
              >
                ×
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Your Name *
                </label>
                <input
                  type="text"
                  name="name"
                  required
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition text-sm"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Your Email *
                </label>
                <input
                  type="email"
                  name="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition text-sm"
                  placeholder="example@email.com"
                />
              </div>

              {/* Message */}
              <div>
                <label className="block text-gray-700 font-semibold mb-2 text-sm">
                  Your Message *
                </label>
                <textarea
                  name="message"
                  rows="5"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 transition resize-none text-sm"
                  placeholder="Write your message here..."
                />
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3 rounded-lg font-bold text-base hover:from-blue-700 hover:to-blue-800 transition-all transform hover:scale-105 shadow-lg"
              >
                Send Message
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}