import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";

const MyOrders = () => {
  const { userData } = useContext(AppContent);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders/my-orders");
      setOrders(res.data.orders);
    } catch (err) {
      console.error("Failed to fetch orders", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (loading) return <p className="text-center mt-10">Loading orders...</p>;

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">📦 My Orders</h2>

      {orders.length === 0 ? (
        <p className="text-center text-gray-600">You haven't placed any orders yet.</p>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order._id} className="bg-white rounded-xl shadow p-6">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold">Order #{order._id.slice(-6)}</h3>
                <span className="text-sm text-blue-600">{new Date(order.createdAt).toLocaleDateString()}</span>
              </div>
              <ul className="divide-y divide-gray-200">
                {order.products.map((item) => (
                  <li key={item.productId._id} className="py-2 flex justify-between">
                    <span>{item.productId.name} x {item.quantity}</span>
                    <span className="text-gray-500">${(item.productId.price * item.quantity).toFixed(2)}</span>
                  </li>
                ))}
              </ul>
              <div className="mt-4 text-right font-bold">
                Total: ${order.total.toFixed(2)}
              </div>
              <div className="text-sm text-gray-600 mt-1">
                Status: <span className="text-green-600">{order.status}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrders;
