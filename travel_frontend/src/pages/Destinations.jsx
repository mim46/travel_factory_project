import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { FaMapMarkerAlt } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchCountries } from "../redux/slices/countrySlice";

const BASE_URL = "http://127.0.0.1:8000";

export default function Destinations() {
  const dispatch = useDispatch();
  const { countries, loading } = useSelector((state) => state.countries);

  useEffect(() => {
    dispatch(fetchCountries());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-blue-50 py-12 px-6">
      <h1 className="text-4xl font-bold text-blue-900 mb-10 text-center">
        Explore Destinations
      </h1>

      {loading ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">Loading destinations...</p>
        </div>
      ) : countries.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No destinations available</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 max-w-6xl mx-auto">
          {countries.map((country) => {
            const link = country.name.toLowerCase() === 'bangladesh' 
              ? '/domestic' 
              : `/international/${country.name.toLowerCase()}`;
            
            return (
              <Link
                key={country.id}
                to={link}
                className="relative group rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition"
              >
                <img
                  src={country.image ? `${BASE_URL}/${country.image}` : 'https://images.unsplash.com/photo-1506744038136-46273834b3fb'}
                  alt={country.name}
                  className="w-full h-64 object-cover group-hover:scale-110 transition duration-500"
                />

                {/* Overlay */}
                <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition"></div>

                {/* Text */}
                <div className="absolute bottom-5 left-5 flex items-center gap-2 text-white text-xl font-semibold">
                  <FaMapMarkerAlt />
                  {country.name}
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
