// src/components/AboutUs.jsx
export default function AboutUs() {
  return (
    <section id="about" className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 py-16 px-6 flex justify-center mt-20">

      <div className="bg-white max-w-3xl w-full p-10 rounded-3xl shadow-2xl border border-blue-100">

        {/* Heading */}
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6 text-center">
          About Us
        </h1>

        <div className="w-20 h-1 bg-blue-500 mx-auto mb-8 rounded-full"></div>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          Welcome to <span className="font-semibold text-blue-700">Travel Factory</span> —
          your most trusted travel companion.
        </p>

        <p className="text-gray-700 leading-relaxed mb-6 text-lg">
          We provide Domestic, International, Honeymoon & Budget Packages with full arrangements.
        </p>

        <p className="text-gray-700 leading-relaxed text-lg">
          Every trip is designed to be
          <span className="font-semibold text-blue-700"> enjoyable, affordable & unforgettable.</span>
        </p>

        <div className="flex justify-center gap-6 mt-10 text-3xl text-blue-500 opacity-80">
          <span>✈️</span>
          <span>🌍</span>
          <span>🏖️</span>
          <span>🧭</span>
        </div>
      </div>
    </section>
  );
}
