import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllQueries, deleteQuery } from "../../redux/slices/querySlice";
import { FaEnvelope, FaEnvelopeOpen, FaTrash, FaReply, FaUser, FaPhone } from "react-icons/fa";

export default function Messages() {
  const dispatch = useDispatch();
  const { queries, loading } = useSelector((state) => state.query);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    dispatch(fetchAllQueries());
  }, [dispatch]);
  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this query?")) {
      dispatch(deleteQuery(id));
    }
  };

  const handleReply = (email) => {
    window.location.href = `mailto:${email}`;
  };

  const filteredMessages = queries;

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="text-xl text-gray-600">Loading queries...</div>
      </div>
    );
  }

  return (
    <div>
      <h2 className="text-3xl font-bold text-[#1C7DA2] mb-6">Customer Queries & Messages</h2>

      {/* Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredMessages.map((msg) => (
          <div
            key={msg.id}
            className="bg-white p-6 rounded-xl shadow-md border border-gray-200 hover:shadow-xl transition-shadow"
          >
            {/* Header */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-2">
                <FaEnvelope className="text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-800">{msg.name}</h3>
              </div>
            </div>

            {/* Contact Info */}
            <div className="space-y-2 mb-4">
              <div className="flex items-center text-gray-600 text-sm">
                <FaEnvelope className="mr-2 text-blue-400" />
                <span className="truncate">{msg.email}</span>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <FaPhone className="mr-2 text-blue-400" />
                <span>{msg.phone}</span>
              </div>
            </div>

            {/* Subject */}
            {msg.subject && (
              <div className="mb-3">
                <p className="text-sm font-semibold text-gray-700">Subject:</p>
                <p className="text-sm text-gray-600">{msg.subject}</p>
              </div>
            )}

            {/* Message */}
            <div className="mb-4">
              <p className="text-sm font-semibold text-gray-700 mb-1">Message:</p>
              <p className="text-sm text-gray-600 line-clamp-3">{msg.message}</p>
            </div>

            {/* Date */}
            <div className="text-xs text-gray-400 mb-4">
              {new Date(msg.created_at).toLocaleString()}
            </div>

            {/* Action Buttons */}
            <div className="flex gap-2">
              <button
                onClick={() => handleReply(msg.email)}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-500 text-white py-2 px-3 rounded-lg hover:bg-blue-600 transition"
              >
                <FaReply /> Reply
              </button>
              <button
                onClick={() => handleDelete(msg.id)}
                className="bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      {filteredMessages.length === 0 && (
        <div className="text-center text-gray-500 mt-8">
          No queries found.
        </div>
      )}
    </div>
  );
}
  