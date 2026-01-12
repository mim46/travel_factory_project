import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchLatestPackages, fetchRecommendedPackages } from "../redux/slices/packageSlice";

export default function ExclusivePackages() {
  const dispatch = useDispatch();
  const { latestPackages, recommendedPackages } = useSelector((state) => state.packages);

  useEffect(() => {
    dispatch(fetchLatestPackages());
    dispatch(fetchRecommendedPackages());
  }, [dispatch]);

  return (
    <section className="py-20 text-center">

      <h2 className="
        text-4xl font-extrabold 
        bg-gradient-to-r from-blue-600 via-blue-400 to-purple-600 
        bg-clip-text text-transparent 
        tracking-wide drop-shadow-sm
        mb-16
      ">
        Explore Our Exclusive Travel Packages
      </h2>

      <div className="flex flex-col md:flex-row justify-center gap-12 px-6">
        <SliderBox title="Latest Package" data={latestPackages} />
        <SliderBox title="Recommended Package" data={recommendedPackages} />
      </div>

    </section>
  );
}



// ⭐ SLIDER 
function SliderBox({ title, data }) {
  const [index, setIndex] = useState(0);

  const next = () => {
    setIndex((prev) => (prev + 1 >= data.length ? 0 : prev + 1));
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 < 0 ? data.length - 1 : prev - 1));
  };

  const pair = data.slice(index, index + 2);

  return (
    <div className="
      border-2 border-blue-300 rounded-3xl 
      pt-6 pb-8 px-8
      w-full md:w-[600px] 
      min-h-[400px] 
      relative bg-white/60 backdrop-blur-sm shadow-lg
    ">

      <h3 className="
        text-2xl font-semibold mb-4
        -mt-4
        border-b-2 border-blue-500 pb-2 inline-block
      ">
        {title}
      </h3>

      <button
        onClick={prev}
        className="absolute left-2 top-1/2 -translate-y-1/2 
          bg-white hover:bg-blue-50 p-3 rounded-full shadow"
      >◀</button>

      <button
        onClick={next}
        className="absolute right-2 top-1/2 -translate-y-1/2 
          bg-white hover:bg-blue-50 p-3 rounded-full shadow"
      >▶</button>

      <div className="grid grid-cols-2 gap-8 mt-4">
        {pair.map((pkg, i) => (
          <ExclusiveCard data={pkg} key={i} />
        ))}
      </div>
    </div>
  );
}



// ⭐ EXCLUSIVE PACKAGE CARD — CORRECT ROUTING 
function ExclusiveCard({ data }) {
  // Default fallback image
  const defaultImage = "https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=60";
  const imageUrl = data.image ? `http://localhost:8000/${data.image}` : defaultImage;

  return (
    <Link 
      to={`/package-details/${data.id}`}  // ✔ CORRECT ROUTE
      className="bg-white rounded-2xl shadow-md overflow-hidden border border-blue-300 block"
    >
      <img src={imageUrl} alt={data.title} className="w-full h-40 object-cover" />

      <div className="p-4 text-left space-y-2">
        <h4 className="font-semibold text-lg">{data.title}</h4>
        <p className="text-gray-600 text-sm">⏱️ {data.duration}</p>
        <p className="text-blue-700 font-bold text-right">BDT {data.price}</p>
      </div>
    </Link>
  );
}
