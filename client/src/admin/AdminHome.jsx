import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Heading at top center */}
        <h1 className="text-3xl font-semibold text-center text-neutral-900 mb-8">
          Admin Dashboard
        </h1>

        {/* Button box at top left */}
        <div className="grid gap-4 max-w-sm">
          <button
            onClick={() => navigate("/admin/packages")}
            className="w-full rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:bg-neutral-50"
          >
            <div className="text-lg font-medium text-neutral-900">Packages</div>
            <p className="mt-1 text-sm text-neutral-600">
              Create, View, Search, Edit and Remove available packages.
            </p>
            <span className="mt-4 inline-flex items-center rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white">
              Package List
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
