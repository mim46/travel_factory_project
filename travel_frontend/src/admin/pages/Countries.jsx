import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchCountries, createCountry, updateCountry, deleteCountry } from '../../redux/slices/countrySlice';
import { FaPlus, FaEdit, FaTrash, FaImage, FaTimes } from 'react-icons/fa';
import toast from 'react-hot-toast';

const Countries = () => {
  const dispatch = useDispatch();
  const { countries, loading } = useSelector((state) => state.countries);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: null
  });

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({ ...formData, image: file });
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const data = new FormData();
    data.append('name', formData.name);
    data.append('description', formData.description);
    if (formData.image) {
      data.append('image', formData.image);
    }

    try {
      if (editMode) {
        await dispatch(updateCountry({ id: selectedCountry.id, data })).unwrap();
        toast.success('Country updated successfully');
      } else {
        await dispatch(createCountry(data)).unwrap();
        toast.success('Country created successfully');
      }
      handleCloseModal();
      dispatch(fetchCountries());
    } catch (error) {
      toast.error(error || 'Operation failed');
    }
  };

  const handleEdit = (country) => {
    setEditMode(true);
    setSelectedCountry(country);
    setFormData({
      name: country.name,
      description: country.description || '',
      image: null
    });
    if (country.image) {
      setImagePreview(`http://localhost:8000/${country.image}`);
    }
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this country?')) {
      try {
        await dispatch(deleteCountry(id)).unwrap();
        toast.success('Country deleted successfully');
      } catch (error) {
        toast.error(error || 'Failed to delete country');
      }
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditMode(false);
    setSelectedCountry(null);
    setFormData({ name: '', description: '', image: null });
    setImagePreview(null);
  };

  const handleAddNew = () => {
    setEditMode(false);
    setSelectedCountry(null);
    setFormData({ name: '', description: '', image: null });
    setImagePreview(null);
    setShowModal(true);
  };

  return (
    <div>
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Countries</h1>
          <p className="text-gray-600 text-sm mt-1">Manage countries for your packages</p>
        </div>
        <button
          onClick={handleAddNew}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
        >
          <FaPlus /> Add Country
        </button>
      </div>

      {/* Countries Grid */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-10 w-10 border-4 border-gray-300 border-t-blue-600"></div>
          <p className="text-gray-600 mt-3">Loading countries...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {countries?.map((country) => (
            <div key={country.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition">
              <div className="relative h-48">
                {country.image ? (
                  <img
                    src={`http://localhost:8000/${country.image}`}
                    alt={country.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
                    <FaImage className="text-6xl text-blue-300" />
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{country.name}</h3>
                <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                  {country.description || 'No description'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-xs text-gray-500">
                    {country.packages_count || 0} packages
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(country)}
                      className="text-blue-600 hover:bg-blue-100 p-2 rounded-lg transition"
                      title="Edit"
                    >
                      <FaEdit />
                    </button>
                    <button
                      onClick={() => handleDelete(country.id)}
                      className="text-red-600 hover:bg-red-100 p-2 rounded-lg transition"
                      title="Delete"
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center p-6 border-b sticky top-0 bg-white">
              <h2 className="text-xl font-bold text-gray-800">
                {editMode ? 'Edit Country' : 'Add New Country'}
              </h2>
              <button
                onClick={handleCloseModal}
                className="text-gray-500 hover:text-gray-700 text-2xl"
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6">
              {/* Name */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Country Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Italy"
                />
              </div>

              {/* Image */}
              <div className="mb-4">
                <label className="block text-gray-700 font-semibold mb-2">
                  Country Image
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
                {imagePreview && (
                  <div className="mt-3">
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-full h-48 object-cover rounded-lg"
                    />
                  </div>
                )}
              </div>

              {/* Description */}
              <div className="mb-6">
                <label className="block text-gray-700 font-semibold mb-2">
                  Description
                </label>
                <textarea
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows="4"
                  className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief description about the country..."
                ></textarea>
              </div>

              {/* Buttons */}
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={handleCloseModal}
                  className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                >
                  {editMode ? 'Update Country' : 'Create Country'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Countries;
