import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);

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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axios.put(`http://localhost:4000/api/orders/update-status/${orderId}`, {
        status: newStatus,
      });
      fetchAllOrders(); // Refresh table
    } catch (error) {
      console.error("Failed to update status", error);
    }
  };

  const deleteOrder = async (orderId) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`http://localhost:4000/api/orders/delete/${orderId}`);
      fetchAllOrders(); // Refresh the list
    } catch (error) {
      console.error("Error deleting order:", error);
    }
  };

  const toggleProductView = (orderId) => {
    setExpandedOrderId(expandedOrderId === orderId ? null : orderId);
  };

  if (loading)
    return <p className="text-center mt-10">Loading all orders...</p>;

  return (
    <div className="min-h-screen bg-gray-50 py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8">
        📊 Admin - All Orders
      </h2>

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
                <th className="px-4 py-2 text-center">Action</th>
              </tr>
            </thead>
            <tbody>
              {orders.map((order) => (
                <React.Fragment key={order._id}>
                  <tr className="border-t hover:bg-gray-50">
                    <td className="px-4 py-2">{order._id.slice(-6)}</td>
                    <td className="px-4 py-2">{order.userId?.name || "N/A"}</td>
                    <td className="px-4 py-2">{order.userId?.email || "N/A"}</td>
                    <td className="px-4 py-2 text-green-600 font-medium">
                      ${order.total.toFixed(2)}
                    </td>
                    <td className="px-4 py-2">
                      <select
                        value={order.status}
                        onChange={(e) =>
                          updateOrderStatus(order._id, e.target.value)
                        }
                        className="border rounded px-2 py-1 bg-white"
                      >
                        <option value="Processing">Processing</option>
                        <option value="Confirmed">Confirmed</option>
                        <option value="Canceled">Canceled</option>
                      </select>
                    </td>
                    <td className="px-4 py-2 text-gray-500">
                      {new Date(order.createdAt).toLocaleString()}
                    </td>
                    <td className="px-4 py-2 space-x-2 text-center">
                      <button
                        onClick={() => deleteOrder(order._id)}
                        className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                      >
                        Delete
                      </button>
                      <button
                        onClick={() => toggleProductView(order._id)}
                        className="bg-indigo-500 hover:bg-indigo-600 text-white px-3 py-1 rounded"
                      >
                        {expandedOrderId === order._id ? "Hide" : "View"}
                      </button>
                    </td>
                  </tr>

                  {/* Expanded Product List */}
                  {expandedOrderId === order._id && (
                    <tr className="bg-gray-100">
                      <td colSpan="7" className="px-4 py-2">
                        <p className="font-semibold mb-2">
                          🛒 Ordered Products:
                        </p>
                        <ul className="ml-4 list-disc text-gray-700">
                          {order.products.map((p, index) => (
                            <li key={index}>
                              {p.productId?.name || "Unknown Product"} x {p.quantity}
                            </li>
                          ))}
                        </ul>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;
