import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDashboardStats } from "../../redux/slices/reportSlice";
import { FaCalendarAlt, FaFilter } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Reports() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { dashboardStats, loading } = useSelector((state) => state.reports);
  const [selectedStat, setSelectedStat] = useState(null);
  const [tableData, setTableData] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);

  // Date filter states
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  useEffect(() => {
    dispatch(fetchDashboardStats());
  }, [dispatch]);

  const fetchStatDetails = async (statType) => {
    setTableLoading(true);
    setSelectedStat(statType);

    try {
      const token = localStorage.getItem('token');
      let endpoint = '';

      switch (statType) {
        case 'users':
          endpoint = 'http://localhost:8000/api/admin/users';
          break;
        case 'packages':
          endpoint = 'http://localhost:8000/api/packages';
          break;
        case 'bookings':
          endpoint = 'http://localhost:8000/api/admin/bookings';
          break;
        case 'pending_bookings':
          endpoint = 'http://localhost:8000/api/admin/bookings';
          break;
        case 'confirmed_bookings':
          endpoint = 'http://localhost:8000/api/admin/bookings';
          break;
        case 'domestic_packages':
          endpoint = 'http://localhost:8000/api/packages';
          break;
        case 'international_packages':
          endpoint = 'http://localhost:8000/api/packages';
          break;
        case 'budget_packages':
          endpoint = 'http://localhost:8000/api/packages';
          break;
        default:
          endpoint = 'http://localhost:8000/api/admin/bookings';
      }

      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();

        // Filter data based on type
        let filteredData = data;

        if (statType === 'pending_bookings') {
          filteredData = data.filter(b => b.status === 'pending');
        } else if (statType === 'confirmed_bookings') {
          filteredData = data.filter(b => b.status === 'confirmed');
        } else if (statType === 'domestic_packages') {
          filteredData = data.filter(p => p.package_type === 'domestic');
        } else if (statType === 'international_packages') {
          filteredData = data.filter(p => p.package_type === 'international');
        } else if (statType === 'budget_packages') {
          filteredData = data.filter(p => p.package_type === 'budget');
        }

        setTableData(filteredData);
      }
    } catch (error) {
      console.error('Error fetching details:', error);
    } finally {
      setTableLoading(false);
    }
  };

  const fetchSalesReport = async () => {
    if (!fromDate || !toDate) {
      alert('Please select both From and To dates');
      return;
    }

    // Navigate to sales report page with date parameters
    navigate(`/admin/sales-report?from=${fromDate}&to=${toDate}`);
  };

  const renderTable = () => {
    if (!selectedStat || tableData.length === 0) return null;

    // Users Table
    if (selectedStat === 'users') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <div className="p-4 bg-blue-600 text-white">
            <h3 className="text-xl font-bold">All Users</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Name</th>
                  <th className="p-3 text-left">Email</th>
                  <th className="p-3 text-left">Phone</th>
                  <th className="p-3 text-left">Role</th>
                  <th className="p-3 text-left">Joined</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((user, index) => (
                  <tr key={user.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-semibold">{user.name}</td>
                    <td className="p-3">{user.email}</td>
                    <td className="p-3">{user.phone || 'N/A'}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${user.role === 'admin' ? 'bg-red-100 text-red-700' : 'bg-blue-100 text-blue-700'
                        }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Packages Table
    if (selectedStat === 'packages' || selectedStat === 'domestic_packages' ||
      selectedStat === 'international_packages' || selectedStat === 'budget_packages') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <div className="p-4 bg-green-600 text-white">
            <h3 className="text-xl font-bold">
              {selectedStat === 'domestic_packages' ? 'Domestic Packages' :
                selectedStat === 'international_packages' ? 'International Packages' :
                  selectedStat === 'budget_packages' ? 'Budget Packages' : 'All Packages'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Title</th>
                  <th className="p-3 text-left">Country</th>
                  <th className="p-3 text-left">Type</th>
                  <th className="p-3 text-right">Price</th>
                  <th className="p-3 text-left">Duration</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((pkg, index) => (
                  <tr key={pkg.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-semibold">{pkg.title}</td>
                    <td className="p-3">{pkg.country}</td>
                    <td className="p-3">
                      <span className="px-3 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700">
                        {pkg.package_type}
                      </span>
                    </td>
                    <td className="p-3 text-right font-bold text-blue-600">৳{Number(pkg.price).toLocaleString()}</td>
                    <td className="p-3">{pkg.duration}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }

    // Bookings Table
    if (selectedStat === 'bookings' || selectedStat === 'pending_bookings' ||
      selectedStat === 'confirmed_bookings') {
      return (
        <div className="bg-white rounded-lg shadow overflow-hidden mt-8">
          <div className="p-4 bg-purple-600 text-white">
            <h3 className="text-xl font-bold">
              {selectedStat === 'pending_bookings' ? 'Pending Bookings' :
                selectedStat === 'confirmed_bookings' ? 'Confirmed Bookings' : 'All Bookings'}
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-3 text-left">ID</th>
                  <th className="p-3 text-left">Customer</th>
                  <th className="p-3 text-left">Package</th>
                  <th className="p-3 text-left">Travel Date</th>
                  <th className="p-3 text-center">Persons</th>
                  <th className="p-3 text-right">Total</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Payment</th>
                </tr>
              </thead>
              <tbody>
                {tableData.map((booking, index) => (
                  <tr key={booking.id} className="border-b hover:bg-gray-50">
                    <td className="p-3">{index + 1}</td>
                    <td className="p-3 font-semibold">{booking.name}</td>
                    <td className="p-3">{booking.package?.title || 'N/A'}</td>
                    <td className="p-3">{new Date(booking.travel_date).toLocaleDateString()}</td>
                    <td className="p-3 text-center">{booking.persons}</td>
                    <td className="p-3 text-right font-bold text-blue-600">৳{Number(booking.total_price).toLocaleString()}</td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' :
                        booking.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                        {booking.status}
                      </span>
                    </td>
                    <td className="p-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-bold ${booking.payment_status === 'paid' || booking.payment_status === 'completed' ? 'bg-green-100 text-green-700' :
                        booking.payment_status === 'partially_paid' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {booking.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      );
    }
  };

  if (loading) return <div className="p-6">Loading reports...</div>;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-[#1C7DA2]">Reports & Analytics</h2>
        </div>
        {selectedStat && (
          <button
            onClick={() => {
              setSelectedStat(null);
              setTableData([]);
            }}
            className="px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg transition"
          >
            Clear Selection
          </button>
        )}
      </div>

      {/* Date Filter Section - Always Visible */}
      <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-6 rounded-xl shadow-lg border-2 border-indigo-200">

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">From Date</label>
            <input
              type="date"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">To Date</label>
            <input
              type="date"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-400 focus:outline-none"
            />
          </div>
          <div>
            <button
              onClick={fetchSalesReport}
              className="w-full px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition font-semibold shadow-lg"
            >
              Generate Sales Report
            </button>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div
            onClick={() => fetchStatDetails('users')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">Total Users</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.total_users}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>

          <div
            onClick={() => fetchStatDetails('packages')}
            className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">Total Packages</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.total_packages}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>

          <div
            onClick={() => fetchStatDetails('bookings')}
            className="bg-gradient-to-br from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">Total Bookings</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.total_bookings}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>

          <div
            onClick={() => fetchStatDetails('pending_bookings')}
            className="bg-gradient-to-br from-orange-500 to-orange-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">Pending Bookings</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.pending_bookings}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>

          <div
            onClick={() => fetchStatDetails('confirmed_bookings')}
            className="bg-gradient-to-br from-green-500 to-green-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">Confirmed Bookings</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.confirmed_bookings}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>

          <div
            onClick={() => fetchStatDetails('domestic_packages')}
            className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">Domestic Packages</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.domestic_packages}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>

          <div
            onClick={() => fetchStatDetails('international_packages')}
            className="bg-gradient-to-br from-indigo-500 to-indigo-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">International Packages</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.international_packages}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>

          <div
            onClick={() => fetchStatDetails('budget_packages')}
            className="bg-gradient-to-br from-teal-500 to-teal-600 p-6 rounded-lg shadow-lg cursor-pointer hover:shadow-xl transition-all hover:scale-105 text-white"
          >
            <h3 className="text-white/95 text-base font-bold mb-2">Budget Packages</h3>
            <p className="text-2xl font-extrabold">{dashboardStats.budget_packages}</p>
            <p className="text-white/60 text-xs mt-2">Click to view details</p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {tableLoading && (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          <p className="mt-4 text-gray-600">Loading data...</p>
        </div>
      )}

      {/* Render Table */}
      {!tableLoading && renderTable()}
    </div>
  );
}
