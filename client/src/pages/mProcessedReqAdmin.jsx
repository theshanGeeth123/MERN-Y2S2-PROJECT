import React, { useEffect } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import AdminNavbar from "../components/AdminNavbar";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";

const mProcessedReq = () => {
  const { processedRequests, fetchAllProcessedRequests, loading, error } = useRequestStore();

  // Fetch all processed requests on mount
  useEffect(() => {
    fetchAllProcessedRequests("all"); // fetch everything
  }, [fetchAllProcessedRequests]);


  if (loading) return <p>Loading processed requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <AdminNavbar />

      <h2 className="text-xl font-bold mb-8 text-center mt-15">All Processed Requests</h2>

      {processedRequests.length === 0 ? (
        <p>No processed requests yet.</p>
      ) : (
        <ul className="space-y-2">
          {processedRequests.map((req) => (
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
                    Email: {req.email} — Processed At:{" "}
                    {req.processedAt ? new Date(req.processedAt).toLocaleString() : "-"}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 font-light text-center">
        <Link to="/admin/all-rentals" className="text-blue-500 hover:underline">
          Back to Rentals
        </Link>
      </div>
    </div>
  );
};

export default mProcessedReq;
