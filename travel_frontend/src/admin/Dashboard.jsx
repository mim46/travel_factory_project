import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPackages } from "../redux/slices/packageSlice";
import StatCard from "./components/StatCard";
import { FaUsers, FaBox, FaShoppingCart, FaEnvelope } from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Dashboard() {
  const dispatch = useDispatch();
  const { packages } = useSelector((state) => state.packages);

  // Dummy Data (charts are static for now)
  const bookingData = [
    { month: "Jan", bookings: 40 },
    { month: "Feb", bookings: 65 },
    { month: "Mar", bookings: 52 },
    { month: "Apr", bookings: 80 },
    { month: "May", bookings: 95 },
    { month: "Jun", bookings: 70 },
  ];

  const packagePieData = [
    { category: "Domestic", count: 12 },
    { category: "International", count: 20 },
    { category: "Budget", count: 16 },
  ];

  const pieColors = ["#4DBEE3", "#FFCE56", "#4BC0C0"];

  // =====================
  // LOAD PACKAGES FROM BACKEND
  // =====================
  useEffect(() => {
    dispatch(fetchPackages());
  }, [dispatch]);

  return (
    <div>
      {/* Heading */}
      <h2 className="text-3xl font-bold text-[#1C7DA2] mb-8">
        Welcome Back! 🌤️
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Users" value="1200" icon={<FaUsers />} />
        <StatCard title="Packages" value={packages.length} icon={<FaBox />} />
        <StatCard title="Bookings" value="320" icon={<FaShoppingCart />} />
        <StatCard title="Messages" value="12" icon={<FaEnvelope />} />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Line Chart — Monthly Bookings */}
        <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
          <h3 className="text-xl mb-4 font-semibold text-[#1C7DA2]">
            Monthly Bookings 📈
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingData}>
              <CartesianGrid stroke="#e0f3ff" />
              <XAxis dataKey="month" />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="bookings"
                stroke="#4DBEE3"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Package Category Overview */}
        <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
          <h3 className="text-xl mb-4 font-semibold text-[#1C7DA2]">
            Packages Overview 🎒
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Pie
                data={packagePieData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {packagePieData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

      {/* PACKAGE TABLE (Backend data preview) */}
      <div className="mt-12 bg-white p-6 rounded-xl shadow border border-blue-100">
        <h3 className="text-xl mb-4 font-semibold text-[#1C7DA2]">
          All Packages (from Backend)
        </h3>

        <table className="w-full border-collapse bg-white shadow text-sm">
          <thead>
            <tr className="bg-blue-100 text-left">
              <th className="p-3 border">ID</th>
              <th className="p-3 border">Title</th>
              <th className="p-3 border">Country</th>
              <th className="p-3 border">Price</th>
            </tr>
          </thead>

          <tbody>
            {packages.map((p) => (
              <tr key={p.id} className="hover:bg-blue-50">
                <td className="p-3 border">{p.id}</td>
                <td className="p-3 border">{p.title}</td>
                <td className="p-3 border">{p.country}</td>
                <td className="p-3 border">${p.price}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
}
