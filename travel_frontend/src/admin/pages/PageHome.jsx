import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { FaSave } from "react-icons/fa";
import { fetchPageContent, updatePageContent } from "../../redux/slices/pageContentSlice";

export default function PageHome() {
  const dispatch = useDispatch();
  const { home, loading } = useSelector((state) => state.pageContent);
  
  const [content, setContent] = useState({
    hero_title: "",
    hero_subtitle: "",
    about_title: "",
    about_description: "",
  });

  useEffect(() => {
    dispatch(fetchPageContent('home'));
  }, [dispatch]);

  useEffect(() => {
    if (home && Object.keys(home).length > 0) {
      setContent({
        hero_title: home.hero_title || "",
        hero_subtitle: home.hero_subtitle || "",
        about_title: home.about_title || "",
        about_description: home.about_description || "",
      });
    }
  }, [home]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await dispatch(updatePageContent({ page: 'home', content }));
    alert("Home page content updated successfully!");
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-6">Edit Home Page Content</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-md p-6 space-y-6">
        {/* Hero Section */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">Hero Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Hero Title</label>
              <input
                type="text"
                value={content.hero_title}
                onChange={(e) => setContent({ ...content, hero_title: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="e.g., From Hills to Horizons"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">Hero Subtitle</label>
              <input
                type="text"
                value={content.hero_subtitle}
                onChange={(e) => setContent({ ...content, hero_subtitle: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="e.g., We Take You There"
              />
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="border-b pb-6">
          <h2 className="text-xl font-semibold mb-4 text-blue-600">About Section</h2>
          
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-semibold mb-2">About Title</label>
              <input
                type="text"
                value={content.about_title}
                onChange={(e) => setContent({ ...content, about_title: e.target.value })}
                className="w-full p-3 border rounded-lg"
                placeholder="e.g., About Travel Factory"
              />
            </div>
            
            <div>
              <label className="block text-sm font-semibold mb-2">About Description</label>
              <textarea
                value={content.about_description}
                onChange={(e) => setContent({ ...content, about_description: e.target.value })}
                className="w-full p-3 border rounded-lg"
                rows="6"
                placeholder="Write about your company..."
              />
            </div>
          </div>
        </div>

        {/* Save Button */}
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
