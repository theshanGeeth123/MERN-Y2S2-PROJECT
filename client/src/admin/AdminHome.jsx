import React from "react";
import { useNavigate } from "react-router-dom";

const AdminHome = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-purple-100 to-indigo-200 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">Welcome, Admin 👨‍💼</h1>
        <p className="text-gray-600 mb-8">Manage your products below:</p>

        <div className="space-y-4">
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
            📋 View / Manage Products
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;
