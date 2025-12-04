import StatCard from "./components/StatCard";
import { FaUsers, FaBox, FaShoppingCart, FaEnvelope } from "react-icons/fa";

import {
  LineChart,
  Line,
  XAxis,
  CartesianGrid,
  Tooltip,
  Bar,
  AreaChart,
  Area,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";

export default function Dashboard() {
  // Dummy Data (backend hole API theke ashbe)
  const bookingData = [
    { month: "Jan", bookings: 40 },
    { month: "Feb", bookings: 65 },
    { month: "Mar", bookings: 52 },
    { month: "Apr", bookings: 80 },
    { month: "May", bookings: 95 },
    { month: "Jun", bookings: 70 },
  ];

  const packageData = [
    { category: "Domestic", count: 12 },
    { category: "International", count: 20 },
    { category: "Budget", count: 16 },
  ];

  const userGrowth = [
    { month: "Jan", users: 200 },
    { month: "Feb", users: 250 },
    { month: "Mar", users: 320 },
    { month: "Apr", users: 400 },
    { month: "May", users: 470 },
    { month: "Jun", users: 530 },
  ];

  // Colors for Pie Chart
  const pieColors = ["#4DBEE3", "#FFCE56", "#4BC0C0"];

  return (
    <div>
      {/* Heading */}
      <h2 className="text-3xl font-bold text-[#1C7DA2] mb-8">
        Welcome Back! 🌤️
      </h2>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <StatCard title="Total Users" value="1200" icon={<FaUsers />} />
        <StatCard title="Packages" value="48" icon={<FaBox />} />
        <StatCard title="Bookings" value="320" icon={<FaShoppingCart />} />
        <StatCard title="Messages" value="12" icon={<FaEnvelope />} />
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Line Chart — Bookings */}
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

        {/* Pie Chart — Packages */}
        <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
          <h3 className="text-xl mb-4 font-semibold text-[#1C7DA2]">
            Packages Overview 🎒
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />

              <Pie
                data={packageData}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {packageData.map((entry, index) => (
                  <Cell key={index} fill={pieColors[index]} />
                ))}
              </Pie>

            </PieChart>
          </ResponsiveContainer>
        </div>

        

      </div>
    </div>
  );
}
