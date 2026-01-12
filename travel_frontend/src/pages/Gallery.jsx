import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useSearchParams } from "react-router-dom";
import { fetchGalleries } from "../redux/slices/gallerySlice";

const BASE_URL = "http://127.0.0.1:8000";

export default function Gallery() {
  const dispatch = useDispatch();
  const { galleries, loading } = useSelector((state) => state.gallery);
  const [searchParams, setSearchParams] = useSearchParams();
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");

  useEffect(() => {
    dispatch(fetchGalleries(selectedCategory));
  }, [dispatch, selectedCategory]);

  useEffect(() => {
    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    if (category === "all") {
      setSearchParams({});
    } else {
      setSearchParams({ category });
    }
  };

  const categories = [
    { value: "all", label: "All" },
    { value: "travel_experiences", label: "Travel Experiences" },
    { value: "travel_factory", label: "Travel Factory" },
    { value: "events_memories", label: "Events & Memories" },
  ];

  return (
    <div className="min-h-screen bg-blue-50 px-6 py-12">
      <h1 className="text-4xl font-bold text-blue-900 text-center mb-4">
        Travel Gallery
      </h1>
      <p className="text-center text-gray-600 mb-8">
        Explore our collection of beautiful travel moments
      </p>

      {/* Category Filter */}
      <div className="max-w-6xl mx-auto mb-8 flex justify-center gap-4 flex-wrap">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => handleCategoryChange(cat.value)}
            className={`px-6 py-2 rounded-full font-medium transition ${
              selectedCategory === cat.value
                ? "bg-blue-600 text-white shadow-lg"
                : "bg-white text-gray-700 hover:bg-blue-100"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading gallery...</p>
        </div>
      ) : galleries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No images found in this category</p>
        </div>
      ) : (
        <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
          {galleries.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-xl shadow-lg hover:scale-105 hover:shadow-2xl transition-all duration-300 cursor-pointer bg-white"
            >
              <img
                src={`${BASE_URL}/${image.image}`}
                alt="Gallery"
                className="w-full h-56 object-cover"
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
