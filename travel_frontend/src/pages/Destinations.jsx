import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";

export default function Destinations() {
  const destinations = [
    {
      name: "Bangladesh",
      image: "https://images.unsplash.com/photo-1528127269322-539801943592",
      link: "/domestic"
    },
    {
      name: "Thailand",
      image: "https://images.unsplash.com/photo-1494475673543-6a6a27143b22",
      link: "/international/thailand"
    },
    {
      name: "Malaysia",
      image: "https://images.unsplash.com/photo-1494475673543-6a6a27143b22",
      link: "/international/malaysia"
    },
    {
      name: "Singapore",
      image: "https://images.unsplash.com/photo-1506377247377-2a5b3b417ebb",
      link: "/international/singapore"
    },
    {
      name: "Dubai",
      image: "https://images.unsplash.com/photo-1503264116251-35a269479413",
      link: "/international/dubai"
    },
    {
      name: "Turkey",
      image: "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee",
      link: "/international/turkey"
    }
  ];

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-10 text-center">
        Explore Destinations
      </h1>

      {/* Grid */}
      <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
        {destinations.map((d, i) => (
          <Link
            key={i}
            to={d.link}
            className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
          >
            <img
              src={d.image}
              alt={d.name}
              className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
            />

            {/* Overlay */}
            <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>

            {/* Text */}
            <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white text-xl font-semibold">
              <FaMapMarkerAlt />
              {d.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
