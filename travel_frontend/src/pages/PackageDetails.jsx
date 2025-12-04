import { useParams, Link } from "react-router-dom";
import { domesticPackages } from "../data/packageData";
import { internationalPackages } from "../data/internationalData";
import { budgetPackages } from "../data/budgetData";



export default function PackageDetails() {
  const { id } = useParams();

  // Find the package by id
  const pkg =
  domesticPackages.find((p) => p.id === Number(id)) ||
  internationalPackages.find((p) => p.id === Number(id)) ||
  budgetPackages.find((p) => p.id === Number(id));


  // If package not found
  if (!pkg) {
    return (
      <div className="p-10 text-center text-2xl text-red-600">
        Package not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">

      {/* Banner */}
      <img
        src={pkg.image}
        alt={pkg.title}
        className="w-full h-96 object-cover rounded-xl shadow mb-8"
      />

      {/* Title */}
      <h1 className="text-4xl font-bold text-blue-900 mb-4">{pkg.title}</h1>

      {/* Price + Duration */}
      <p className="text-xl text-gray-700 mb-2">
        <strong>Price:</strong> ৳ {pkg.price}
      </p>
      <p className="text-lg text-gray-700 mb-6">
        <strong>Duration:</strong> {pkg.duration}
      </p>

      {/* Itinerary */}
      <h2 className="text-2xl font-semibold mb-3">Itinerary</h2>
      <ul className="list-disc ml-6 mb-6 text-gray-700">
        {pkg.itinerary.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Inclusion */}
      <h2 className="text-2xl font-semibold mb-3">Inclusions</h2>
      <ul className="list-disc ml-6 mb-6 text-gray-700">
        {pkg.inclusions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Exclusion */}
      <h2 className="text-2xl font-semibold mb-3">Exclusions</h2>
      <ul className="list-disc ml-6 mb-6 text-gray-700">
        {pkg.exclusions.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>

      {/* Booking Button */}
      <Link
        to={`/booking/${pkg.id}`}
        className="inline-block bg-green-600 text-white px-8 py-3 text-xl rounded-lg hover:bg-green-800 mt-8"
      >
        Book Now
      </Link>
    </div>
  );
}
