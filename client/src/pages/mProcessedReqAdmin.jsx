// pages/mProcessedReq.jsx
import React, { useEffect, useRef } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import AdminNavbar from "../components/AdminNavbar";
import { FileText } from "lucide-react";
import { Link } from "react-router-dom";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import MProReq30days from "../components/mProReqToday";

const mProcessedReq = () => {
  const { processedRequests = [], fetchAllProcessedRequests, loading, error } =
    useRequestStore();
  const containerRef = useRef();

  useEffect(() => {
    fetchAllProcessedRequests("all");
  }, [fetchAllProcessedRequests]);


  if (loading) return <p>Loading processed requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <AdminNavbar />


    <div className="w-full flex justify-end mt-5 pr-6">
      <Link to="/admin/processed-today">
      <button className="px-6 py-2 rounded-full border-2 border-transparent bg-[#333A5C66] bg-origin-border text-gradient-to-r from-slate-900 to-indigo-800 font-semibold hover:scale-105 hover:bg-[#333A5CA0] transition mr-5 ">
        Today Processed Request
      </button>
      </Link>
    </div>

      {/* Wrap everything to capture in PDF */}
      <div ref={containerRef} className="mt-4 bg-white shadow-md rounded-xl p-4">
        <h2 className="text-xl font-bold mb-4 text-center">All Processed Requests</h2>

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
      </div>

      <div className="mt-10 font-light text-center">
        <Link to="/admin/all-rentals" className="text-blue-500 hover:underline">
          Back to Rentals
        </Link>
      </div>
    </div>
  );
};

export default mProcessedReq;
