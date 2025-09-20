import React, { useEffect, useState } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import { Link } from "react-router-dom";
import { FileText, Trash2, Edit } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const MRequestCus = () => {
  const {
    requests,
    fetchRequests,
    deleteRequest,
    updateRequest,
    loading,
    error,
  } = useRequestStore();

  const [filteredRequests, setFilteredRequests] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  // modal state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState(null);

  // Get logged user email
  useEffect(() => {
    const customerData = localStorage.getItem("customer");
    if (customerData) {
      try {
        const email = JSON.parse(customerData).email;
        setUserEmail(email);
      } catch (err) {
        console.error("Failed to parse customer data:", err);
      }
    }
  }, []);

  // Fetch requests once
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // Filter only current user’s requests
  useEffect(() => {
    if (requests && userEmail) {
      const userRequests = requests.filter(
        (req) =>
          req.email &&
          userEmail &&
          req.email.trim().toLowerCase() === userEmail.trim().toLowerCase()
      );
      setFilteredRequests(userRequests);
    }
  }, [requests, userEmail]);

  // Delete
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    const result = await deleteRequest(id);
    if (!result.success) {
      alert("Failed: " + result.message);
    } else {
      toast.success("Request deleted successfully", { autoClose: 2000 });
    }
  };

  // Delete Request (alternative)
  const handleDeletePost = async (rid) => {
    if (!window.confirm("Are you sure you want to delete this request?")) return;
    const { success, message } = await deleteRequest(rid);
    if (success) {
      toast.success(`Item Deleted Successfully`, { position: "top-center", autoClose: 3000 });
    } else {
      toast.error(`Failed to delete: ${message}`, { position: "top-center", autoClose: 3000 });
    }
  };

  // Open Edit Modal
  const handleEdit = (req) => {
    setEditData({ ...req });
    setIsEditing(true);
  };

  // Update Request
  const handleUpdate = async () => {
    if (!editData) return;
    const { success, message } = await updateRequest(editData._id, editData);
    if (success) {
      toast.success("Request updated successfully", { autoClose: 2000 });
      setIsEditing(false);
    } else {
      toast.error("Update failed: " + message);
    }
  };

  if (loading) return <p>Loading your requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!userEmail) return <p>Loading your account...</p>;

  return (
    <div className="p-4">
      <Navbar />
      <div className="w-full flex justify-end mt-5 pr-6">
        <Link to="/my-requests">
          <button className="flex items-center gap-2 px-6 py-2 rounded-full border-2 border-black bg-white text-black font-semibold hover:border-transparent hover:bg-gradient-to-r from-[#07E041AA] to-[#078DE0AA] hover:text-white transition mr-2">
            My Processed Requests
          </button>
        </Link>
      </div>

      <h2 className="text-xl font-bold mb-8 text-center">My Requests</h2>

      {filteredRequests.length === 0 ? (
        <p>No requests found for your account.</p>
      ) : (
        <ul className="space-y-2">
          {filteredRequests.map((req) => (
            <li
              key={req._id}
              className="flex items-center justify-between p-3 border rounded shadow-sm"
            >
              <div className="flex items-center">
                <FileText className="mr-3 text-blue-500" />
                <div>
                  <div className="font-semibold">
                    {Array.isArray(req.items)
                      ? req.items.map((item, idx) => (
                          <span key={idx}>
                            {item.name} (x{item.qty ?? 1})
                            {idx < req.items.length - 1 && ", "}
                          </span>
                        ))
                      : req.items}
                  </div>

                  <p className="text-sm text-gray-500">
                    Amount: {req.amount} | Payment : {req.paymentStatus ?? "pending"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {req.startDate ? new Date(req.startDate).toLocaleString() : ""} —{" "}
                    {req.endDate ? new Date(req.endDate).toLocaleString() : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(req)}
                  className="p-2 rounded hover:bg-gray-100"
                  title="Edit request"
                >
                  <Edit />
                </button>

                <button
                  onClick={() => handleDeletePost(req._id)}
                  className="p-2 rounded hover:bg-gray-100"
                  title="Delete request"
                >
                  <Trash2 />
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 font-light text-center">
        <Link to="/all-rentals" className="text-blue-500 hover:underline">
          Back to Rentals
        </Link>
      </div>

      {/* Edit Modal */}
      {isEditing && editData && (
        <div
          className="fixed inset-0 bg-black/50 flex justify-center items-center z-50"
          onClick={() => setIsEditing(false)}
        >
          <div
            className="bg-white p-6 rounded-2xl w-11/12 max-w-md max-h-[90vh] overflow-auto space-y-4"
            onClick={(e) => e.stopPropagation()}
          >
            <h2 className="text-2xl font-semibold text-center">Update Request</h2>

            <input
              type="text"
              className="w-full p-3 rounded border bg-gray-100"
              value={editData.name || ""}
              readOnly
            />
            <input
              type="email"
              className="w-full p-3 rounded border bg-gray-100"
              value={editData.email || ""}
              readOnly
            />
            <input
              type="number"
              className="w-full p-3 rounded border bg-gray-100"
              value={editData.amount || ""}
              readOnly
            />

            <input
              type="text"
              className="w-full p-3 rounded border"
              value={editData.description || ""}
              onChange={(e) =>
                setEditData({ ...editData, description: e.target.value })
              }
              placeholder="Description"
            />
            <input
              type="text"
              className="w-full p-3 rounded border"
              value={editData.account || ""}
              onChange={(e) =>
                setEditData({
                  ...editData,
                  account: e.target.value.replace(/\D/g, ""),
                })
              }
              placeholder="Refund Account Number"
            />

            <input
              type="date"
              className="w-full p-3 rounded border"
              value={
                editData.startDate
                  ? new Date(editData.startDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditData({ ...editData, startDate: e.target.value })
              }
            />
            <input
              type="date"
              className="w-full p-3 rounded border"
              value={
                editData.endDate
                  ? new Date(editData.endDate).toISOString().split("T")[0]
                  : ""
              }
              onChange={(e) =>
                setEditData({ ...editData, endDate: e.target.value })
              }
            />

            <div className="bg-gray-100 p-3 rounded border text-sm">
              {Array.isArray(editData.items)
                ? editData.items.map((item, idx) => (
                    <span key={idx}>
                      {item.name} (x{item.qty ?? 1})
                      {idx < editData.items.length - 1 && " , "}
                    </span>
                  ))
                : editData.items}
            </div>

            <input
              type="text"
              className="w-full p-3 rounded border bg-gray-100"
              value={editData.paymentStatus || "pending"}
              readOnly
            />

            <div className="flex justify-center space-x-2 mt-3">
              <button
                onClick={() => {
                  const { description, account, startDate, endDate } = editData;

                  // ✅ Required fields
                  if (!description || !account || !startDate || !endDate) {
                    toast.error("All fields are required!", { autoClose: 2000 });
                    return;
                  }

                  // ✅ Start date cannot be in the past
                  const todayStr = new Date().toISOString().split("T")[0];
                  if (startDate < todayStr) {
                    toast.error("Start date cannot be in the past!", { autoClose: 2000 });
                    return;
                  }

                  // ✅ End date must be after start date
                  if (endDate <= startDate) {
                    toast.error("End date must be after start date!", { autoClose: 2000 });
                    return;
                  }

                  handleUpdate();
                }}
                className="px-4 py-2 bg-green-500 text-white rounded-full font-bold hover:bg-green-600 transition-colors"
              >
                Save
              </button>
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-500 text-white rounded-full font-bold hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MRequestCus;
