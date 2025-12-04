import { useState } from "react";

export default function Query() {
  const [form, setForm] = useState({ name: "", email: "", message: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitQuery = () => {
    alert("Your query has been submitted!");
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-blue-300 to-yellow-200 p-4">

      {/* Title OUTSIDE Box */}
      <h1 className="text-4xl font-bold text-[#1a4d4f] mb-6 text-center -mt-8">
        Submit Query
      </h1>

      {/* Glass Box */}
      <div className="bg-white/40 backdrop-blur-md shadow-xl rounded-2xl w-full max-w-2xl p-8">

        {/* Form Inputs */}
        <div className="space-y-4">
          
          <input
            type="text"
            name="name"
            placeholder="Your Name"
            value={form.name}
            onChange={handleChange}
            className="p-3 rounded-lg w-full border border-blue-400 text-sm bg-white/70"
          />

          <input
            type="email"
            name="email"
            placeholder="Your Email"
            value={form.email}
            onChange={handleChange}
            className="p-3 rounded-lg w-full border border-blue-400 text-sm bg-white/70"
          />

          <textarea
            name="message"
            placeholder="Write your message here…"
            rows="5"
            value={form.message}
            onChange={handleChange}
            className="p-3 rounded-lg w-full border border-blue-400 text-sm bg-white/70"
          />

        </div>

        {/* Submit Button */}
        <div className="flex justify-center">
          <button
            onClick={submitQuery}
            className="mt-6 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 rounded-lg shadow-md text-sm w-1/2"
          >
            Submit 
          </button>
        </div>

      </div>
    </div>
  );
}
