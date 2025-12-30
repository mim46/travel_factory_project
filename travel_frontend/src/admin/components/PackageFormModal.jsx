import { useState, useEffect } from "react";

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

  useEffect(() => {
    if (editData) {
      setForm(editData);
    } else {
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
    }
  }, [editData, show]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50 p-4">
      <div className="bg-white p-6 rounded-xl w-full max-w-3xl shadow-lg max-h-[95vh] overflow-y-auto">
        <h2 className="text-2xl font-bold mb-6 text-[#1C7DA2]">
          {editData ? "Edit Package" : "Add New Package"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Package Title */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Package Title *</label>
            <input 
              name="title" 
              value={form.title} 
              onChange={handleChange} 
              placeholder="e.g., Cox's Bazar Beach Tour" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              required
            />
          </div>

          {/* Package Type */}
          <div>
            <label className="block text-sm font-semibold mb-1">Package Type *</label>
            <select 
              name="package_type" 
              value={form.package_type} 
              onChange={handleChange} 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none"
            >
              <option value="domestic">Domestic</option>
              <option value="international">International</option>
              <option value="budget">Budget</option>
            </select>
          </div>

          {/* Duration */}
          <div>
            <label className="block text-sm font-semibold mb-1">Duration *</label>
            <input 
              name="duration" 
              value={form.duration} 
              onChange={handleChange} 
              placeholder="e.g., 3 Days 2 Nights" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              required
            />
          </div>

          {/* Price */}
          <div>
            <label className="block text-sm font-semibold mb-1">Price (৳) *</label>
            <input 
              name="price" 
              type="number"
              value={form.price} 
              onChange={handleChange} 
              placeholder="e.g., 15000" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              required
            />
          </div>

          {/* Country */}
          <div>
            <label className="block text-sm font-semibold mb-1">Country *</label>
            <input 
              name="country" 
              value={form.country} 
              onChange={handleChange} 
              placeholder="e.g., Bangladesh, Thailand" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              required
            />
          </div>

          {/* City */}
          <div>
            <label className="block text-sm font-semibold mb-1">City/Place (for Domestic only)</label>
            <input 
              name="city" 
              value={form.city} 
              onChange={handleChange} 
              placeholder="e.g., coxsbazar, sajek, rangamati" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            />
            <p className="text-xs text-gray-500 mt-1">Use lowercase, no spaces (e.g., coxsbazar, saintmartin)</p>
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Image URL *</label>
            <input 
              name="image" 
              value={form.image} 
              onChange={handleChange} 
              placeholder="https://example.com/image.jpg" 
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              required
            />
          </div>

          {/* Description */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Description *</label>
            <textarea 
              name="description" 
              value={form.description} 
              onChange={handleChange} 
              placeholder="Write a detailed description..." 
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
              required
            />
          </div>

          {/* Itinerary */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Itinerary (Day-wise plan)</label>
            <textarea 
              name="itinerary" 
              value={form.itinerary} 
              onChange={handleChange} 
              placeholder="Day 1: Arrival and check-in&#10;Day 2: Beach activities&#10;Day 3: Departure" 
              rows="4"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            />
            <p className="text-xs text-gray-500 mt-1">Enter day-wise itinerary (optional)</p>
          </div>

          {/* Inclusions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Inclusions (What's included)</label>
            <textarea 
              name="inclusions" 
              value={form.inclusions} 
              onChange={handleChange} 
              placeholder="• Hotel accommodation&#10;• 3 meals per day&#10;• Tour guide&#10;• Transport" 
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            />
            <p className="text-xs text-gray-500 mt-1">List what's included (optional)</p>
          </div>

          {/* Exclusions */}
          <div className="md:col-span-2">
            <label className="block text-sm font-semibold mb-1">Exclusions (What's NOT included)</label>
            <textarea 
              name="exclusions" 
              value={form.exclusions} 
              onChange={handleChange} 
              placeholder="• Personal expenses&#10;• Travel insurance&#10;• Additional activities" 
              rows="3"
              className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-400 focus:outline-none" 
            />
            <p className="text-xs text-gray-500 mt-1">List what's NOT included (optional)</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3 mt-6">
          <button 
            onClick={onClose} 
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button 
            onClick={() => onSubmit(form)} 
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            {editData ? "Update Package" : "Create Package"}
          </button>
        </div>
      </div>
    </div>
  );
}