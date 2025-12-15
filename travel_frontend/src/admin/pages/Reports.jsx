import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchDashboardStats,
  fetchMonthlyBookings,
  fetchTopPackages,
} from "../../redux/slices/reportSlice";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
} from "recharts";

export default function Reports() {
  const dispatch = useDispatch();
  const { dashboardStats, monthlyBookings, topPackages, loading } = useSelector(
    (state) => state.reports
  );

  useEffect(() => {
    dispatch(fetchDashboardStats());
    dispatch(fetchMonthlyBookings());
    dispatch(fetchTopPackages());
  }, [dispatch]);

  if (loading) return <div className="p-6">Loading reports...</div>;

  return (
    <div className="p-6 space-y-8">
      <h2 className="text-3xl font-bold text-[#1C7DA2]">Reports & Analytics</h2>

      {/* Stats Grid */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">Total Users</h3>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardStats.total_users}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">Total Packages</h3>
            <p className="text-3xl font-bold text-green-600">
              {dashboardStats.total_packages}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">Total Bookings</h3>
            <p className="text-3xl font-bold text-purple-600">
              {dashboardStats.total_bookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">Pending Bookings</h3>
            <p className="text-3xl font-bold text-orange-600">
              {dashboardStats.pending_bookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">Confirmed Bookings</h3>
            <p className="text-3xl font-bold text-green-600">
              {dashboardStats.confirmed_bookings}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">Domestic Packages</h3>
            <p className="text-3xl font-bold text-blue-600">
              {dashboardStats.domestic_packages}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">International Packages</h3>
            <p className="text-3xl font-bold text-indigo-600">
              {dashboardStats.international_packages}
            </p>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <h3 className="text-gray-600 text-sm">Budget Packages</h3>
            <p className="text-3xl font-bold text-teal-600">
              {dashboardStats.budget_packages}
            </p>
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Monthly Bookings Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-[#1C7DA2]">
            Monthly Bookings Trend
          </h3>
          {monthlyBookings.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyBookings}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="bookings"
                  stroke="#4DBEE3"
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>

        {/* Top Packages Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-xl font-bold mb-4 text-[#1C7DA2]">
            Top Selling Packages
          </h3>
          {topPackages.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topPackages}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="title" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="bookings_count" fill="#4DBEE3" />
              </BarChart>
            </ResponsiveContainer>
          ) : (
            <p className="text-gray-500 text-center py-8">No data available</p>
          )}
        </div>
      </div>

      {/* Top Packages Table */}
      {topPackages.length > 0 && (
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="p-4 bg-blue-100">
            <h3 className="text-xl font-bold text-[#1C7DA2]">
              Top 5 Popular Packages
            </h3>
          </div>
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="p-3 text-left">Package Name</th>
                <th className="p-3 text-left">Country</th>
                <th className="p-3 text-center">Bookings</th>
                <th className="p-3 text-right">Price</th>
              </tr>
            </thead>
            <tbody>
              {topPackages.map((pkg, index) => (
                <tr key={pkg.id} className="border-b hover:bg-blue-50">
                  <td className="p-3">
                    <span className="font-semibold">#{index + 1}</span> {pkg.title}
                  </td>
                  <td className="p-3">{pkg.country}</td>
                  <td className="p-3 text-center">
                    <span className="bg-blue-100 px-3 py-1 rounded-full text-sm">
                      {pkg.bookings_count} bookings
                    </span>
                  </td>
                  <td className="p-3 text-right font-semibold">৳ {pkg.price}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
