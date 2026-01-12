import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSave } from "react-icons/fa";
import { fetchPageContent, updatePageContent } from "../../redux/slices/pageContentSlice";

export default function PageContact() {
  const dispatch = useDispatch();
  const { contact, loading } = useSelector((state) => state.pageContent);
  
  const [content, setContent] = useState({
    title: "",
    description: "",
    email: "",
    phone: "",
    address: "",
  });

  useEffect(() => {
    dispatch(fetchPageContent('contact'));
  }, [dispatch]);

  useEffect(() => {
    if (contact && Object.keys(contact).length > 0) {
      setContent({
        title: contact.title || "",
        description: contact.description || "",
        email: contact.email || "",
        phone: contact.phone || "",
        address: contact.address || "",
      });
    }
  }, [contact]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updatePageContent({ page: 'contact', content }));
    alert("Contact page content updated successfully!");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Contact Page</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Page Title</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., Contact Us"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows="4"
            placeholder="Brief description..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Email</label>
          <input
            type="email"
            value={content.email}
            onChange={(e) => setContent({ ...content, email: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., info@travelfactory.com"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Phone</label>
          <input
            type="text"
            value={content.phone}
            onChange={(e) => setContent({ ...content, phone: e.target.value })}
            className="w-full p-3 border rounded-lg"
            placeholder="e.g., +880 1234 567890"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Address</label>
          <textarea
            value={content.address}
            onChange={(e) => setContent({ ...content, address: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows="3"
            placeholder="Your office address..."
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
        >
          <FaSave /> {loading ? "Saving..." : "Save Changes"}
        </button>
      </form>
    </div>
  );
}

