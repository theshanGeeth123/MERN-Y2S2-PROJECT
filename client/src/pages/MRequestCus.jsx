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
