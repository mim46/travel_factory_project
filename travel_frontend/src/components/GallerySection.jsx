import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { fetchGalleries } from "../redux/slices/gallerySlice";
import { FaCamera, FaImage, FaHeart } from "react-icons/fa";

const BASE_URL = "http://127.0.0.1:8000";

export default function GallerySection() {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.gallery);

  useEffect(() => {
    dispatch(fetchGalleries("all"));
  }, [dispatch]);

  const categories = [
    { key: "travel_experiences", label: "Travel Experiences", icon: FaCamera },
    { key: "travel_factory", label: "Travel Factory", icon: FaImage },
    { key: "events_memories", label: "Events & Memories", icon: FaHeart },
  ];

  // Get the most recent image from each category
  const getCategoryImage = (categoryKey) => {
    const categoryImages = galleries
      .filter((g) => g.category === categoryKey)
      .sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
    return categoryImages.length > 0 ? categoryImages[0] : null;
  };

  return (
    <div className="py-16 px-6 bg-gradient-to-b from-white to-blue-50">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-center text-4xl font-extrabold 
          bg-gradient-to-r from-blue-400 via-blue-600 to-purple-700
          bg-clip-text text-transparent tracking-wide drop-shadow-sm mb-4">
          Our Gallery
        </h2>
        <p className="text-center text-gray-600 mb-12">
          Explore our collection of memorable moments
        </p>

        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-500">Loading gallery...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category) => {
              const image = getCategoryImage(category.key);
              const Icon = category.icon;

              return (
                <Link
                  key={category.key}
                  to={`/gallery?category=${category.key}`}
                  className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-300 h-80 cursor-pointer"
                >
                  {image ? (
                    <img
                      src={`${BASE_URL}/${image.image}`}
                      alt={category.label}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-gradient-to-br from-blue-400 to-blue-600 flex items-center justify-center">
                      <Icon className="text-white text-6xl opacity-50" />
                    </div>
                  )}

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent group-hover:from-black/80 transition-all"></div>

                  {/* Text */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon className="text-2xl" />
                      <h3 className="text-2xl font-bold">{category.label}</h3>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        )}

        <div className="text-center mt-8">
          <Link
            to="/gallery"
            className="inline-block bg-blue-600 text-white px-8 py-3 rounded-full font-semibold hover:bg-blue-700 transition shadow-lg hover:shadow-xl"
          >
            View All Photos
          </Link>
        </div>
      </div>
    </div>
  );
}
