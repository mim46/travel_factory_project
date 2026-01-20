import { FaUserCircle } from "react-icons/fa";

export default function Navbar() {
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning Admin!";
    if (hour < 18) return "Good Afternoon Admin!";
    return "Good Evening Admin!";
  };

  return (
    <div className="w-full bg-white border-b border-blue-100 px-6 py-6 flex justify-between items-center shadow-sm">

      {/* Greeting */}
      <div>
        <h2 className="text-xl font-bold text-[#1C7DA2]">
          {getGreeting()}
        </h2>
      </div>

      {/* Profile Section */}
      <div className="flex items-center gap-3 mr-10">
        <div className="text-[#1C7DA2]">
          <FaUserCircle size={32} />
        </div>
        <span className="text-gray-700 font-medium">
          Admin
        </span>
      </div>

    </div>
  );
}
