import { Link } from "react-router-dom";
import { domesticPackages } from "../../data/packageData";

export default function Sylhet() {
  const packages = domesticPackages.filter(p => p.place === "sylhet");

  return (
    <div className="min-h-screen bg-blue-50 py-10 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-8">Sylhet Packages</h1>

      <div className="grid md:grid-cols-2 gap-8">
        {packages.map((pkg) => (
          <div key={pkg.id} className="bg-white shadow rounded-xl overflow-hidden hover:shadow-xl transition">
<img src={pkg.image} alt="" className="w-full h-60 object-cover" />
            <div className="p-6">
              <h2 className="text-2xl font-semibold mb-2">{pkg.title}</h2>
              <p><strong>Price:</strong> ৳ {pkg.price}</p>
              <p className="mb-4"><strong>Duration:</strong> {pkg.duration}</p>
              <Link to={`/package-details/${pkg.id}`} className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-800">
                View Details
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
