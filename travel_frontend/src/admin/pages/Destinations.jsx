import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDestinations,
  createDestination,
  updateDestination,
  deleteDestination,
} from "../../redux/slices/destinationSlice";

export default function Destinations() {
  const dispatch = useDispatch();
  const { destinations, loading } = useSelector((state) => state.destinations);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    name: "",
    country: "",
    type: "domestic",
    description: "",
    image: "",
    is_popular: false,
    is_featured: false,
  });

  useEffect(() => {
    dispatch(fetchDestinations());
  }, [dispatch]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (editData) {
      await dispatch(updateDestination({ id: editData.id, data: form }));
    } else {
      await dispatch(createDestination(form));
    }

    resetForm();
    setShowModal(false);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this destination?")) return;
    await dispatch(deleteDestination(id));
  };

  const handleEdit = (destination) => {
    setEditData(destination);
    setForm({
      name: destination.name,
      country: destination.country,
      type: destination.type,
      description: destination.description || "",
      image: destination.image || "",
      is_popular: destination.is_popular,
      is_featured: destination.is_featured,
    });
    setShowModal(true);
  };

  const resetForm = () => {
    setEditData(null);
    setForm({
      name: "",
      country: "",
      type: "domestic",
      description: "",
      image: "",
      is_popular: false,
      is_featured: false,
    });
  };

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#1C7DA2]">Manage Destinations</h2>

        <button
          onClick={() => {
            resetForm();
            setShowModal(true);
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
        >
          + Add Destination
        </button>
      </div>

      {/* Destinations Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-blue-100">
            <tr>
              <th className="p-3 text-left">Name</th>
              <th className="p-3 text-left">Country</th>
              <th className="p-3 text-left">Type</th>
              <th className="p-3 text-center">Popular</th>
              <th className="p-3 text-center">Featured</th>
              <th className="p-3 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {destinations.map((dest) => (
              <tr key={dest.id} className="border-b hover:bg-blue-50">
                <td className="p-3">{dest.name}</td>
                <td className="p-3">{dest.country}</td>
                <td className="p-3">
                  <span
                    className={`px-2 py-1 rounded text-xs ${
                      dest.type === "domestic"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {dest.type}
                  </span>
                </td>
                <td className="p-3 text-center">
                  {dest.is_popular ? "✅" : "❌"}
                </td>
                <td className="p-3 text-center">
                  {dest.is_featured ? "✅" : "❌"}
                </td>
                <td className="p-3 text-center">
                  <button
                    onClick={() => handleEdit(dest)}
                    className="text-blue-600 hover:underline mr-3"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(dest.id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {destinations.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            No destinations found. Add your first destination!
          </div>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {editData ? "Edit Destination" : "Add New Destination"}
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Destination Name (e.g., Cox's Bazar)"
                className="w-full p-2 border rounded"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />

              <input
                type="text"
                placeholder="Country"
                className="w-full p-2 border rounded"
                value={form.country}
                onChange={(e) => setForm({ ...form, country: e.target.value })}
                required
              />

              <select
                className="w-full p-2 border rounded"
                value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
              >
                <option value="domestic">Domestic</option>
                <option value="international">International</option>
              </select>

              <textarea
                placeholder="Description"
                className="w-full p-2 border rounded"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              />

              <input
                type="text"
                placeholder="Image URL"
                className="w-full p-2 border rounded"
                value={form.image}
                onChange={(e) => setForm({ ...form, image: e.target.value })}
              />

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_popular}
                  onChange={(e) => setForm({ ...form, is_popular: e.target.checked })}
                />
                Mark as Popular
              </label>

              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.is_featured}
                  onChange={(e) => setForm({ ...form, is_featured: e.target.checked })}
                />
                Mark as Featured
              </label>

              <div className="flex gap-3">
                <button
                  type="submit"
                  className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
                >
                  {editData ? "Update" : "Create"}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowModal(false);
                    resetForm();
                  }}
                  className="flex-1 bg-gray-300 py-2 rounded hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
