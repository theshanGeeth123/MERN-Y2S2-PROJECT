// components/mProReqTable.jsx
import React, { useEffect } from "react";
import { useRequestStore } from "../mstore/mRequestStore";

const mProReqTable = ({ limit = 5, refProp }) => {
  const { processedRequests = [], fetchAllProcessedRequests, loading, error } = useRequestStore();

  useEffect(() => {
    fetchAllProcessedRequests("all");
  }, [fetchAllProcessedRequests]);

  if (loading) return <p>Loading processed requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div ref={refProp} className="overflow-x-auto bg-white shadow-md rounded-xl p-6">
      <h2 className="text-lg font-semibold mb-4 text-slate-800">Recent Rental Processed Requests</h2>
      {processedRequests.length === 0 ? (
        <p>No processed requests yet.</p>
      ) : (
        <table className="min-w-full text-left text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Item Name</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Start - End Date</th>
              <th className="py-2 px-4 border">Status</th>
            </tr>
          </thead>
          <tbody>
            {processedRequests.slice(0, limit).map((req) => (
              <tr key={req._id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border">
                  {Array.isArray(req.items)
                    ? req.items.map((item) => item.name).join(", ")
                    : req.items}
                </td>
                <td className="py-2 px-4 border">{req.email}</td>
                <td className="py-2 px-4 border">{req.amount}</td>
                <td className="py-2 px-4 border">
                  {req.startDate && req.endDate
                    ? `${new Date(req.startDate).toLocaleDateString()} - ${new Date(req.endDate).toLocaleDateString()}`
                    : "-"}
                </td>
                <td className="py-2 px-4 border">
                  {req.status ?? "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default mProReqTable;
