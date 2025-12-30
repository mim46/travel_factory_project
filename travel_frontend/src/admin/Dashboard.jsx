import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPackages } from "../redux/slices/packageSlice";
import { fetchAllBookings } from "../redux/slices/bookingSlice";
import { fetchAllUsers } from "../redux/slices/userSlice";
import { fetchAllQueries } from "../redux/slices/querySlice";
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
  const navigate = useNavigate();
  const { packages } = useSelector((state) => state.packages);
  const { bookings } = useSelector((state) => state.bookings);
  const { users } = useSelector((state) => state.users);
  const { queries } = useSelector((state) => state.query);

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! ☀️";
    if (hour < 18) return "Good Afternoon! 🌤️";
    return "Good Evening! 🌙";
  };

  // Monthly bookings data (group by month)
  const getMonthlyBookings = () => {
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    const monthlyCounts = {};
    
    bookings.forEach((booking) => {
      const month = new Date(booking.created_at).getMonth();
      const monthName = monthNames[month];
      monthlyCounts[monthName] = (monthlyCounts[monthName] || 0) + 1;
    });

    return monthNames.map((month) => ({
      month,
      bookings: monthlyCounts[month] || 0,
    }));
  };

  // Package distribution data
  const getPackageDistribution = () => {
    const categoryCount = {};
    packages.forEach((pkg) => {
      const category = pkg.category || "Other";
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    return Object.entries(categoryCount).map(([category, count]) => ({
      category,
      count,
    }));
  };

  const pieColors = ["#4DBEE3", "#FFCE56", "#4BC0C0", "#FF6384", "#36A2EB"];

  // =====================
  // LOAD DATA FROM BACKEND
  // =====================
  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchAllBookings());
    dispatch(fetchAllUsers());
    dispatch(fetchAllQueries());
  }, [dispatch]);

  return (
    <div>
      {/* Dynamic Greeting */}
      <h2 className="text-3xl font-bold text-[#1C7DA2] mb-8">
        {getGreeting()}
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
        <div onClick={() => navigate('/admin/users')} className="cursor-pointer">
          <StatCard title="Total Users" value={users.length} icon={<FaUsers />} />
        </div>
        <div onClick={() => navigate('/admin/packages')} className="cursor-pointer">
          <StatCard title="Packages" value={packages.length} icon={<FaBox />} />
        </div>
        <div onClick={() => navigate('/admin/bookings')} className="cursor-pointer">
          <StatCard title="Bookings" value={bookings.length} icon={<FaShoppingCart />} />
        </div>
        <div onClick={() => navigate('/admin/messages')} className="cursor-pointer">
          <StatCard title="Messages" value={queries.length} icon={<FaEnvelope />} />
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Line Chart — Monthly Bookings */}
        <div className="bg-white p-6 rounded-xl shadow border border-blue-100">
          <h3 className="text-xl mb-4 font-semibold text-[#1C7DA2]">
            Monthly Bookings 📈
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={getMonthlyBookings()}>
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
            Packages by Category 🎒
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip />
              <Pie
                data={getPackageDistribution()}
                dataKey="count"
                nameKey="category"
                cx="50%"
                cy="50%"
                outerRadius={110}
                label
              >
                {getPackageDistribution().map((entry, index) => (
                  <Cell key={index} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}
