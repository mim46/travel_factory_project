export default function Navbar() {
    return (
      <div className="w-full bg-white border-b border-blue-100 px-6 py-4 flex justify-between items-center shadow-sm">
  
        <h1 className="text-xl font-semibold text-[#1C7DA2]">
          ✈️ Admin Dashboard
        </h1>
  
        <div className="flex items-center gap-3">
          <span className="text-gray-700 bg-[#E3F7FF] px-3 py-1 rounded-full shadow text-sm border border-blue-200">
            Hello, Admin
          </span>
  
          <img
            src="https://cdn-icons-png.flaticon.com/512/2202/2202112.png"
            alt="admin-profile"
            className="w-10 h-10 rounded-full border border-blue-300"
          />
        </div>
  
      </div>
    );
  }
  