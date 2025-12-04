import { Link } from "react-router-dom";

export default function PackageCard({ id, img, title }) {
  const getRoute = () => {
    if (id === "domestic") return "/domestic";
    if (id === "international") return "/international";
    if (id === "budget") return "/budget";
    return "/";
  };

  return (
    <Link
      to={getRoute()}
      className="w-72 rounded-3xl overflow-hidden shadow-md hover:scale-105 transition-all duration-300"
    >
      <div className="w-full h-80 overflow-hidden">
        <img
          src={img}
          alt={title}
          className="w-full h-full object-cover"
        />
      </div>

      <div className="bg-yellow-300 text-blue-800 text-center py-3 text-lg font-semibold">
        {title.toUpperCase()}
      </div>
    </Link>
  );
}
