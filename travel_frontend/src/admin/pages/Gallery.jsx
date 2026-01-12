import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaPlus, FaEdit, FaTrash } from "react-icons/fa";
import { fetchGalleries, createGallery, updateGallery, deleteGallery } from "../../redux/slices/gallerySlice";

const BASE_URL = "http://127.0.0.1:8000";

export default function Gallery() {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.gallery);
  const [showModal, setShowModal] = useState(false);
  const [editData, setEditData] = useState(null);
  const [filterCategory, setFilterCategory] = useState("all");
  const [form, setForm] = useState({
    category: "travel_experiences"
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  useEffect(() => {
    dispatch(fetchGalleries(filterCategory));
  }, [dispatch, filterCategory]);

  const handleAddNew = () => {
    setEditData(null);
    setForm({ category: "travel_experiences" });
    setImageFile(null);
    setImagePreview("");
    setShowModal(true);
  };

  const handleEdit = (image) => {
    setEditData(image);
    setForm({ category: image.category });
    setImagePreview(`${BASE_URL}/${image.image}`);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this image?")) return;
    dispatch(deleteGallery(id));
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
    formData.append("category", form.category);
    
    if (imageFile) {
      formData.append("image", imageFile);
    }

    if (editData) {
      await dispatch(updateGallery({ id: editData.id, formData }));
    } else {
      await dispatch(createGallery(formData));
    }

    setShowModal(false);
    dispatch(fetchGalleries(filterCategory));
  };

  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Gallery Management</h1>
        <div className="flex gap-4 items-center">
          <select
            value={filterCategory}
            onChange={(e) => setFilterCategory(e.target.value)}
            className="p-3 border rounded-lg"
          >
            <option value="all">All Categories</option>
            <option value="travel_experiences">Travel Experiences</option>
            <option value="travel_factory">Travel Factory</option>
            <option value="events_memories">Events & Memories</option>
          </select>
          <button
            onClick={handleAddNew}
            className="flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
          >
            <FaPlus /> Add Image
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500">Loading...</p>
        </div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl shadow-md">
          <p className="text-gray-500 text-lg">No images found. Add your first image!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {galleries.map((image) => (
            <div key={image.id} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition">
              <img 
                src={`${BASE_URL}/${image.image}`} 
                alt={image.category} 
                className="w-full h-48 object-cover" 
              />
              <div className="p-4">
                <div className="mb-3">
                  <span className="inline-block bg-blue-100 text-blue-600 text-sm font-semibold px-3 py-1 rounded">
                    {image.category === 'travel_experiences' ? 'Travel Experiences' : 
                     image.category === 'travel_factory' ? 'Travel Factory' : 
                     image.category === 'events_memories' ? 'Events & Memories' : image.category}
                  </span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(image)}
                    className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 text-white px-3 py-2 rounded hover:bg-yellow-600 transition"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(image.id)}
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
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <h2 className="text-2xl font-bold mb-4">{editData ? "Edit Image" : "Add New Image"}</h2>
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold mb-2">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full p-3 border rounded-lg"
                  >
                    <option value="travel_experiences">Travel Experiences</option>
                    <option value="travel_factory">Travel Factory</option>
                    <option value="events_memories">Events & Memories</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold mb-2">
                    Image {editData && "(Leave empty to keep current image)"}
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="w-full p-3 border rounded-lg"
                    required={!editData}
                  />
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
                  {loading ? "Processing..." : editData ? "Update Image" : "Add Image"}
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
