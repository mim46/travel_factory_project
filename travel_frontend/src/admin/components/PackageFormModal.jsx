import { useState, useEffect } from "react";

export default function PackageFormModal({ show, onClose, onSubmit, editData }) {
  const [form, setForm] = useState({
    title: "",
    country: "",
    city: "",
    price: "",
    description: "",
    image: ""
  });

  useEffect(() => {
    if (editData) {
      setForm(editData);
    }
  }, [editData]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/40 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-xl w-full max-w-lg shadow-lg">
        <h2 className="text-xl font-bold mb-4">
          {editData ? "Edit Package" : "Add New Package"}
        </h2>

        <div className="grid grid-cols-1 gap-3">
          <input name="title" value={form.title} onChange={handleChange} placeholder="Package Title" className="p-2 border rounded" />

          <input name="country" value={form.country} onChange={handleChange} placeholder="Country" className="p-2 border rounded" />

          <input name="city" value={form.city} onChange={handleChange} placeholder="City" className="p-2 border rounded" />

          <input name="price" value={form.price} onChange={handleChange} placeholder="Price" className="p-2 border rounded" />

          <textarea name="description" value={form.description} onChange={handleChange} placeholder="Description" className="p-2 border rounded" />

          <input name="image" value={form.image} onChange={handleChange} placeholder="Image URL" className="p-2 border rounded" />
        </div>

        <div className="flex justify-end gap-3 mt-4">
          <button onClick={onClose} className="px-4 py-2 bg-gray-300 rounded">Cancel</button>
          <button onClick={() => onSubmit(form)} className="px-4 py-2 bg-blue-600 text-white rounded">
            {editData ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
}
