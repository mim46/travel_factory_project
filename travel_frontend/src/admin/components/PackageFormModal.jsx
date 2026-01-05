// Updated PackageFormModal.jsx with Image Upload Support
import { useState, useEffect } from "react";
import { FaTimes, FaImage, FaUpload } from "react-icons/fa";

export default function PackageFormModal({ show, onClose, onSubmit, editData }) {
  const [form, setForm] = useState({
    title: "",
    country: "",
    city: "",
    price: "",
    package_type: "domestic",
    duration: "",
    description: "",
    itinerary: "",
    inclusions: "",
    exclusions: "",
    image: ""
  });

  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (editData) {
      setForm(editData);
      setImagePreview(editData.image || "");
    } else {
      resetForm();
    }
  }, [editData, show]);

  const resetForm = () => {
    setForm({
      title: "",
      country: "",
      city: "",
      price: "",
      package_type: "domestic",
      duration: "",
      description: "",
      itinerary: "",
      inclusions: "",
      exclusions: "",
      image: ""
    });
    setImagePreview("");
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const value = e.target.value;
    setForm({ ...form, image: value });
    setImagePreview(value);
    if (errors.image) {
      setErrors({ ...errors, image: "" });
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.country.trim()) newErrors.country = "Country is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    if (!form.image.trim()) newErrors.image = "Image URL is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      alert("Please fill all required fields correctly");
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit(form);
      resetForm();
    } catch (error) {
      console.error("Submit error:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-4xl shadow-2xl max-h-[95vh] overflow-y-auto">
        
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {editData ? "✏️ Edit Package" : "➕ Add New Package"}
          </h2>
          <button 
            onClick={onClose} 
            className="text-white hover:bg-white/20 p-2 rounded-full transition"
          >
            <FaTimes size={20} />
          </button>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Package Title */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Package Title <span className="text-red-500">*</span>
              </label>
              <input 
                name="title" 
                value={form.title} 
                onChange={handleChange} 
                placeholder="e.g., Cox's Bazar Beach Paradise Tour" 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none transition ${
                  errors.title ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title}</p>}
            </div>

            {/* Package Type */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Package Type <span className="text-red-500">*</span>
              </label>
              <select 
                name="package_type" 
                value={form.package_type} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="domestic">🏠 Domestic</option>
                <option value="international">✈️ International</option>
                <option value="budget">💰 Budget</option>
              </select>
            </div>

            {/* Duration */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Duration <span className="text-red-500">*</span>
              </label>
              <input 
                name="duration" 
                value={form.duration} 
                onChange={handleChange} 
                placeholder="e.g., 3 Days 2 Nights" 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.duration ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.duration && <p className="text-red-500 text-xs mt-1">{errors.duration}</p>}
            </div>

            {/* Price */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Price (৳) <span className="text-red-500">*</span>
              </label>
              <input 
                name="price" 
                type="number"
                value={form.price} 
                onChange={handleChange} 
                placeholder="e.g., 15000" 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.price ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.price && <p className="text-red-500 text-xs mt-1">{errors.price}</p>}
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <input 
                name="country" 
                value={form.country} 
                onChange={handleChange} 
                placeholder="e.g., Bangladesh, Thailand, Malaysia" 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
            </div>

            {/* City/Place */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                City/Place {form.package_type === 'domestic' && <span className="text-red-500">*</span>}
              </label>
              <input 
                name="city" 
                value={form.city} 
                onChange={handleChange} 
                placeholder="e.g., coxsbazar, sajek, bandarban (lowercase, no spaces)" 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <p className="text-xs text-gray-500 mt-1">
                💡 For domestic packages, use lowercase without spaces (e.g., coxsbazar, saintmartin)
              </p>
            </div>

            {/* Image URL */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Image URL <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input 
                  name="image" 
                  value={form.image} 
                  onChange={handleImageChange} 
                  placeholder="https://example.com/image.jpg or paste image link" 
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 border rounded-lg p-2">
                  <p className="text-xs text-gray-600 mb-2">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
                    onError={() => setImagePreview("")}
                  />
                </div>
              )}
            </div>

            {/* Description */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea 
                name="description" 
                value={form.description} 
                onChange={handleChange} 
                placeholder="Write a detailed description about the package, attractions, activities..." 
                rows="4"
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none ${
                  errors.description ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description}</p>}
            </div>

            {/* Itinerary */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                📋 Itinerary (Day-wise plan)
              </label>
              <textarea 
                name="itinerary" 
                value={form.itinerary} 
                onChange={handleChange} 
                placeholder="Day 1: Arrival and hotel check-in, evening beach walk&#10;Day 2: Beach activities, water sports&#10;Day 3: Departure after breakfast" 
                rows="5"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">📝 Optional: Enter day-wise itinerary</p>
            </div>

            {/* Inclusions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                ✅ Inclusions (What's included)
              </label>
              <textarea 
                name="inclusions" 
                value={form.inclusions} 
                onChange={handleChange} 
                placeholder="• 3-star hotel accommodation&#10;• Breakfast, lunch, dinner&#10;• Professional tour guide&#10;• AC transport" 
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">📝 Optional: List what's included</p>
            </div>

            {/* Exclusions */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                ❌ Exclusions (What's NOT included)
              </label>
              <textarea 
                name="exclusions" 
                value={form.exclusions} 
                onChange={handleChange} 
                placeholder="• Personal expenses&#10;• Travel insurance&#10;• Additional activities not mentioned&#10;• Tips and gratuities" 
                rows="4"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
              />
              <p className="text-xs text-gray-500 mt-1">📝 Optional: List what's NOT included</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-3 mt-8 pt-6 border-t">
            <button 
              onClick={onClose} 
              disabled={isSubmitting}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-semibold disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              className="px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg hover:from-blue-700 hover:to-blue-800 transition font-semibold shadow-lg disabled:opacity-50 flex items-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                  {editData ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  {editData ? "💾 Update Package" : "➕ Create Package"}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}