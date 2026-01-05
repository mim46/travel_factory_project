// PackageDetails.jsx - Backend Integrated Version
import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackageById } from "../redux/slices/packageSlice";

export default function PackageDetails() {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { currentPackage: pkg, loading } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackageById(id));
  }, [dispatch, id]);

  // Parse list from string
  const parseList = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    return str.split('\n').filter(item => item.trim() !== '');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
          <p className="text-xl text-gray-600">Loading package details...</p>
        </div>
      </div>
    );
  }

  if (!pkg) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-2xl mx-auto text-center py-20">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-2xl text-red-600 font-bold mb-4">Package not found</p>
          <p className="text-gray-600 mb-6">The package you're looking for doesn't exist or has been removed.</p>
          <Link to="/" className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 md:px-8">
      <div className="max-w-6xl mx-auto">
        {/* Banner Image */}
        <div className="relative mb-8">
          <img
            src={pkg.image || "https://via.placeholder.com/1200x400"}
            alt={pkg.title}
            className="w-full h-64 md:h-96 object-cover rounded-2xl shadow-xl"
          />
          <div className="absolute top-4 left-4">
            <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
              pkg.package_type === 'domestic' ? 'bg-green-500 text-white' :
              pkg.package_type === 'international' ? 'bg-purple-500 text-white' :
              'bg-orange-500 text-white'
            }`}>
              {pkg.package_type === 'domestic' ? '🏠 Domestic' :
               pkg.package_type === 'international' ? '✈️ International' :
               '💰 Budget'}
            </span>
          </div>
        </div>

        {/* Title & Price Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-blue-900 mb-2">{pkg.title}</h1>
              <p className="text-gray-600 flex items-center gap-2">
                <span>📍</span>
                <span>{pkg.city ? `${pkg.city}, ` : ''}{pkg.country}</span>
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600 mb-1">Starting from</p>
              <p className="text-4xl font-bold text-blue-600">৳{Number(pkg.price).toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Quick Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className="text-4xl">⏱️</div>
            <div>
              <p className="text-sm text-gray-600">Duration</p>
              <p className="text-xl font-semibold text-gray-800">{pkg.duration}</p>
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-md p-6 flex items-center gap-4">
            <div className="text-4xl">🎫</div>
            <div>
              <p className="text-sm text-gray-600">Package ID</p>
              <p className="text-xl font-semibold text-gray-800">#{pkg.id}</p>
            </div>
          </div>
        </div>

        {/* Description */}
        {pkg.description && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📝 <span>Description</span>
            </h2>
            <p className="text-gray-700 leading-relaxed text-lg">{pkg.description}</p>
          </div>
        )}

        {/* Itinerary */}
        {pkg.itinerary && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📋 <span>Itinerary</span>
            </h2>
            <div className="space-y-3">
              {parseList(pkg.itinerary).map((item, index) => (
                <div key={index} className="flex items-start gap-4 p-3 bg-blue-50 rounded-lg">
                  <span className="text-blue-600 font-bold text-lg min-w-[30px]">
                    {index + 1}.
                  </span>
                  <p className="text-gray-700 flex-1">{item}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Inclusions */}
        {pkg.inclusions && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-green-700 mb-4 flex items-center gap-2">
              ✅ <span>What's Included</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {parseList(pkg.inclusions).map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <span className="text-green-600 text-xl">✓</span>
                  <p className="text-gray-700 flex-1">{item.replace(/^[•\-*]\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Exclusions */}
        {pkg.exclusions && (
          <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 mb-6">
            <h2 className="text-2xl font-bold text-red-700 mb-4 flex items-center gap-2">
              ❌ <span>What's NOT Included</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {parseList(pkg.exclusions).map((item, index) => (
                <div key={index} className="flex items-start gap-3 p-3 bg-red-50 rounded-lg">
                  <span className="text-red-600 text-xl">✗</span>
                  <p className="text-gray-700 flex-1">{item.replace(/^[•\-*]\s*/, '')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Booking Button */}
        <div className="bg-gradient-to-r from-green-600 to-green-700 rounded-2xl shadow-xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-4">Ready to Book?</h3>
          <p className="text-green-100 mb-6">Secure your spot now and start your adventure!</p>
          <Link
            to={`/booking/${pkg.id}`}
            className="inline-block bg-white text-green-700 px-10 py-4 text-xl font-bold rounded-xl hover:bg-green-50 transition shadow-lg transform hover:scale-105"
          >
            Book This Package Now →
          </Link>
        </div>

        {/* Back Button */}
        <div className="mt-6 text-center">
          <Link to="/" className="text-blue-600 hover:text-blue-800 font-semibold">
            ← Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}