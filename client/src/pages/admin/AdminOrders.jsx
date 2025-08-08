// src/pages/admin/AdminOrders.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchAllOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders/all");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch admin orders", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading all orders...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">📊 Admin - All Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">No orders have been placed yet.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white rounded-xl shadow">
            <thead className="bg-indigo-100 text-gray-700">
              <tr>
                <th className="px-4 py-3 text-left">Order ID</th>
                <th className="px-4 py-3 text-left">User Name</th>
                <th className="px-4 py-3 text-left">Email</th>
                <th className="px-4 py-3 text-left">Total</th>
                <th className="px-4 py-3 text-left">Status</th>
                <th className="px-4 py-3 text-left">Date</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <tr key={order._id} className="border-t hover:bg-gray-50">
                  <td className="px-4 py-2">{order._id.slice(-6)}</td>
                  <td className="px-4 py-2">{order.userId?.name || "N/A"}</td>
                  <td className="px-4 py-2">{order.userId?.email || "N/A"}</td>
                  <td className="px-4 py-2 text-green-600 font-medium">${order.total.toFixed(2)}</td>
                  <td className="px-4 py-2 text-blue-700">{order.status}</td>
                  <td className="px-4 py-2 text-gray-500">{new Date(order.createdAt).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
