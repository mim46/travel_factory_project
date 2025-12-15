import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchPackages,
  createPackage as createPkg,
  updatePackage as updatePkg,
  deletePackage as deletePkg,
} from "../../redux/slices/packageSlice";

import PackageFormModal from "../components/PackageFormModal";

export default function Packages() {
  const dispatch = useDispatch();
  const { packages, loading } = useSelector((state) => state.packages);

  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);

  // Load packages
  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this package?")) return;
    await dispatch(deletePkg(id));
  };

  const handleFormSubmit = async (form) => {
    if (editData) {
      await dispatch(updatePkg({ id: editData.id, data: form }));
    } else {
      await dispatch(createPkg(form));
    }

    setShowModal(false);
    setEditData(null);
  };

  const filtered = packages.filter((p) =>
    p.title?.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#1C7DA2]">Manage Packages</h2>

        <button
          onClick={() => { setEditData(null); setShowModal(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow"
        >
          + Add Package
        </button>
      </div>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search packages..."
        className="w-1/3 p-2 border rounded mb-4"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />

      {/* Table */}
      <table className="w-full border-collapse shadow text-sm bg-white">
        <thead>
          <tr className="bg-blue-100">
            <th className="p-3 border">Name</th>
            <th className="p-3 border">Country</th>
            <th className="p-3 border">Price</th>
            <th className="p-3 border">Actions</th>
          </tr>
        </thead>

        <tbody>
          {filtered.map((p) => (
            <tr key={p.id} className="hover:bg-blue-50">
              <td className="p-3 border">{p.title}</td>
              <td className="p-3 border">{p.country}</td>
              <td className="p-3 border">৳ {p.price}</td>

              <td className="p-3 border flex gap-3">
                <button
                  className="text-blue-600"
                  onClick={() => {
                    setEditData(p);
                    setShowModal(true);
                  }}
                >
                  ✏️
                </button>

                <button
                  className="text-red-600"
                  onClick={() => handleDelete(p.id)}
                >
                  🗑️
                </button>
              </td>
            </tr>
          ))}

          {filtered.length === 0 && (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">
                No packages found.
              </td>
            </tr>
          )}
        </tbody>
      </table>

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
