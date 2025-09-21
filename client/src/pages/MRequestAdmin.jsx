import React, { useEffect } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import { Link } from "react-router-dom";
import { FileText, Check, X, Trash2 } from "lucide-react";
import AdminNavbar from "../components/NavbarAdmin";

const MRequestAdmin = () => {
  const { requests, fetchRequests, deleteRequest, loading, error, updateRequestStatus } =
    useRequestStore();

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

 
  const handleAction = async (id, action) => {
    const result = await updateRequestStatus(id, action);
    if (!result.success) {
      alert("Failed: " + result.message);
    }
  };


  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="p-4">
      <AdminNavbar />

      <div className="w-full flex justify-end mt-5 pr-6">
              <Link to="/admin/processed-requests">
                <button className="px-6 py-2 rounded-full border-2 border-transparent bg-[#333A5C66] bg-origin-border text-gradient-to-r from-slate-900 to-indigo-800 font-semibold hover:scale-105 hover:bg-[#333A5CA0] transition mr-5 ">
                  Processed Requests
                </button>
              </Link>
            </div>
      <h2 className="text-xl font-bold mb-8 text-center mt-15">
        Rental Requests
      </h2>

      {requests.length === 0 ? (
        <p>No requests found.</p>
      ) : (
        <ul className="space-y-2">
          {requests.map((req) => (
            <li
              key={req._id}
              className="flex items-center justify-between p-3 border rounded shadow-sm"
            >
              <div className="flex items-start">
                <FileText className="mr-3 text-blue-500 mt-1" />
                <div>
                  <p className="text-sm text-gray-700 font-medium">
                    Customer: {req.email}
                  </p>
                  <div className="font-semibold">
                    {Array.isArray(req.items)
                      ? req.items.map((item, idx) => (
                          <span key={idx}>
                            {item.name}
                            {item.qty ? ` (x${item.qty})` : ""}
                            {idx < req.items.length - 1 && ", "}
                          </span>
                        ))
                      : req.items}
                  </div>
                  <p className="text-sm text-gray-500">
                    Amount: {req.amount} | Status: {req.paymentStatus ?? "pending"}
                  </p>
                  <p className="text-xs text-gray-400">
                    {req.startDate ? new Date(req.startDate).toLocaleString() : ""} —
                    {req.endDate ? " " + new Date(req.endDate).toLocaleString() : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-center gap-2">
                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to ACCEPT this request?")) {
                      handleAction(req._id, "accept");
                    }
                  }}
                  className="flex items-center gap-1 p-2 rounded hover:bg-green-100"
                  title="Accept request"
                >
                  <Check className="text-green-500" /> Accept
                </button>

                <button
                  onClick={() => {
                    if (window.confirm("Are you sure you want to REJECT this request?")) {
                      handleAction(req._id, "reject");
                    }
                  }}
                  className="flex items-center gap-1 p-2 rounded hover:bg-red-100"
                  title="Reject request"
                >
                  <X className="text-red-500" /> Reject
                </button>
              </div>

            </li>
          ))}
        </ul>
      )}

      <div className="mt-10 font-light text-center mb-40">
              <Link to="/admin/all-rentals" className="text-lg text-blue-800 hover:underline">
                Back to Rentals
              </Link>
            </div>
    </div>
  );
};

export default MRequestAdmin;
