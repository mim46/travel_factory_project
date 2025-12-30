import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "../redux/slices/packageSlice";

export default function Domestic() {
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Get unique cities from domestic packages
  const domesticCities = [...new Set(
    packages
      .filter(p => p.package_type === "domestic" && p.city)
      .map(p => p.city.toLowerCase().trim())
  )];

  // Default images for cities
  const cityImages = {
    "coxsbazar": "https://images.unsplash.com/photo-1608531235552-b5e6fa43e68a?auto=format&fit=crop&w=800&q=60",
    "sajek": "https://images.unsplash.com/photo-1581447109209-2f091b0142a4?auto=format&fit=crop&w=800&q=60",
    "bandarban": "https://images.unsplash.com/photo-1596349163408-b8d652e38120?auto=format&fit=crop&w=800&q=60",
    "sylhet": "https://images.unsplash.com/photo-1578678809452-9cdea59fa1f7?auto=format&fit=crop&w=800&q=60",
    "saintmartin": "https://images.unsplash.com/photo-1578678809452-9cdea59fa1f7?auto=format&fit=crop&w=800&q=60"
  };

  // Default fallback image
  const defaultImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60";

  // Create places array from database
  const places = domesticCities.map(city => ({
    name: city.charAt(0).toUpperCase() + city.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2'),
    slug: city,
    image: cityImages[city] || defaultImage
  }));

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-900 text-center mb-10">
          Domestic Tour Packages
        </h1>

        {/* Places Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
          {places.map((place) => (
            <div
              key={place.slug}
              className="bg-white rounded-xl shadow hover:shadow-xl transition overflow-hidden"
            >
              <img
                src={place.image}
                alt={place.name}
                className="w-full h-60 object-cover"
              />

              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  {place.name}
                </h2>

                <p className="text-gray-600 mb-4">
                  Explore exclusive tour packages for {place.name}. Enjoy
                  beautiful hotels, premium travel, and fixed-date trips!
                </p>

                <Link
                  to={`/domestic/${place.slug}`}
                  className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                >
                  View Packages
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
