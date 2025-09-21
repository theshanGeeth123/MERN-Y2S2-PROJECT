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

  // Get logged email
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

  // Fetch processed requests
  useEffect(() => {
    if (userEmail) fetchProcessedRequests(userEmail);
  }, [userEmail, fetchProcessedRequests]);

  // Filter processed requests for cus
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

  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <Navbar />

      <h2 className="text-4xl font-bold mb-10 text-center mt-20 bg-gradient-to-r from-slate-900 to-indigo-800 bg-clip-text text-transparent">
        My Processed Requests</h2>

      {filteredRequests.length === 0 ? (
        <p>No processed requests yet.</p>
      ) : (
        <ul className="space-y-2">
          {filteredRequests.map((req) => (
            <li
              key={req._id}
              className="flex items-center justify-between p-3 border rounded-lg shadow-sm  text-white bg-gray-800"
            >
              <div className="flex items-center">
                <FileText className="mr-3 text-white" />
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
                  <p className="text-sm text-white">
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

      <div className="mt-10 font-light text-center mb-50">
        <Link to="/requests" className="text-lg text-blue-700 hover:underline">
          Back to My Requests
        </Link>
      </div>
    </div>
  );
};

export default MyProcessedRequests;
