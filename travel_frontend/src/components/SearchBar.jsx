import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaUsers, FaSearch } from "react-icons/fa";

export default function SearchBar() {
  const navigate = useNavigate();

  const [destination, setDestination] = useState("");
  const [tourType, setTourType] = useState("");
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    // Fetch countries from backend
    fetch('http://localhost:8000/api/countries')
      .then(res => res.json())
      .then(data => setCountries(data))
      .catch(err => console.error('Error fetching countries:', err));
  }, []);

  const handleSearch = () => {
    if (!destination) return alert("Please select a destination");
    
    // Build query params for tour type
    const params = tourType ? `?type=${tourType}` : '';
    
    if (destination === "bangladesh") return navigate(`/domestic${params}`);
    if (destination === "budget") return navigate("/budget");
    navigate(`/international/${destination}${params}`);
  };

  return (
    <div className="
      relative mx-auto
      backdrop-blur-xl bg-white/20 
      border border-white/30
      shadow-[0_8px_30px_rgba(0,0,0,0.25)]
      rounded-2xl 
      p-7
      max-w-xl
    ">
      {/* Content */}
      <div className="relative z-10">

        {/* TOP ROW (side-by-side) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

          {/* Destination */}
          <div className="flex flex-col">
            <label className="text-sm text-white font-medium flex items-center gap-2">
              <FaMapMarkerAlt className="text-yellow-300" />
              Destination
            </label>

            <select
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
              className="
                bg-white/70 
                backdrop-blur 
                rounded-lg 
                h-[40px] 
                mt-1 
                px-3 
                shadow-md 
                text-gray-800 
                focus:outline-none
              "
            >
              <option value="">Select Destination</option>
              <option value="bangladesh">Bangladesh</option>
              {countries
                .filter(country => country.name.toLowerCase() !== 'bangladesh')
                .map((country) => (
                  <option key={country.id} value={country.name.toLowerCase()}>
                    {country.name}
                  </option>
                ))}
            </select>
          </div>

          {/* Tour Type */}
          <div className="flex flex-col">
            <label className="text-sm text-white font-medium flex items-center gap-2">
              <FaUsers className="text-yellow-300" />
              Tour Type
            </label>

            <select
              value={tourType}
              onChange={(e) => setTourType(e.target.value)}
              className="
                bg-white/70 
                backdrop-blur 
                rounded-lg 
                h-[40px] 
                mt-1 
                px-3 
                shadow-md 
                text-gray-800 
                focus:outline-none
              "
            >
              <option value="">Select Type</option>
              <option value="group">Group</option>
              <option value="individual">Individual</option>
            </select>
          </div>

        </div>

        {/* SEARCH BUTTON */}
        <div className="flex justify-center mt-5">
          <button
            onClick={handleSearch}
            className="
              bg-yellow-300 
              hover:bg-yellow-400 
              text-blue-800 
              px-6 py-2 
              rounded-xl 
              shadow-lg 
              font-semibold 
              flex items-center gap-2
            "
          >
            <FaSearch className="text-base" />
            Search
          </button>
        </div>

      </div>
    </div>
  );
}
