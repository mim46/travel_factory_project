import { Link } from "react-router-dom";
import { domesticPackages } from "../../data/packageData";

export default function Coxsbazar() {
  // Filter only Cox's Bazar packages from domesticPackages
  const packages = domesticPackages.filter(
    (pkg) => pkg.place.toLowerCase() === "coxsbazar"
  );

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">
        Cox's Bazar Packages
      </h1>

      <div className="grid md:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <div
            key={pkg.id}
            className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl transition"
          >
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-60 object-cover"
            />

            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{pkg.title}</h2>
              <p className="text-gray-700">
                <strong>Price:</strong> ৳ {pkg.price}
              </p>
              <p className="text-gray-700 mb-4">
                <strong>Duration:</strong> {pkg.duration}
              </p>

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
    </div>
  );
}
