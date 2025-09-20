import React, { useEffect, useState } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import { Link } from "react-router-dom";
import { FileText } from "lucide-react";
import Navbar from "../components/Navbar";
import { toast } from "react-toastify";

const MyProcessedRequests = () => {
  const { processedRequests, fetchProcessedRequests, loading, error } = useRequestStore();
  const [userEmail, setUserEmail] = useState(null);
  const [filteredRequests, setFilteredRequests] = useState([]);

  // ✅ Get logged user email
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

  // ✅ Fetch processed requests once email is known
  useEffect(() => {
    if (userEmail) fetchProcessedRequests(userEmail);
  }, [userEmail, fetchProcessedRequests]);

  // ✅ Filter processed requests for current user
  useEffect(() => {
    if (processedRequests && userEmail) {
      const userReqs = processedRequests.filter(
        (req) =>
          req.email &&
          userEmail &&
          req.email.trim().toLowerCase() === userEmail.trim().toLowerCase()
      );
      setFilteredRequests(userReqs);
    }
  }, [processedRequests, userEmail]);

  if (loading) return <p>Loading your processed requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!userEmail) return <p>Loading your account...</p>;

  return (
    <div className="p-4">
      <Navbar />

      <h2 className="text-xl font-bold mb-8 text-center">My Processed Requests</h2>

      {filteredRequests.length === 0 ? (
        <p>No processed requests yet.</p>
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
                            {item.name} 
                            {idx < req.items.length - 1 && ", "}
                          </span>
                        ))
                      : req.items}
                  </div>
                  <p className="text-sm text-gray-500">
                    Amount: {req.amount} | Status: <strong>{req.status}</strong>
                  </p>
                  <p className="text-xs text-gray-400">
                    Processed At:{" "}
                    {req.processedAt
                      ? new Date(req.processedAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
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
    </div>
  );
};

export default MyProcessedRequests;
