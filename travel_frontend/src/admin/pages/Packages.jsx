import { useState } from "react";
import { FaTrash, FaEdit, FaSearch } from "react-icons/fa";

export default function Packages() {
  const [search, setSearch] = useState("");

  const packages = [
    { id: 1, name: "Thailand – 4 Days", price: 32000, category: "International" },
    { id: 2, name: "Dubai – 5 Days", price: 55000, category: "International" },
    { id: 3, name: "Bali – 4 Days", price: 45000, category: "International" },
    { id: 4, name: "Cox’s Bazar – 3 Days", price: 8500, category: "Domestic" },
    { id: 5, name: "Saint Martin – 3 Days", price: 12000, category: "Domestic" },
  ];

  const filteredPackages = packages.filter((p) =>
    p.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="p-8">
      <h1 className="text-3xl font-semibold mb-6">Manage Packages</h1>

      {/* Search Input */}
      <div className="relative w-72 mb-5">
        <FaSearch className="absolute left-3 top-3 text-gray-500" />
        <input
          type="text"
          placeholder="Search packages..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-600 text-white">
            <tr>
              <th className="py-3 px-4 text-left">Package Name</th>
              <th className="py-3 px-4 text-left">Category</th>
              <th className="py-3 px-4 text-left">Price</th>
              <th className="py-3 px-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredPackages.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-6 text-center text-gray-500">
                  No packages found
                </td>
              </tr>
            ) : (
              filteredPackages.map((pkg) => (
                <tr key={pkg.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-4">{pkg.name}</td>
                  <td className="py-3 px-4">{pkg.category}</td>
                  <td className="py-3 px-4">৳ {pkg.price}</td>

                  <td className="py-3 px-4 text-center">
                    <button className="text-blue-600 hover:text-blue-800 mx-2">
                      <FaEdit size={18} />
                    </button>
                    <button className="text-red-600 hover:text-red-800 mx-2">
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
