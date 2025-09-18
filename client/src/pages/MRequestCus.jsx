import React, { useEffect, useState } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import {Link} from "react-router-dom";
import { FileText, Trash2, Edit} from "lucide-react";
import Navbar from "../components/Navbar";

const MRequestCus = () => {
  const {
    requests,
    fetchRequests,
    deleteRequest,
    loading,
    error,
  } = useRequestStore();

  const [filteredRequests, setFilteredRequests] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  // ✅ Get logged-in user email from localStorage 'customer'
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

  // ✅ Load all requests once
  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  // ✅ Filter requests by logged-in email
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

  // Delete request
  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    const result = await deleteRequest(id);
    if (!result.success) alert("Failed: " + result.message);
  };

  // Edit request
  const handleEdit = (id) => {
    // navigate to edit page or open modal
    alert("Edit request with ID: " + id);
  };

  if (loading) return <p>Loading your requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!userEmail) return <p>Loading your account...</p>;

  return (
    <div className="p-4">
      <Navbar/>
      <h2 className="text-xl font-bold mb-8 mt-15 text-center ">My Requests</h2>

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
                  {/* Items list */}
                  <div className="font-semibold">
                    {Array.isArray(req.items) ? (
                      req.items.map((item, idx) => (
                        <span key={idx}>
                          {item.name}
                          {item.qty ? ` (x${item.qty})` : ""}
                          {idx < req.items.length - 1 && ", "}
                        </span>
                      ))
                    ) : (
                      <span>{req.items}</span>
                    )}
                  </div>

                  <p className="text-sm text-gray-500">
                    Amount: {req.amount} | Status:{" "}
                    {req.paymentStatus ?? "pending"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {req.startDate
                      ? new Date(req.startDate).toLocaleString()
                      : ""}{" "}
                    —{" "}
                    {req.endDate
                      ? " " + new Date(req.endDate).toLocaleString()
                      : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleEdit(req._id)}
                  className="p-2 rounded hover:bg-gray-100"
                  title="Edit request"
                >
                  <Edit />
                </button>

                <button
                  onClick={() => handleDelete(req._id)}
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
      <div className="mt-2 font-light mt-10 text-center">
          <Link
          to="/all-rentals"
          className="text-blue-500 hover:underline"
          >
            Back to Rentals
          </Link>
         </div>
      
    </div>
  );
};

export default MRequestCus;
