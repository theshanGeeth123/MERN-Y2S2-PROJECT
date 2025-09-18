// src/admin/AdminHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";

export default function AdminHome() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-6">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-xl">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Admin Dashboard 👨‍💼
        </h1>
        <p className="text-gray-600 mb-8">Manage your store below:</p>

        <div className="grid grid-cols-1 gap-4">
          <button
            onClick={() => navigate("/admin/add-product")}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
          >
            ➕ Add Product
          </button>

          <button
            onClick={() => navigate("/admin/products")}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            📦 Manage Products
          </button>

          <button
            onClick={() => navigate("/admin/orders")}
            className="w-full py-3 px-4 bg-purple-600 text-white rounded-xl font-medium hover:bg-purple-700 transition"
          >
            🧾 View Orders
          </button>

          <button
            onClick={() => navigate("/admin/user-reports")}
            className="w-full py-3 px-4 bg-emerald-600 text-white rounded-xl font-medium hover:bg-emerald-700 transition"
          >
            👥 User Reports
          </button>

          <button
            onClick={() => navigate("/admin/notifications")}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            🔔 Notification Management
          </button>

          <button
            onClick={() => navigate("/customerManagement")}
            className="w-full py-3 px-4 bg-teal-600 text-white rounded-xl font-medium hover:bg-teal-700 transition"
          >
            👤 Customer Details
          </button>

          <button
            onClick={() => navigate("/admin/reports")}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            📊 Reports
          </button>

        </div>
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
