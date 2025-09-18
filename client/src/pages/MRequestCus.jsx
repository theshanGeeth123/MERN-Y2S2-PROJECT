// frontend/src/components/MRequestCus.jsx
import React, { useEffect } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import { FileText, Trash2 } from "lucide-react";

const MRequestCus = () => {
  const {
    requests,
    fetchRequestsByUser,
    deleteRequest,
    loading,
    error,
  } = useRequestStore();

  useEffect(() => {
    fetchRequestsByUser();
  }, [fetchRequestsByUser]);

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this request?")) return;
    const result = await deleteRequest(id);
    if (!result.success) alert("Failed: " + result.message);
  };

  if (loading) return <p>Loading your requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li
              key={req._id}
              className="flex items-center justify-between p-3 border rounded shadow-sm"
            >
              <div className="flex items-center">
                <FileText className="mr-3 text-blue-500" />
                <div>
                  <p className="font-semibold">{req.description}</p>
                  <p className="text-sm text-gray-500">
                    Amount: {req.amount} | Status: {req.paymentStatus ?? "pending"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {req.startDate ? new Date(req.startDate).toLocaleString() : ""} —
                    {req.endDate ? " " + new Date(req.endDate).toLocaleString() : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* you can add edit button here */}
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
    </div>
  );
};

export default MRequestCus;





/*
import React, { useEffect } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import { FileText } from "lucide-react";

const MRequestCus = () => {
  const { requests, fetchRequests, loading, error } = useRequestStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  if (loading) return <p>Loading your requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">My Requests</h2>
      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li
              key={req._id}
              className="flex items-center p-3 border rounded shadow-sm"
            >
              <FileText className="mr-3 text-blue-500" />
              <div>
                <p className="font-semibold">{req.description}</p>
                <p className="text-sm text-gray-500">
                  Amount: {req.amount} | Status: {req.status}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MRequestCus;
*/