import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaEdit, FaTrash, FaPlus, FaImage } from "react-icons/fa";
import { fetchCountries, createCountry, updateCountry, deleteCountry } from "../../redux/slices/countrySlice";

const BASE_URL = "http://127.0.0.1:8000";

export default function Destinations() {
  const dispatch = useDispatch();
  const { countries, loading } = useSelector((state) => state.countries);

  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [form, setForm] = useState({
    name: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleAddNew = () => {
    setEditData(null);
    setForm({ name: "" });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleEdit = (country) => {
    setEditData(country);
    setForm({ 
      name: country.name
    });
    setImagePreview(country.image ? `${BASE_URL}/${country.image}` : "");
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this country? This will also affect related packages.")) return;
    dispatch(deleteCountry(id));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", form.name);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (editData) {
      await dispatch(updateCountry({ id: editData.id, data: formData }));
    } else {
      await dispatch(createCountry(formData));
    }

    setShowModal(false);
    dispatch(fetchCountries());
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Destinations (Countries)</h1>
        <button
          onClick={handleAddNew}
          className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
        >
          <FaPlus /> Add Country
        </button>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : countries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">No countries found. Add your first destination!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries.map((country) => (
            <div key={country.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              {country.image ? (
                <img 
                  src={`${BASE_URL}/${country.image}`} 
                  alt={country.name} 
                  className="w-full h-48 object-cover" 
                />
              ) : (
                <div className="w-full h-48 bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                  <FaImage className="text-white text-6xl opacity-50" />
                </div>
              )}
              <div className="p-4">
                <h3 className="font-semibold text-xl mb-2">{country.name}</h3>
                <div className="flex items-center justify-between text-sm text-gray-500 mb-3">
                  <span>{country.packages_count || 0} Packages</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(country)}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(country.id)}
                    className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white px-3 py-2 rounded hover:bg-red-600 transition"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
            <h2 className="text-2xl font-bold mb-4">{editData ? "Edit Country" : "Add New Country"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Country Name *</label>
                  <input
                    type="text"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                    placeholder="e.g., Bangladesh, Thailand, Malaysia"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Country Image {editData && "(Leave empty to keep current image)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border rounded-lg"
                    required={!editData}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    This image will be displayed on the Destinations page and search dropdown
                  </p>
                  {imagePreview && (
                    <img src={imagePreview} alt="Preview" className="mt-4 w-full h-48 object-cover rounded-lg" />
                  )}
                </div>
              </div>
              <div className="flex gap-4 mt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="flex-1 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                >
                  {loading ? "Processing..." : editData ? "Update Country" : "Add Country"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 bg-gray-300 text-gray-700 px-6 py-3 rounded-lg hover:bg-gray-400 transition"
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
