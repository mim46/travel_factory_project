import { useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "../redux/slices/packageSlice";

export default function CountryPackages() {
  const { country } = useParams();
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Normalize for better matching
  const normalize = (str) => {
    if (!str) return '';
    return str.toLowerCase().trim();
  };

  // Filter packages by country and package_type=international
  const filteredPackages = packages.filter(
    (p) => normalize(p.country) === normalize(country) && p.package_type === "international"
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 py-10 px-6 flex justify-center items-center">
        <p className="text-xl text-gray-600">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 capitalize text-center">
        {country} Packages
      </h1>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600">No packages available for {country}</p>
          <Link to="/international" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to International Destinations
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {filteredPackages.map((pkg) => (
            <div
              key={pkg.id}
              className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden transition"
            >
              <img 
                src={pkg.image ? `http://localhost:8000/${pkg.image}` : "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=60"} 
                alt={pkg.title} 
                className="w-full h-48 object-cover" 
              />

              <div className="p-6">
                <h2 className="text-2xl font-semibold mb-2 text-gray-800">{pkg.title}</h2>

                <p className="text-gray-600 mb-2"><strong>Duration:</strong> {pkg.duration}</p>
                <p className="text-blue-600 font-bold text-xl mb-4">৳ {pkg.price}</p>

                <Link
                  to={`/package-details/${pkg.id}`}
                  className="inline-block bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}