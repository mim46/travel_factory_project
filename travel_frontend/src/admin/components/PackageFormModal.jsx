// Updated PackageFormModal.jsx with Image Upload Support
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../../redux/slices/countrySlice";
import { fetchPlaces } from "../../redux/slices/placeSlice";
import { FaTimes, FaImage, FaUpload } from "react-icons/fa";

export default function PackageFormModal({ show, onClose, onSubmit, editData }) {
  const dispatch = useDispatch();
  const { countries } = useSelector((state) => state.countries);
  const { places } = useSelector((state) => state.places);
  
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
    image: "",
    tour_type: "group",
    min_persons: "",
    max_persons: "",
    booking_deadline_days: "",
    advance_percentage: "30",
    available_dates: "",
    country_id: "",
    place_id: "",
    is_latest: false,
    is_recommended: false,
    is_featured: false
  });

  const [imagePreview, setImagePreview] = useState("");
  const [imageFile, setImageFile] = useState(null);
  const [countryImagePreview, setCountryImagePreview] = useState("");
  const [countryImageFile, setCountryImageFile] = useState(null);
  const [placeImagePreview, setPlaceImagePreview] = useState("");
  const [placeImageFile, setPlaceImageFile] = useState(null);
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    dispatch(fetchCountries());
    dispatch(fetchPlaces());
  }, [dispatch]);

  useEffect(() => {
    if (editData) {
      const formData = { ...editData };
      
      // Convert available_dates from JSON to string for textarea
      if (formData.available_dates) {
        try {
          const datesArray = typeof formData.available_dates === 'string' 
            ? JSON.parse(formData.available_dates) 
            : formData.available_dates;
          formData.available_dates = datesArray.join('\n');
        } catch (e) {
          formData.available_dates = "";
        }
      }
      
      setForm(formData);
      // Set image preview from backend URL
      if (editData.image) {
        setImagePreview(`http://localhost:8000/${editData.image}`);
      }
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
      image: "",
      tour_type: "group",
      min_persons: "",
      max_persons: "",
      booking_deadline_days: "",
      advance_percentage: "30",
      available_dates: "",
      country_id: "",
      place_id: "",
      is_latest: false,
      is_recommended: false,
      is_featured: false
    });
    setImagePreview("");
    setImageFile(null);
    setCountryImagePreview("");
    setCountryImageFile(null);
    setPlaceImagePreview("");
    setPlaceImageFile(null);
    setErrors({});
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const updates = { [name]: type === 'checkbox' ? checked : value };
    
    // When country_id changes, also update country name
    if (name === 'country_id') {
      const selectedCountry = countries?.find(c => c.id == value);
      updates.country = selectedCountry?.name || '';
    }
    
    // When place_id changes, also update city name
    if (name === 'place_id') {
      const selectedPlace = places?.find(p => p.id == value);
      updates.city = selectedPlace?.name || '';
    }
    
    setForm({ ...form, ...updates });
    // Clear error for this field
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      if (errors.image) {
        setErrors({ ...errors, image: "" });
      }
    }
  };

  const handleCountryImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setCountryImageFile(file);
      setCountryImagePreview(URL.createObjectURL(file));
    }
  };

  const handlePlaceImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPlaceImageFile(file);
      setPlaceImagePreview(URL.createObjectURL(file));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!form.title.trim()) newErrors.title = "Title is required";
    if (!form.country_id && !form.country.trim()) newErrors.country = "Country is required";
    if (!form.price || form.price <= 0) newErrors.price = "Valid price is required";
    if (!form.duration.trim()) newErrors.duration = "Duration is required";
    if (!form.description.trim()) newErrors.description = "Description is required";
    
    // Image validation - required for new packages, optional for edit
    if (!editData && !imageFile) {
      newErrors.image = "Image is required";
    }

    // Group tour validations
    if (form.tour_type === "group") {
      if (!form.min_persons || form.min_persons <= 0) {
        newErrors.min_persons = "Minimum persons is required for group tours";
      }
      if (!form.max_persons || form.max_persons <= 0) {
        newErrors.max_persons = "Maximum persons is required for group tours";
      }
      if (form.min_persons && form.max_persons && parseInt(form.min_persons) > parseInt(form.max_persons)) {
        newErrors.max_persons = "Maximum must be greater than minimum";
      }
      if (!form.booking_deadline_days || form.booking_deadline_days < 0) {
        newErrors.booking_deadline_days = "Booking deadline is required";
      }
      if (!form.advance_percentage || form.advance_percentage < 0 || form.advance_percentage > 100) {
        newErrors.advance_percentage = "Valid advance percentage (0-100) is required";
      }
      if (!form.available_dates || !form.available_dates.trim()) {
        newErrors.available_dates = "Available dates are required for group tours";
      }
    }

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
      // Prepare FormData for file upload
      const formData = new FormData();
      
      // Add all form fields
      Object.keys(form).forEach(key => {
        if (key !== 'image' && form[key] !== null && form[key] !== '') {
          formData.append(key, form[key]);
        }
      });
      
      // Handle image
      if (imageFile) {
        formData.append('image', imageFile);
      }
      
      // Handle country image (if new country)
      if (countryImageFile && form.country && !form.country_id) {
        formData.append('country_image', countryImageFile);
      }
      
      // Handle place image (send if uploaded)
      if (placeImageFile) {
        formData.append('place_image', placeImageFile);
      }
      
      // Convert available_dates to JSON array if group tour
      if (form.tour_type === "group" && form.available_dates) {
        const datesArray = form.available_dates
          .split('\n')
          .map(d => d.trim())
          .filter(d => d);
        formData.set('available_dates', JSON.stringify(datesArray));
      }
      
      await onSubmit(formData);
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

            {/* Tour Type */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                🎯 Tour Type <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-4">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="tour_type" 
                    value="group" 
                    checked={form.tour_type === "group"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">👥 Group Tour</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="radio" 
                    name="tour_type" 
                    value="individual" 
                    checked={form.tour_type === "individual"}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span className="text-sm font-medium">🧳 Individual Tour</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Group tours have fixed dates & capacity. Individual tours are flexible.
              </p>
            </div>

            {/* Package Tags */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                ⭐ Package Tags
              </label>
              <div className="flex gap-6">
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_latest" 
                    checked={form.is_latest || false}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm font-medium">🆕 Latest Package</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_recommended" 
                    checked={form.is_recommended || false}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm font-medium">⭐ Recommended Package</span>
                </label>
                <label className="flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    name="is_featured" 
                    checked={form.is_featured || false}
                    onChange={handleChange}
                    className="mr-2 w-4 h-4"
                  />
                  <span className="text-sm font-medium">🌟 Featured Package</span>
                </label>
              </div>
              <p className="text-xs text-gray-500 mt-1">
                💡 Tagged packages will appear in homepage sections
              </p>
            </div>

            {/* Group Tour Specific Fields */}
            {form.tour_type === "group" && (
              <>
                {/* Min & Max Persons */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    👥 Minimum Persons <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="min_persons" 
                    type="number"
                    value={form.min_persons} 
                    onChange={handleChange} 
                    placeholder="e.g., 10" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Required to confirm tour</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    👥 Maximum Persons <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="max_persons" 
                    type="number"
                    value={form.max_persons} 
                    onChange={handleChange} 
                    placeholder="e.g., 40" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum capacity</p>
                </div>

                {/* Booking Deadline & Advance Payment */}
                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    📅 Booking Deadline (Days Before) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="booking_deadline_days" 
                    type="number"
                    value={form.booking_deadline_days} 
                    onChange={handleChange} 
                    placeholder="e.g., 7" 
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Days before tour start</p>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    💳 Advance Payment (%) <span className="text-red-500">*</span>
                  </label>
                  <input 
                    name="advance_percentage" 
                    type="number"
                    value={form.advance_percentage} 
                    onChange={handleChange} 
                    placeholder="e.g., 30" 
                    min="0"
                    max="100"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">Percentage to pay in advance</p>
                </div>

                {/* Available Dates */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-semibold mb-2 text-gray-700">
                    📅 Available Tour Dates <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="available_dates" 
                    value={form.available_dates} 
                    onChange={handleChange} 
                    placeholder="2026-01-20&#10;2026-02-14&#10;2026-03-10" 
                    rows="3"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none resize-none"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    📝 Enter dates in YYYY-MM-DD format, one per line
                  </p>
                </div>
              </>
            )}

            {/* Country */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Country <span className="text-red-500">*</span>
              </label>
              <select 
                name="country_id" 
                value={form.country_id} 
                onChange={handleChange} 
                className={`w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none ${
                  errors.country ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select or type country name</option>
                {countries?.map((country) => (
                  <option key={country.id} value={country.id}>
                    {country.name}
                  </option>
                ))}
              </select>
              {errors.country && <p className="text-red-500 text-xs mt-1">{errors.country}</p>}
              <p className="text-xs text-gray-500 mt-1">
                💡 Or type country name below if not in list
              </p>
              <input 
                name="country" 
                value={form.country} 
                onChange={handleChange}
                placeholder="e.g., Bangladesh, Italy, Thailand"
                className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
              
              {/* Country Image Upload */}
              {form.country && !form.country_id && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold mb-1 text-gray-600">
                    Country Image (Optional)
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handleCountryImageChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                  />
                  {countryImagePreview && (
                    <img 
                      src={countryImagePreview} 
                      alt="Country Preview" 
                      className="mt-2 w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>
              )}
            </div>

            {/* City/Place */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                City/Place {form.package_type === 'domestic' && <span className="text-red-500">*</span>}
              </label>
              <select 
                name="place_id" 
                value={form.place_id} 
                onChange={handleChange} 
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
              >
                <option value="">Select or type place name</option>
                {places?.map((place) => (
                  <option key={place.id} value={place.id}>
                    {place.name}
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                💡 Or type place name below if not in list
              </p>
              <input 
                name="city" 
                value={form.city} 
                onChange={handleChange}
                placeholder="e.g., Sajek Valley, Cox's Bazar, Rome"
                className="w-full p-2 mt-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none text-sm"
              />
              
              {/* Place Image Upload */}
              {form.city && !form.place_id && (
                <div className="mt-3">
                  <label className="block text-xs font-semibold mb-1 text-gray-600">
                    Place Image (Optional)
                  </label>
                  <input 
                    type="file"
                    accept="image/*"
                    onChange={handlePlaceImageChange}
                    className="w-full p-2 border border-gray-300 rounded-lg text-sm file:mr-3 file:py-1 file:px-3 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-purple-50 file:text-purple-700 hover:file:bg-purple-100"
                  />
                  {placeImagePreview && (
                    <img 
                      src={placeImagePreview} 
                      alt="Place Preview" 
                      className="mt-2 w-full h-32 object-cover rounded-lg border"
                    />
                  )}
                </div>
              )}
            </div>

            {/* Image Upload */}
            <div className="md:col-span-2">
              <label className="block text-sm font-semibold mb-2 text-gray-700">
                Package Image <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-2">
                <input 
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange} 
                  className={`flex-1 p-3 border rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 ${
                    errors.image ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
              </div>
              {errors.image && <p className="text-red-500 text-xs mt-1">{errors.image}</p>}
              <p className="text-xs text-gray-500 mt-1">
                📷 Supported formats: JPG, JPEG, PNG, GIF (Max 2MB)
              </p>
              
              {/* Image Preview */}
              {imagePreview && (
                <div className="mt-3 border rounded-lg p-2 bg-gray-50">
                  <p className="text-xs text-gray-600 mb-2 font-semibold">Preview:</p>
                  <img 
                    src={imagePreview} 
                    alt="Preview" 
                    className="w-full h-48 object-cover rounded-lg"
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