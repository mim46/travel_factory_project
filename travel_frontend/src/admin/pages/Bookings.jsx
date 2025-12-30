import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllBookings,
  updateBookingStatus,
  deleteBooking,
} from "../../redux/slices/bookingSlice";
import { FaCalendar, FaUser, FaPhone, FaEnvelope } from "react-icons/fa";

export default function Bookings() {
  const dispatch = useDispatch();
  const { bookings, loading } = useSelector((state) => state.bookings);
  const [statusFilter, setStatusFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllBookings());
  }, [dispatch]);

  const handleStatusChange = (bookingId, newStatus) => {
    dispatch(updateBookingStatus({ id: bookingId, status: newStatus }));
  };

  const handleDelete = (bookingId) => {
    if (window.confirm("Are you sure you want to delete this booking?")) {
      dispatch(deleteBooking(bookingId));
    }
  };

  const filteredBookings =
    statusFilter === "all"
      ? bookings
      : bookings.filter((b) => b.status === statusFilter);

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      case "confirmed":
        return "bg-green-100 text-green-700";
      case "cancelled":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading bookings...</div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-[#1C7DA2]">Bookings Management</h2>

        {/* Filter by Status */}
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
        >
          <option value="all">All Bookings</option>
          <option value="pending">Pending</option>
          <option value="confirmed">Confirmed</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredBookings.map((booking) => (
          <div
            key={booking.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow"
          >
            {/* Package Title */}
            <h3 className="text-xl font-semibold text-[#1C7DA2] mb-2">
              {booking.package?.title || "Package Deleted"}
            </h3>

            {/* Status Badge */}
            <div className="mb-4">
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(
                  booking.status
                )}`}
              >
                {booking.status.toUpperCase()}
              </span>
            </div>

            {/* Customer Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-700">
                <FaUser className="mr-2 text-blue-500" />
                <span>{booking.name}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaEnvelope className="mr-2 text-blue-500" />
                <span className="text-sm">{booking.email}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaPhone className="mr-2 text-blue-500" />
                <span>{booking.phone}</span>
              </div>
              <div className="flex items-center text-gray-700">
                <FaCalendar className="mr-2 text-blue-500" />
                <span>{new Date(booking.travel_date).toLocaleDateString()}</span>
              </div>
            </div>

            {/* Additional Details */}
            <div className="mb-4 text-sm text-gray-600">
              <p>
                <strong>Persons:</strong> {booking.persons}
              </p>
              {booking.special_request && (
                <p className="mt-1">
                  <strong>Special Request:</strong> {booking.special_request}
                </p>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              {booking.status === "pending" && (
                <>
                  <button
                    onClick={() => handleStatusChange(booking.id, "confirmed")}
                    className="flex-1 bg-green-500 text-white py-2 px-3 rounded-lg hover:bg-green-600 transition"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => handleStatusChange(booking.id, "cancelled")}
                    className="flex-1 bg-red-500 text-white py-2 px-3 rounded-lg hover:bg-red-600 transition"
                  >
                    Cancel
                  </button>
                </>
              )}

              {booking.status !== "pending" && (
                <button
                  onClick={() => handleStatusChange(booking.id, "pending")}
                  className="flex-1 bg-yellow-500 text-white py-2 px-3 rounded-lg hover:bg-yellow-600 transition"
                >
                  Set Pending
                </button>
              )}

              <button
                onClick={() => handleDelete(booking.id)}
                className="bg-gray-500 text-white py-2 px-4 rounded-lg hover:bg-gray-600 transition"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredBookings.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No bookings found for the selected filter.
        </div>
      )}
    </div>
  );
}