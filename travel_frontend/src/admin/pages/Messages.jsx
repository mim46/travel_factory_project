import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllMessages,
  fetchAllQueries,
  replyToMessage,
  replyToQuery,
  deleteMessage,
  deleteQuery
} from "../../redux/slices/messageSlice";
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaEye, FaTrash, FaQuestionCircle, FaSearch } from "react-icons/fa";

export default function Messages() {
  const dispatch = useDispatch();
  const { adminMessages, queries } = useSelector((state) => state.messages);

  const [viewMode, setViewMode] = useState("all"); // all, message, query, pending, replied
  const [selectedItem, setSelectedItem] = useState(null);
  const [viewModalOpen, setViewModalOpen] = useState(false);
  const [replyModalOpen, setReplyModalOpen] = useState(false);
  const [replyText, setReplyText] = useState("");

  useEffect(() => {
    dispatch(fetchAllMessages());
    dispatch(fetchAllQueries());
  }, [dispatch]);

  // Combine messages and queries
  const allItems = [
    ...adminMessages.map(m => ({ ...m, type: 'message' })),
    ...queries.map(q => ({ ...q, type: 'query' }))
  ].sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

  // Filter items
  const filteredItems = allItems.filter((item) => {
    return viewMode === "all" ||
      (viewMode === "message" && item.type === "message") ||
      (viewMode === "query" && item.type === "query") ||
      (viewMode === "pending" && (item.type === "message" ? !item.is_replied : !item.is_read)) ||
      (viewMode === "replied" && (item.type === "message" ? item.is_replied : item.is_read));
  });

  // Determine what to display
  const displayItems = filteredItems;

  // Stats
  const totalItems = allItems.length;
  const messageCount = adminMessages.length;
  const queryCount = queries.length;
  const pendingCount = allItems.filter(item =>
    item.type === "message" ? !item.is_replied : !item.is_read
  ).length;
  const repliedCount = allItems.filter(item =>
    item.type === "message" ? item.is_replied : item.is_read
  ).length;

  // View Item
  const handleView = (item) => {
    setSelectedItem(item);
    setViewModalOpen(true);
  };

  // Open Reply Modal
  const handleReply = (item) => {
    setSelectedItem(item);
    setReplyText(item.admin_reply || "");
    setReplyModalOpen(true);
  };

  // Submit Reply
  const handleSubmitReply = () => {
    if (!replyText.trim()) {
      alert("⚠️ Please enter a reply!");
      return;
    }

    if (selectedItem.type === 'message') {
      dispatch(replyToMessage({ id: selectedItem.id, admin_reply: replyText }));
    } else {
      dispatch(replyToQuery({ id: selectedItem.id, admin_reply: replyText }));
    }

    alert("✅ Reply sent successfully!");
    setReplyModalOpen(false);
    setReplyText("");
  };

  // Delete Item
  const handleDelete = (item) => {
    if (window.confirm(`Are you sure you want to delete this ${item.type}?`)) {
      if (item.type === 'message') {
        dispatch(deleteMessage(item.id));
      } else {
        dispatch(deleteQuery(item.id));
      }
      alert("✅ Deleted successfully!");
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold text-[#1C7DA2] mb-6">Messages & Queries</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-6">
        <div
          onClick={() => setViewMode("all")}
          className={`bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition transform hover:scale-105 ${viewMode === "all" ? "ring-4 ring-blue-400" : ""}`}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-700 text-base font-semibold mb-1">Total</p>
              <p className="text-2xl font-extrabold text-blue-600">{totalItems}</p>
            </div>
            <FaEnvelope className="text-4xl text-blue-600" />
          </div>
        </div>

        <div
          onClick={() => setViewMode("message")}
          className={`bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition transform hover:scale-105 ${viewMode === "message" ? "ring-4 ring-purple-400" : ""}`}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-700 text-base font-semibold mb-1">Messages</p>
              <p className="text-2xl font-extrabold text-purple-600">{messageCount}</p>
            </div>
            <FaEnvelope className="text-4xl text-purple-600" />
          </div>
        </div>

        <div
          onClick={() => setViewMode("query")}
          className={`bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition transform hover:scale-105 ${viewMode === "query" ? "ring-4 ring-green-400" : ""}`}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-700 text-base font-semibold mb-1">Queries</p>
              <p className="text-2xl font-extrabold text-green-600">{queryCount}</p>
            </div>
            <FaQuestionCircle className="text-4xl text-green-600" />
          </div>
        </div>

        <div
          onClick={() => setViewMode("pending")}
          className={`bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition transform hover:scale-105 ${viewMode === "pending" ? "ring-4 ring-yellow-400" : ""}`}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-700 text-base font-semibold mb-1">Pending</p>
              <p className="text-2xl font-extrabold text-yellow-600">{pendingCount}</p>
            </div>
            <FaEnvelopeOpen className="text-4xl text-yellow-600" />
          </div>
        </div>

        <div
          onClick={() => setViewMode("replied")}
          className={`bg-gradient-to-br from-teal-100 to-teal-200 p-6 rounded-xl shadow cursor-pointer hover:shadow-lg transition transform hover:scale-105 ${viewMode === "replied" ? "ring-4 ring-teal-400" : ""}`}
        >
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-700 text-base font-semibold mb-1">Replied</p>
              <p className="text-2xl font-extrabold text-teal-600">{repliedCount}</p>
            </div>
            <FaEnvelope className="text-4xl text-teal-600" />
          </div>
        </div>
      </div>



      {/* Items Table */}
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="text-lg font-semibold text-gray-800">
            {viewMode === "message" ? "All Messages" :
              viewMode === "query" ? "All Queries" :
                viewMode === "pending" ? "Pending Items" :
                  viewMode === "replied" ? "Replied Items" : "All Messages & Queries"}
          </h3>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">From</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Subject/Message</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase">Date</th>
                <th className="px-4 py-3 text-center text-xs font-semibold text-gray-600 uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {displayItems.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center p-8 text-gray-500 text-sm">
                    No items found
                  </td>
                </tr>
              ) : (
                displayItems.map((item) => (
                  <tr key={`${item.type}-${item.id}`} className="hover:bg-blue-50 transition">
                    <td className="px-4 py-3">
                      {item.type === "query" ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          Query
                        </span>
                      ) : (
                        <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-[10px] font-bold uppercase">
                          Message
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold bg-gradient-to-br ${item.type === 'query' ? 'from-green-500 to-green-600' : 'from-purple-500 to-purple-600'}`}>
                          {(item.type === "query" ? item.name : item.user?.name || "U").charAt(0).toUpperCase()}
                        </div>
                        <div className="ml-3">
                          <p className="text-sm font-medium text-gray-800">
                            {item.type === "query" ? item.name : item.user?.name || "Unknown"}
                          </p>
                          <p className="text-[10px] text-gray-500">
                            {item.type === "query" ? item.email : item.user?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-800">
                      {item.type === "message" ? (
                        <span className="font-semibold">{item.subject}</span>
                      ) : (
                        <span className="italic text-gray-600">{item.message.substring(0, 40)}...</span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      {item.type === "message" ? (
                        item.is_replied ? (
                          <span className="text-green-600 text-xs font-bold">Replied</span>
                        ) : (
                          <span className="text-yellow-600 text-xs font-bold">Pending</span>
                        )
                      ) : (
                        item.is_read ? (
                          <span className="text-blue-600 text-xs font-bold">Read</span>
                        ) : (
                          <span className="text-orange-600 text-xs font-bold">Unread</span>
                        )
                      )}
                    </td>
                    <td className="px-4 py-3 text-xs text-gray-600 whitespace-nowrap">
                      {new Date(item.created_at).toLocaleDateString()}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => handleReply(item)}
                          className="bg-green-600 hover:bg-green-700 text-white w-16 py-1.5 rounded-md text-[10px] font-bold transition shadow-sm"
                        >
                          Reply
                        </button>
                        <button
                          onClick={() => handleDelete(item)}
                          className="bg-red-600 hover:bg-red-700 text-white w-16 py-1.5 rounded-md text-[10px] font-bold transition shadow-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Modal */}
      {viewModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedItem.type === "query" ? "Query Details" : "Message Details"}
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Type</label>
                <p>
                  {selectedItem.type === "query" ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Query
                    </span>
                  ) : (
                    <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                      Message
                    </span>
                  )}
                </p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">From</label>
                <p className="text-gray-800 font-medium">
                  {selectedItem.type === "query"
                    ? `${selectedItem.name} (${selectedItem.email})`
                    : `${selectedItem.user?.name} (${selectedItem.user?.email})`}
                </p>
              </div>

              {selectedItem.type === "message" && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Subject</label>
                  <p className="text-gray-800 font-medium">{selectedItem.subject}</p>
                </div>
              )}

              <div>
                <label className="text-sm font-semibold text-gray-600">Message</label>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{selectedItem.message}</p>
              </div>

              {selectedItem.type === "message" && selectedItem.admin_reply && (
                <div>
                  <label className="text-sm font-semibold text-gray-600">Your Reply</label>
                  <p className="text-gray-800 bg-green-50 p-4 rounded-lg border-l-4 border-green-500">
                    {selectedItem.admin_reply}
                  </p>
                </div>
              )}
            </div>

            <div className="grid grid-cols-1 gap-3 mt-6">
              <button
                onClick={() => setViewModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Reply Modal */}
      {replyModalOpen && selectedItem && (
        <div className="fixed inset-0 bg-black/50 grid place-items-center z-50">
          <div className="bg-white rounded-xl p-6 w-full max-w-2xl shadow-2xl">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              {selectedItem.admin_reply ? "Edit Reply" : "Reply to Message"}
            </h2>

            <div className="grid gap-4">
              <div>
                <label className="text-sm font-semibold text-gray-600">Original Message</label>
                <p className="text-gray-800 bg-gray-50 p-4 rounded-lg">{selectedItem.message}</p>
              </div>

              <div>
                <label className="text-sm font-semibold text-gray-600">Your Reply</label>
                <textarea
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="5"
                  placeholder="Enter your reply..."
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3 mt-6">
              <button
                onClick={() => setReplyModalOpen(false)}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg font-semibold transition"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmitReply}
                className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded-lg font-semibold transition"
              >
                Send Reply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 