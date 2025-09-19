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
                            {item.name} (x{item.qty ?? 1})
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


/*
import React, { useEffect, useState } from "react";

const MyProcessedRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Assume you store user email in localStorage after login
  const userEmail = localStorage.getItem("customer");

  useEffect(() => {
    const fetchProcessedRequests = async () => {
      try {
        if (!userEmail) {
          setError("No user email found. Please log in.");
          setLoading(false);
          return;
        }

        const res = await fetch(
          `http://localhost:4000/api/requests/processed?email=${userEmail}`
        );
        const data = await res.json();

        if (data.success) {
          setRequests(data.data);
        } else {
          setError(data.message || "Failed to fetch processed requests");
        }
      } catch (err) {
        setError("Server error: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchProcessedRequests();
  }, [userEmail]);

  if (loading) return <p className="text-center p-4">Loading...</p>;
  if (error) return <p className="text-center text-red-500 p-4">{error}</p>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-bold mb-4">My Processed Requests</h2>
      {requests.length === 0 ? (
        <p className="text-gray-500">No processed requests found.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <div
              key={req._id}
              className="border rounded-lg shadow-sm p-4 flex justify-between items-center"
            >
              <div>
                <p className="font-semibold">Amount: ${req.amount}</p>
                <p className="text-gray-600">
                  Items:{" "}
                  {req.items && req.items.length > 0
                    ? req.items.map((i) => `${i.name} (x${i.qty})`).join(", ")
                    : "N/A"}
                </p>
                <p className="text-sm text-gray-500">
                  Period: {req.startDate ? new Date(req.startDate).toLocaleDateString() : "—"}{" "}
                  - {req.endDate ? new Date(req.endDate).toLocaleDateString() : "—"}
                </p>
              </div>
              <div>
                <span
                  className={`px-3 py-1 rounded-full text-white ${
                    req.status === "accept"
                      ? "bg-green-500"
                      : req.status === "reject"
                      ? "bg-red-500"
                      : "bg-gray-400"
                  }`}
                >
                  {req.status}
                </span>
                <p className="text-xs text-gray-400 mt-1">
                  {new Date(req.processedAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyProcessedRequests;
*/