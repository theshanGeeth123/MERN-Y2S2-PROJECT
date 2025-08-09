import React, { useState, useEffect, useContext } from "react";
import { AppContent } from "../../context/AppContext"
import { useNavigate } from "react-router-dom";

const CustomerHome = () => {
  const navigate = useNavigate();

  const { userData } = useContext(AppContent);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center w-full max-w-md">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          Welcome, Customer 👋
        </h1>
        <p className="text-gray-600 mb-8">Choose an option below:</p>

        <div className="space-y-4">
          <button
            onClick={() => navigate("/products")}
            className="w-full py-3 px-4 bg-blue-600 text-white rounded-xl font-medium hover:bg-blue-700 transition"
          >
            🛍️ View Products
          </button>

          <button
            onClick={() => navigate("/cart")}
            className="w-full py-3 px-4 bg-green-600 text-white rounded-xl font-medium hover:bg-green-700 transition"
          >
            🛒 View Cart
          </button>
        </div>
      </div>

      <button
        onClick={() => navigate("/my-orders")}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        View My Orders
      </button>

      <h1>{userData.email}</h1>
    </div>


  );
};

export default CustomerHome;
