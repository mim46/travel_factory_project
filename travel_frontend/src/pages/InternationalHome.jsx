import { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "../redux/slices/packageSlice";
import thailand1Img from "../assets/images/thailand1.jpg";
import maldive1Img from "../assets/images/maldive1.jpg";
import malaysiaImg from "../assets/images/malaysia.jpg";
import singaporeImg from "../assets/images/singapore.jpg";
import dubai1Img from "../assets/images/dubai1.jpg";
import turkey1Img from "../assets/images/turkey1.jpg";
import indonesiaImg from "../assets/images/indonesia.jpg";
import nepal1Img from "../assets/images/nepal1.jpg";
import greeceImg from "../assets/images/greece.png";

export default function InternationalHome() {
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  // Get unique countries from international packages
  const internationalCountries = [...new Set(
    packages
      .filter(p => p.package_type === "international" && p.country)
      .map(p => p.country.toLowerCase().trim())
  )];

  // Default images mapping
  const imageMap = {
    "thailand": thailand1Img,
    "maldives": maldive1Img,
    "malaysia": malaysiaImg,
    "singapore": singaporeImg,
    "dubai": dubai1Img,
    "turkey": turkey1Img,
    "indonesia": indonesiaImg,
    "nepal": nepal1Img,
    "greece": greeceImg
  };

  // Default fallback image
  const defaultImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=60";

  // Create countries array with images
  const countries = internationalCountries.map(country => ({
    name: country.charAt(0).toUpperCase() + country.slice(1),
    image: imageMap[country] || defaultImage
  }));

  return (
    <div className="min-h-screen bg-white py-10 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-8 text-center">
        International Destinations
      </h1>

      <div className="grid md:grid-cols-3 gap-10 max-w-5xl mx-auto">
        {countries.map((c) => (
          <Link
            key={c.name}
            to={`/international/${c.name}`}
            className="bg-blue-50 rounded-xl shadow hover:shadow-xl overflow-hidden transition"
          >
<img src={c.image} alt="" className="w-full h-52 object-cover" />
            <div className="p-3 text-center font-semibold text-xl capitalize text-blue-900">
              {c.name}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
