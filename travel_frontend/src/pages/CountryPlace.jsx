import { useEffect } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "../redux/slices/packageSlice";

export default function CountryPlace() {
  const { place } = useParams();
  const [searchParams] = useSearchParams();
  const tourType = searchParams.get('type'); // Get tour type from query params
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Mapping for place names
  const placeMapping = {
    'coxsbazar': ['coxsbazar', "cox's bazar", 'coxs bazar', 'cox bazar'],
    'sajek': ['sajek', 'sajek valley'],
    'bandarban': ['bandarban'],
    'sylhet': ['sylhet'],
    'saintmartin': ['saint martin', 'saintmartin', 'st martin']
  };

  // Normalize and check if city matches any variation
  const normalize = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/[^a-z]/g, '');
  };

  const cityMatchesPlace = (cityName) => {
    if (!cityName) return false;
    const normalizedCity = normalize(cityName);
    const variations = placeMapping[place] || [place];
    return variations.some(variation => normalize(variation) === normalizedCity);
  };

  // Filter packages by city (place), package_type=domestic, and tour_type
  const filteredPackages = packages.filter((p) => {
    const isDomestic = p.package_type === "domestic";
    const matchesPlace = cityMatchesPlace(p.city);
    const matchesTourType = !tourType || normalize(p.tour_type) === normalize(tourType);
    
    // Debug logging
    if (isDomestic) {
      console.log('Package:', p.title, 'City:', p.city, 'Matches:', matchesPlace, 'URL Place:', place, 'Tour Type:', p.tour_type, 'Filter:', tourType);
    }
    
    return isDomestic && matchesPlace && matchesTourType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-blue-50 py-10 px-6 flex justify-center items-center">
        <p className="text-xl text-gray-600">Loading packages...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6">
      <h1 className="text-4xl font-bold capitalize text-blue-900 mb-8 text-center">
        {place.replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, str => str.toUpperCase())} {tourType ? `${tourType.charAt(0).toUpperCase() + tourType.slice(1)} Tour` : ''} Packages
      </h1>

      {filteredPackages.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-xl text-gray-600 mb-4">No packages available for this destination</p>
          <div className="text-sm text-gray-500 mb-4">
            <p>Total domestic packages in database: {packages.filter(p => p.package_type === "domestic").length}</p>
            {packages.filter(p => p.package_type === "domestic").length > 0 && (
              <div className="mt-2">
                <p className="font-semibold">Available cities:</p>
                <ul className="list-disc list-inside">
                  {[...new Set(packages.filter(p => p.package_type === "domestic").map(p => p.city))].map((city, i) => (
                    <li key={i}>{city || 'No city specified'}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
          <Link to="/domestic" className="text-blue-600 hover:underline mt-4 inline-block">
            ← Back to Domestic Destinations
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
                src={pkg.image ? `http://localhost:8000/${pkg.image}` : "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?auto=format&fit=crop&w=800&q=60"} 
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
  );
}