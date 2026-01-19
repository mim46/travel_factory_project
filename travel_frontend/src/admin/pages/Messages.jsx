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
import { FaEnvelope, FaEnvelopeOpen, FaReply, FaEye, FaTrash, FaQuestionCircle } from "react-icons/fa";

export default function Messages() {
  const dispatch = useDispatch();
  const { adminMessages, queries } = useSelector((state) => state.messages);

  const [filter, setFilter] = useState("all"); // all, message, query, pending, replied
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
    if (filter === "message") return item.type === "message";
    if (filter === "query") return item.type === "query";
    if (filter === "pending") return item.type === "message" ? !item.is_replied : !item.is_read;
    if (filter === "replied") return item.type === "message" ? item.is_replied : item.is_read;
    return true;
  });

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
      <h1 className="text-3xl font-bold text-gray-800 mb-6">💬 Messages & Queries</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-4 gap-6 mb-6">
        <div className="bg-gradient-to-br from-blue-100 to-blue-200 p-6 rounded-xl shadow">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-600 text-sm">Total</p>
              <p className="text-3xl font-bold text-blue-600">{totalItems}</p>
            </div>
            <FaEnvelope className="text-4xl text-blue-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-purple-100 to-purple-200 p-6 rounded-xl shadow">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-600 text-sm">Messages</p>
              <p className="text-3xl font-bold text-purple-600">{messageCount}</p>
            </div>
            <FaEnvelope className="text-4xl text-purple-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-green-100 to-green-200 p-6 rounded-xl shadow">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-600 text-sm">Queries</p>
              <p className="text-3xl font-bold text-green-600">{queryCount}</p>
            </div>
            <FaQuestionCircle className="text-4xl text-green-600" />
          </div>
        </div>

        <div className="bg-gradient-to-br from-yellow-100 to-yellow-200 p-6 rounded-xl shadow">
          <div className="grid grid-cols-[1fr_auto] items-center gap-4">
            <div>
              <p className="text-gray-600 text-sm">Pending</p>
              <p className="text-3xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <FaEnvelopeOpen className="text-4xl text-yellow-600" />
          </div>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="grid grid-cols-5 gap-2">
          <button
            onClick={() => setFilter("all")}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              filter === "all" ? "bg-blue-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            All ({totalItems})
          </button>
          <button
            onClick={() => setFilter("message")}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              filter === "message" ? "bg-purple-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Messages ({messageCount})
          </button>
          <button
            onClick={() => setFilter("query")}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              filter === "query" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Queries ({queryCount})
          </button>
          <button
            onClick={() => setFilter("pending")}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              filter === "pending" ? "bg-yellow-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Pending ({pendingCount})
          </button>
          <button
            onClick={() => setFilter("replied")}
            className={`py-2 px-4 rounded-lg font-medium transition ${
              filter === "replied" ? "bg-green-500 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            Replied ({repliedCount})
          </button>
        </div>
      </div>

      {/* Items Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100">
            <tr>
              <th className="text-left p-4 font-semibold text-gray-700">Type</th>
              <th className="text-left p-4 font-semibold text-gray-700">From</th>
              <th className="text-left p-4 font-semibold text-gray-700">Subject/Message</th>
              <th className="text-left p-4 font-semibold text-gray-700">Status</th>
              <th className="text-left p-4 font-semibold text-gray-700">Date</th>
              <th className="text-center p-4 font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredItems.length === 0 ? (
              <tr>
                <td colSpan="6" className="text-center p-8 text-gray-500">
                  No items found
                </td>
              </tr>
            ) : (
              filteredItems.map((item) => (
                <tr key={`${item.type}-${item.id}`} className="border-t hover:bg-gray-50">
                  <td className="p-4">
                    {item.type === "query" ? (
                      <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Query
                      </span>
                    ) : (
                      <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-xs font-semibold">
                        Message
                      </span>
                    )}
                  </td>
                  <td className="p-4">
                    <div>
                      <p className="font-medium text-gray-800">
                        {item.type === "query" ? item.name : item.user?.name || "Unknown"}
                      </p>
                      <p className="text-sm text-gray-500">
                        {item.type === "query" ? item.email : item.user?.email || "N/A"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 text-gray-800">
                    {item.type === "message" ? item.subject : item.message.substring(0, 50) + "..."}
                  </td>
                  <td className="p-4">
                    {item.type === "message" ? (
                      item.is_replied ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Replied
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Pending
                        </span>
                      )
                    ) : (
                      item.is_read ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Read
                        </span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-700 px-3 py-1 rounded-full text-xs font-semibold">
                          Unread
                        </span>
                      )
                    )}
                  </td>
                  <td className="p-4 text-gray-600 text-sm">
                    {new Date(item.created_at).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    <div className="grid grid-cols-3 gap-2 place-items-center">
                      <button
                        onClick={() => handleView(item)}
                        className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition"
                        title="View"
                      >
                        <FaEye />
                      </button>
                      <button
                        onClick={() => handleReply(item)}
                        className="bg-green-500 hover:bg-green-600 text-white p-2 rounded-lg transition"
                        title="Reply"
                      >
                        <FaReply />
                      </button>
                      <button
                        onClick={() => handleDelete(item)}
                        className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition"
                        title="Delete"
                      >
                        <FaTrash />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
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