// src/admin/AdminHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-semibold text-center text-neutral-900">
          Admin Dashboard
        </h1>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {/* Go to Staff List */}
          <button
            onClick={() => navigate("/admin/staff")}
            className="w-full rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:bg-neutral-50"
          >
            <div className="text-lg font-medium text-neutral-900">Staff Members</div>
            <p className="mt-1 text-sm text-neutral-600">
              View, search, edit and remove staff members.
            </p>
            <span className="mt-4 inline-flex items-center rounded-md bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white">
              Open Staff List
            </span>
          </button>

          {/* Go directly to Add Staff */}
          <button
            onClick={() => navigate("/admin/staff/create")}
            className="w-full rounded-xl border border-neutral-200 bg-white p-6 text-left shadow-sm transition hover:shadow-md hover:bg-neutral-50"
          >
            <div className="text-lg font-medium text-neutral-900">Add Staff</div>
            <p className="mt-1 text-sm text-neutral-600">
              Create a new staff member profile.
            </p>
            <span className="mt-4 inline-flex items-center rounded-md bg-green-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-green-700">
              + New Staff
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminHome;
