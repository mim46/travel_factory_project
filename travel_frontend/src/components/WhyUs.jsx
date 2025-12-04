import { FaMapMarkedAlt, FaPlane, FaHeadset, FaDollarSign } from "react-icons/fa";

export default function WhyUs() {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-6 text-center">

        {/* Title */}
        <h2
          className="
            text-3xl md:text-4xl font-extrabold 
            bg-gradient-to-r from-blue-600 via-blue-400 to-purple-600
            bg-clip-text text-transparent
            drop-shadow-sm
            mb-10
          "
        >
          Why Choose <span className="text-yellow-500">Travel Factory?</span>
        </h2>

        {/* Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">

          {/* Card 1 */}
          <div className="bg-white shadow-lg hover:shadow-2xl transition p-10 rounded-3xl border border-blue-100">
            <FaPlane className="text-blue-500 text-6xl mx-auto mb-5" />
            <h3 className="font-semibold text-xl text-gray-900">Hassle-Free Booking</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Simple, fast, and secure booking for every traveler.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-white shadow-lg hover:shadow-2xl transition p-10 rounded-3xl border border-blue-100">
            <FaDollarSign className="text-yellow-500 text-6xl mx-auto mb-5" />
            <h3 className="font-semibold text-xl text-gray-900">Best Price Guarantee</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Best deals without compromising comfort.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-white shadow-lg hover:shadow-2xl transition p-10 rounded-3xl border border-blue-100">
            <FaMapMarkedAlt className="text-blue-500 text-6xl mx-auto mb-5" />
            <h3 className="font-semibold text-xl text-gray-900">Worldwide Destinations</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Explore Bangladesh and international hotspots.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-white shadow-lg hover:shadow-2xl transition p-10 rounded-3xl border border-blue-100">
            <FaHeadset className="text-yellow-500 text-6xl mx-auto mb-5" />
            <h3 className="font-semibold text-xl text-gray-900">24/7 Customer Support</h3>
            <p className="text-gray-600 mt-2 leading-relaxed">
              Travel assistance anytime you need it.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
