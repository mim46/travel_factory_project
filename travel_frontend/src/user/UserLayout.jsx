import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import Navbar from "./components/Navbar";

export default function UserLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 bg-blue-50/40 min-h-screen">
        <Navbar />
        <div className="p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
}