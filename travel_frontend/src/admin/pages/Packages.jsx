// Updated Packages.jsx with improved layout
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPackages,
  createPackage as createPkg,
  updatePackage as updatePkg,
  deletePackage as deletePkg,
} from "../../redux/slices/packageSlice";

import PackageFormModal from "../components/PackageFormModal";
import { FaSearch, FaFilter, FaEdit, FaTrash, FaPlus, FaEye, FaSpinner, FaTimes, FaMapMarkerAlt, FaClock } from "react-icons/fa";

export default function Packages() {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);

  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [viewData, setViewData] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(null);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("⚠️ Are you sure you want to delete this package? This action cannot be undone.")) return;
    
    setDeleteLoading(id);
    try {
      await dispatch(deletePkg(id)).unwrap();
      alert("✅ Package deleted successfully!");
      dispatch(fetchPackages());
    } catch (error) {
      alert("❌ Failed to delete package: " + error);
    } finally {
      setDeleteLoading(null);
    }
  };

  const handleFormSubmit = async (form) => {
    try {
      if (editData) {
        await dispatch(updatePkg({ id: editData.id, data: form })).unwrap();
        alert("✅ Package updated successfully!");
      } else {
        await dispatch(createPkg(form)).unwrap();
        alert("✅ Package created successfully!");
      }
      
      dispatch(fetchPackages());
      setShowModal(false);
      setEditData(null);
    } catch (error) {
      console.error("Error submitting package:", error);
      alert("❌ Failed to save package: " + (error || "Unknown error"));
      throw error;
    }
  };

  const handleView = (pkg) => {
    setViewData(pkg);
    setShowViewModal(true);
  };

  const filtered = packages.filter((p) => {
    const matchesSearch = p.title?.toLowerCase().includes(search.toLowerCase()) ||
                         p.country?.toLowerCase().includes(search.toLowerCase()) ||
                         p.city?.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "all" || p.package_type === filterType;
    return matchesSearch && matchesType;
  });

  const domesticCount = packages.filter(p => p.package_type === "domestic").length;
  const internationalCount = packages.filter(p => p.package_type === "international").length;
  const budgetCount = packages.filter(p => p.package_type === "budget").length;

  const capitalize = (str) => {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1);
  };

  const parseList = (str) => {
    if (!str) return [];
    if (Array.isArray(str)) return str;
    return str.split('\n').filter(item => item.trim() !== '');
  };

  return (
    <div className="p-6">
      {/* Header with Add Button */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">📦 Package Management</h2>
          <p className="text-gray-600">Manage all travel packages for your customers</p>
        </div>
        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg shadow-lg hover:from-blue-700 hover:to-blue-800 transition flex items-center gap-2 font-semibold"
        >
          <FaPlus /> Add New Package
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">Total Packages</p>
          <p className="text-3xl font-bold">{packages.length}</p>
        </div>
        <div className="bg-gradient-to-br from-green-500 to-green-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">🏠 Domestic</p>
          <p className="text-3xl font-bold">{domesticCount}</p>
        </div>
        <div className="bg-gradient-to-br from-purple-500 to-purple-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">✈️ International</p>
          <p className="text-3xl font-bold">{internationalCount}</p>
        </div>
        <div className="bg-gradient-to-br from-orange-500 to-orange-600 p-5 rounded-xl shadow-lg text-white">
          <p className="text-white/80 text-sm mb-1">💰 Budget</p>
          <p className="text-3xl font-bold">{budgetCount}</p>
        </div>
      </div>

      {/* Search & Filter */}
      <div className="bg-white p-5 rounded-xl shadow-md mb-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="md:col-span-2 relative">
            <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="🔍 Search by title, country, or city..."
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Filter by Type */}
          <div className="relative">
            <FaFilter className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="w-full pl-11 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none appearance-none"
            >
              <option value="all">All Types</option>
              <option value="domestic">🏠 Domestic</option>
              <option value="international">✈️ International</option>
              <option value="budget">💰 Budget</option>
            </select>
          </div>
        </div>
      </div>

      {/* Loading State */}
      {loading && packages.length === 0 && (
        <div className="flex justify-center items-center h-64">
          <div className="text-center">
            <FaSpinner className="animate-spin text-4xl text-blue-600 mx-auto mb-4" />
            <p className="text-gray-600">Loading packages...</p>
          </div>
        </div>
      )}

      {/* Packages Table */}
      {!loading || packages.length > 0 ? (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-gray-50 to-gray-100 border-b-2 border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Package Details</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Type</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Location</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Duration</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Price</th>
                  <th className="px-6 py-4 text-center text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filtered.map((p) => (
                  <tr key={p.id} className="hover:bg-blue-50 transition">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img 
                          src={p.image || "https://via.placeholder.com/60"} 
                          alt={p.title} 
                          className="w-16 h-16 rounded-lg object-cover shadow"
                        />
                        <div>
                          <p className="font-semibold text-gray-800">{p.title}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {p.description?.substring(0, 50)}...
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                        p.package_type === 'domestic' ? 'bg-green-100 text-green-700' :
                        p.package_type === 'international' ? 'bg-purple-100 text-purple-700' :
                        'bg-orange-100 text-orange-700'
                      }`}>
                        {p.package_type === 'domestic' ? '🏠 ' : p.package_type === 'international' ? '✈️ ' : '💰 '}
                        {capitalize(p.package_type || 'budget')}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      <p className="font-medium">{p.city || '-'}</p>
                      <p className="text-xs text-gray-500">{p.country}</p>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">{p.duration}</td>
                    <td className="px-6 py-4 text-sm font-bold text-blue-600">
                      ৳{Number(p.price).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => handleView(p)}
                          className="p-2 text-green-600 hover:bg-green-100 rounded-lg transition"
                          title="View Package"
                        >
                          <FaEye size={16} />
                        </button>
                        <button
                          onClick={() => {
                            setEditData(p);
                            setShowModal(true);
                          }}
                          className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition"
                          title="Edit Package"
                        >
                          <FaEdit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(p.id)}
                          disabled={deleteLoading === p.id}
                          className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition disabled:opacity-50"
                          title="Delete Package"
                        >
                          {deleteLoading === p.id ? (
                            <FaSpinner className="animate-spin" size={16} />
                          ) : (
                            <FaTrash size={16} />
                          )}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan="6" className="p-12 text-center">
                      <div className="text-gray-400">
                        <FaSearch className="text-5xl mx-auto mb-4 opacity-50" />
                        <p className="text-lg font-semibold">No packages found</p>
                        <p className="text-sm mt-2">Try adjusting your search or filter</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      ) : null}

      {/* Edit/Create Modal */}
      <PackageFormModal
        show={showModal}
        onClose={() => {
          setShowModal(false);
          setEditData(null);
        }}
        onSubmit={handleFormSubmit}
        editData={editData}
      />

      {/* View Package Modal */}
      {showViewModal && viewData && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50 p-4" onClick={() => setShowViewModal(false)}>
          <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[95vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <div className="relative">
              <img 
                src={viewData.image || "https://via.placeholder.com/800x400"} 
                alt={viewData.title}
                className="w-full h-64 object-cover rounded-t-2xl"
              />
              <button 
                onClick={() => setShowViewModal(false)} 
                className="absolute top-4 right-4 bg-white text-gray-700 hover:bg-red-500 hover:text-white p-3 rounded-full transition shadow-lg"
              >
                <FaTimes size={20} />
              </button>
              <div className="absolute bottom-4 left-4">
                <span className={`px-4 py-2 rounded-full text-sm font-bold shadow-lg ${
                  viewData.package_type === 'domestic' ? 'bg-green-500 text-white' :
                  viewData.package_type === 'international' ? 'bg-purple-500 text-white' :
                  'bg-orange-500 text-white'
                }`}>
                  {viewData.package_type === 'domestic' ? '🏠 ' : viewData.package_type === 'international' ? '✈️ ' : '💰 '}
                  {capitalize(viewData.package_type)}
                </span>
              </div>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-3xl font-bold text-gray-800 mb-2">{viewData.title}</h2>
                  <div className="flex items-center gap-2 text-gray-600">
                    <FaMapMarkerAlt className="text-blue-500" />
                    <span>{viewData.city ? `${viewData.city}, ` : ''}{viewData.country}</span>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-600 mb-1">Starting from</p>
                  <p className="text-3xl font-bold text-blue-600">৳{Number(viewData.price).toLocaleString()}</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-3 bg-blue-50 p-4 rounded-lg">
                  <FaClock className="text-blue-600 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600">Duration</p>
                    <p className="font-semibold text-gray-800">{viewData.duration}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 bg-green-50 p-4 rounded-lg">
                  <FaMapMarkerAlt className="text-green-600 text-2xl" />
                  <div>
                    <p className="text-sm text-gray-600">Package ID</p>
                    <p className="font-semibold text-gray-800">#{viewData.id}</p>
                  </div>
                </div>
              </div>

              {viewData.description && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">📝 Description</h3>
                  <p className="text-gray-700 leading-relaxed">{viewData.description}</p>
                </div>
              )}

              {viewData.itinerary && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">📋 Itinerary</h3>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {parseList(viewData.itinerary).map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-blue-600 font-bold min-w-[24px]">{index + 1}.</span>
                          <span className="text-gray-700">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {viewData.inclusions && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">✅ What's Included</h3>
                  <div className="bg-green-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {parseList(viewData.inclusions).map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-green-600 text-lg">✓</span>
                          <span className="text-gray-700">{item.replace(/^[•\-*]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              {viewData.exclusions && (
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-800 mb-3 border-b pb-2">❌ What's NOT Included</h3>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <ul className="space-y-2">
                      {parseList(viewData.exclusions).map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <span className="text-red-600 text-lg">✗</span>
                          <span className="text-gray-700">{item.replace(/^[•\-*]\s*/, '')}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              )}

              <div className="flex justify-end mt-8">
                <button 
                  onClick={() => setShowViewModal(false)} 
                  className="px-8 py-3 bg-gradient-to-r from-gray-600 to-gray-700 text-white rounded-lg hover:from-gray-700 hover:to-gray-800 transition font-semibold shadow-lg"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}