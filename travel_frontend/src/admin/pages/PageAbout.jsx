import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSave } from "react-icons/fa";
import { fetchPageContent, updatePageContent } from "../../redux/slices/pageContentSlice";

export default function PageAbout() {
  const dispatch = useDispatch();
  const { about, loading } = useSelector((state) => state.pageContent);
  
  const [content, setContent] = useState({
    title: "",
    description: "",
    mission: "",
    vision: "",
  });

  useEffect(() => {
    dispatch(fetchPageContent('about'));
  }, [dispatch]);

  useEffect(() => {
    if (about && Object.keys(about).length > 0) {
      setContent({
        title: about.title || "",
        description: about.description || "",
        mission: about.mission || "",
        vision: about.vision || "",
      });
    }
  }, [about]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updatePageContent({ page: 'about', content }));
    alert("About page content updated successfully!");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit About Us Page</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-semibold mb-2">Page Title</label>
          <input
            type="text"
            value={content.title}
            onChange={(e) => setContent({ ...content, title: e.target.value })}
            className="w-full p-3 border rounded-lg"
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Description</label>
          <textarea
            value={content.description}
            onChange={(e) => setContent({ ...content, description: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows="6"
            placeholder="Tell us about your company..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Our Mission</label>
          <textarea
            value={content.mission}
            onChange={(e) => setContent({ ...content, mission: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows="4"
            placeholder="Your company mission..."
          />
        </div>

        <div>
          <label className="block text-sm font-semibold mb-2">Our Vision</label>
          <textarea
            value={content.vision}
            onChange={(e) => setContent({ ...content, vision: e.target.value })}
            className="w-full p-3 border rounded-lg"
            rows="4"
            placeholder="Your company vision..."
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
