import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPackages,
  createPackage as createPkg,
  updatePackage as updatePkg,
  deletePackage as deletePkg,
} from "../../redux/slices/packageSlice";

import PackageFormModal from "../components/PackageFormModal";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaPlus } from "react-icons/fa";

export default function Packages() {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Load packages
  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    await dispatch(deletePkg(id));
    dispatch(fetchPackages()); // Refresh list
  };

  const handleFormSubmit = async (form) => {
    try {
      if (editData) {
        await dispatch(updatePkg({ id: editData.id, data: form })).unwrap();
      } else {
        await dispatch(createPkg(form)).unwrap();
      }
      
      // Refresh packages list
      dispatch(fetchPackages());
      
      setShowModal(false);
      setEditData(null);
    } catch (error) {
      console.error("Error submitting package:", error);
      alert("Failed to save package. Please try again.");
    }
  };

  // Filter packages
  const filtered = packages.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                         p.country?.toLowerCase().includes(search.toLowerCase()) ||
                         p.city?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || p.package_type === filterType;
    return matchesSearch && matchesType;
  });

  // Count by type (lowercase)
  const domesticCount = packages.filter(p => p.package_type === "domestic").length;
  const internationalCount = packages.filter(p => p.package_type === "international").length;
  const budgetCount = packages.filter(p => p.package_type === "budget").length;

  // Helper function to capitalize
  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  if (loading) return <div className="p-6">Loading packages...</div>;

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Package Management</h2>
        <p className="text-gray-600">Manage all travel packages</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-blue-500">
          <p className="text-gray-600 text-sm">Total Packages</p>
          <p className="text-2xl font-bold text-blue-600">{packages.length}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-green-500">
          <p className="text-gray-600 text-sm">Domestic</p>
          <p className="text-2xl font-bold text-green-600">{domesticCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-purple-500">
          <p className="text-gray-600 text-sm">International</p>
          <p className="text-2xl font-bold text-purple-600">{internationalCount}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow border-l-4 border-orange-500">
          <p className="text-gray-600 text-sm">Budget</p>
          <p className="text-2xl font-bold text-orange-600">{budgetCount}</p>
        </div>
      </div>

      {/* Filters & Add Button */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search by title, country, or city..."
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter by Type */}
          <div className="relative">
            <FaFilter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="all">All Types</option>
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
              <option value="budget">Budget</option>
            </select>
          </div>
        </div>

        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="mt-4 px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition flex items-center gap-2"
        >
          <FaPlus /> Add New Package
        </button>
      </div>

      {/* Packages Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Package Name</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Type</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Location</th>
                <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {filtered.map((p) => (
                <tr key={p.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <img 
                        src={p.image || "https://via.placeholder.com/50"} 
                        alt={p.title} 
                        className="w-12 h-12 rounded object-cover"
                      />
                      <span className="font-medium text-gray-800">{p.title}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      p.package_type === 'domestic' ? 'bg-green-100 text-green-700' :
                      p.package_type === 'international' ? 'bg-purple-100 text-purple-700' :
                      'bg-orange-100 text-orange-700'
                    }`}>
                      {capitalize(p.package_type || 'budget')}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-700">
                    {p.city}, {p.country}
                  </td>
                  <td className="px-4 py-3 text-sm font-semibold text-gray-800">
                    ৳{p.price}
                  </td>
                  <td className="px-4 py-3">
                    <div className="grid grid-cols-2 gap-2 justify-items-center">
                      <button
                        onClick={() => {
                          setEditData(p);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-800 p-1"
                        title="Edit"
                      >
                        <FaEdit />
                      </button>
                      <button
                        onClick={() => handleDelete(p.id)}
                        className="text-red-600 hover:text-red-800 p-1"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {filtered.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500">
                    No packages found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <PackageFormModal
        show={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={handleFormSubmit}
        editData={editData}
      />
    </div>
  );
}