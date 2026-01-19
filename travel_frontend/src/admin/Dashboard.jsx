import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchPackages } from "../redux/slices/packageSlice";
import { fetchAllBookings } from "../redux/slices/bookingSlice";
import { fetchAllUsers } from "../redux/slices/userSlice";
import { fetchAllQueries } from "../redux/slices/querySlice";
import { fetchAllMessages } from "../redux/slices/messageSlice"; // ⭐ Add this
import StatCard from "./components/StatCard";
import { FaUsers, FaBox, FaShoppingCart, FaEnvelope } from "react-icons/fa";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";

export default function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { packages } = useSelector((state) => state.packages);
  const { bookings } = useSelector((state) => state.bookings);
  const { users } = useSelector((state) => state.user);  // state.user.users
  const { queries } = useSelector((state) => state.query);
  const { adminMessages } = useSelector((state) => state.messages); // ⭐ Add this

  // Dynamic greeting based on time
  const getGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good Morning! ☀️";
    if (hour < 18) return "Good Afternoon! 🌤️";
    return "Good Evening! 🌙";
  };

  // Weekly bookings data - From Jan 4 to Jan 25, 2026
  const getWeeklyBookings = () => {
    const weekCounts = {};
    
    bookings.forEach((booking) => {
      const date = new Date(booking.created_at);
      const bookingDate = date.toISOString().split('T')[0];
      
      // Check if booking is between Jan 4 and Jan 25, 2026
      if (bookingDate >= '2026-01-04' && bookingDate <= '2026-01-25') {
        const weekStart = new Date(date);
        weekStart.setDate(date.getDate() - date.getDay()); // Get Sunday of that week
        const weekKey = weekStart.toISOString().split('T')[0];
        weekCounts[weekKey] = (weekCounts[weekKey] || 0) + 1;
      }
    });

    // Define weeks from Jan 4 to Jan 25
    const weeks = [
      { start: new Date('2026-01-04'), label: '4/1' },   // Week 1: Jan 4-10
      { start: new Date('2026-01-11'), label: '11/1' },  // Week 2: Jan 11-17
      { start: new Date('2026-01-18'), label: '18/1' },  // Week 3: Jan 18-24
      { start: new Date('2026-01-25'), label: '25/1' },  // Week 4: Jan 25
    ];

    return weeks.map(({ start, label }) => {
      const weekKey = start.toISOString().split('T')[0];
      return {
        week: label,
        bookings: weekCounts[weekKey] || 0,
      };
    });
  };

  // Top Selling Packages - by booking count
  const getTopSellingPackages = () => {
    const packageCounts = {};
    
    bookings.forEach((booking) => {
      const pkgTitle = booking.package?.title || 'Unknown';
      const pkgId = booking.package_id;
      
      if (!packageCounts[pkgId]) {
        packageCounts[pkgId] = {
          name: pkgTitle,
          value: 0
        };
      }
      packageCounts[pkgId].value += 1;
    });

    // Get top 5 packages
    return Object.values(packageCounts)
      .sort((a, b) => b.value - a.value)
      .slice(0, 5);
  };

  const pieColors = ["#4F46E5", "#10B981", "#F59E0B", "#EF4444", "#8B5CF6"];

  // =====================
  // LOAD DATA FROM BACKEND
  // =====================
  useEffect(() => {
    dispatch(fetchPackages());
    dispatch(fetchAllBookings());
    dispatch(fetchAllUsers());
    dispatch(fetchAllQueries());
    dispatch(fetchAllMessages()); // ⭐ Add this
  }, [dispatch]);

  return (
    <div>
      {/* Dynamic Greeting */}
      <h2 className="text-3xl font-bold text-[#1C7DA2] mb-8">
        {getGreeting()}
      </h2>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <div onClick={() => navigate('/admin/users')}>
          <StatCard 
            title="Total Users" 
            value={users.length} 
            icon={<FaUsers />} 
            gradient="bg-gradient-to-br from-blue-50 to-blue-100"
            borderColor="border-cyan-500"
          />
        </div>
        <div onClick={() => navigate('/admin/packages')}>
          <StatCard 
            title="Packages" 
            value={packages.length} 
            icon={<FaBox />} 
            gradient="bg-purple-50"
            borderColor="border-purple-500"
          />
        </div>
        <div onClick={() => navigate('/admin/bookings')}>
          <StatCard 
            title="Bookings" 
            value={bookings.length} 
            icon={<FaShoppingCart />} 
            gradient="bg-green-50"
            borderColor="border-green-500"
          />
        </div>
        <div onClick={() => navigate('/admin/messages')}>
          <StatCard 
            title="Messages" 
            value={adminMessages.length} 
            icon={<FaEnvelope />}
            gradient="bg-orange-50"
            borderColor="border-orange-500"
          />
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">

        {/* Bar Chart — Weekly Bookings (Jan 4-25, 2026) */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-xl mb-4 font-semibold text-gray-800">
            📊 Weekly Bookings (Jan 4-25, 2026)
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={getWeeklyBookings()}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
              <XAxis dataKey="week" />
              <YAxis />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Bar 
                dataKey="bookings" 
                fill="#4F46E5" 
                radius={[8, 8, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pie Chart — Top Selling Packages */}
        <div className="bg-white p-6 rounded-xl shadow-lg border border-blue-100">
          <h3 className="text-xl mb-4 font-semibold text-gray-800">
            🎯 Top 5 Selling Packages
          </h3>

          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: '#fff', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px'
                }}
              />
              <Legend 
                verticalAlign="bottom" 
                height={36}
                wrapperStyle={{ fontSize: '12px' }}
              />
              <Pie
                data={getTopSellingPackages()}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="45%"
                outerRadius={80}
                label={({ value }) => value}
                labelLine={false}
              >
                {getTopSellingPackages().map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={pieColors[index % pieColors.length]} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>

      </div>

    </div>
  );
}