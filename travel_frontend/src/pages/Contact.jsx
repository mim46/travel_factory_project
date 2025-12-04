export default function Contact() {
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

            {/* Address - FIXED */}
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
            <span>💬</span>
          </div>
        </div>

        {/* Google Map */}
        <div className="bg-white p-4 rounded-3xl shadow-xl border border-blue-100">
          <iframe
            title="Google Map"
            src="https://maps.google.com/maps?q=dhaka&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-[380px] rounded-2xl"
          ></iframe>
        </div>

      </div>
    </div>
  );
}
