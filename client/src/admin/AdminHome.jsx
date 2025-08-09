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
            onClick={() => navigate("/admin/reports")}
            className="w-full py-3 px-4 bg-indigo-600 text-white rounded-xl font-medium hover:bg-indigo-700 transition"
          >
            📊 Reports
          </button>
        </div>
      </div>
    </div>
  );
}
