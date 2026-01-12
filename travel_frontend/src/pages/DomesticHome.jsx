import { useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "../redux/slices/packageSlice";
import { fetchPlaces } from "../redux/slices/placeSlice";

export default function Domestic() {
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => state.packages);
  const { places } = useSelector((state) => state.places);
  const [searchParams] = useSearchParams();
  const tourType = searchParams.get('type'); // Get tour type from query params

  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchPlaces());
  }, [dispatch]);

  // Normalize for better matching
  const normalize = (str) => {
    if (!str) return '';
    return str.toLowerCase().trim();
  };

  // If tour type is selected, show filtered packages directly (including budget packages)
  const filteredPackages = tourType 
    ? packages.filter(p => 
        (p.package_type === "domestic" || p.package_type === "budget") && 
        normalize(p.tour_type) === normalize(tourType)
      )
    : [];

  // Get unique cities from domestic packages (for when no tour type selected)
  const domesticCities = [...new Set(
    packages
      .filter(p => p.package_type === "domestic" && p.city)
      .map(p => p.city.toLowerCase().trim())
  )];

  // Default fallback image
  const defaultImage = "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60";

  // Create places array from database with images from places table
  const placesArray = domesticCities.map(city => {
    // Find matching place from database
    const placeData = places?.find(p => p.name.toLowerCase().trim() === city);
    
    return {
      name: city.charAt(0).toUpperCase() + city.slice(1).replace(/([a-z])([A-Z])/g, '$1 $2'),
      slug: city,
      image: placeData?.image ? `http://localhost:8000/${placeData.image}` : defaultImage
    };
  });

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <h1 className="text-4xl font-bold text-blue-900 text-center mb-10">
          Domestic {tourType ? `${tourType.charAt(0).toUpperCase() + tourType.slice(1)} Tour` : 'Tour'} Packages
        </h1>

        {/* If tour type is selected, show packages directly */}
        {tourType ? (
          <div>
            {filteredPackages.length === 0 ? (
              <div className="text-center py-20">
                <p className="text-xl text-gray-600">No {tourType} packages available</p>
                <Link to="/domestic" className="text-blue-600 hover:underline mt-4 inline-block">
                  ← View All Destinations
                </Link>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredPackages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="bg-white rounded-xl shadow hover:shadow-xl overflow-hidden transition"
                  >
                    <img 
                      src={pkg.image ? `http://localhost:8000/${pkg.image}` : defaultImage} 
                      alt={pkg.title} 
                      className="w-full h-56 object-cover" 
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
        ) : (
          /* Show cities if no tour type selected */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-8">
            {placesArray.map((place) => (
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
                    to={`/domestic/${place.slug}${tourType ? `?type=${tourType}` : ''}`}
                    className="inline-block bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-800 transition"
                  >
                    View Packages
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
