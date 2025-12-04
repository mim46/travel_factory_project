import { domesticPackages } from "../../data/packageData";
import { Link } from "react-router-dom";

export default function SaintMartin() {
  const packages = domesticPackages.filter(
    (p) => p.place === "saintmartin"
  );

  return (
    <div className="min-h-screen bg-white py-12 px-6">
      <h1 className="text-4xl font-bold text-blue-900 text-center mb-10">
        Saint Martin Tour Packages
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 max-w-5xl mx-auto">
        {packages.map((pkg) => (
          <Link
            key={pkg.id}
            to={`/package-details/${pkg.id}`}
            className="bg-blue-50 rounded-xl shadow hover:shadow-xl overflow-hidden transition"
          >
            <img
              src={pkg.image}
              alt={pkg.title}
              className="w-full h-52 object-cover"
            />

            <div className="p-4 space-y-1">
              <h2 className="text-xl font-bold text-blue-900">{pkg.title}</h2>
              <p className="text-gray-700">Duration: {pkg.duration}</p>
              <p className="text-blue-700 font-semibold text-right">
                ৳ {pkg.price}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
