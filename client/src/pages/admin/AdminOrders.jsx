import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All");
  const [sortBy, setSortBy] = useState("newest");

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

  const getStatusColor = (status) => {
    switch (status) {
      case "Processing":
        return "bg-amber-100 text-amber-800";
      case "Confirmed":
        return "bg-emerald-100 text-emerald-800";
      case "Canceled":
        return "bg-rose-100 text-rose-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const filteredAndSortedOrders = orders
    .filter((order) => filterStatus === "All" || order.status === filterStatus)
    .sort((a, b) => {
      if (sortBy === "newest") {
        return new Date(b.createdAt) - new Date(a.createdAt);
      } else {
        return new Date(a.createdAt) - new Date(b.createdAt);
      }
    });

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        <span className="ml-4 text-gray-600">Loading all orders...</span>
      </div>
    );

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-3xl font-bold text-gray-900">Order Management</h2>
          <div className="mt-4 sm:mt-0 flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="relative">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="All">All Statuses</option>
                <option value="Processing">Processing</option>
                <option value="Confirmed">Confirmed</option>
                <option value="Canceled">Canceled</option>
              </select>
            </div>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              >
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="px-4 py-5 sm:p-6">
              <div className="text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    vectorEffect="non-scaling-stroke"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">No orders</h3>
                <p className="mt-1 text-sm text-gray-500">No orders have been placed yet.</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white shadow overflow-hidden rounded-xl">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Order Details
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Customer
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Total
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date
                    </th>
                    <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredAndSortedOrders.map((order) => (
                    <React.Fragment key={order._id}>
                      <tr className="hover:bg-gray-50 transition-colors duration-150">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">#{order._id.slice(-8).toUpperCase()}</div>
                          <div className="text-sm text-gray-500">{order.products.length} item(s)</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{order.userId?.name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{order.userId?.email || "N/A"}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900">
                          ${order.total.toFixed(2)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <select
                            value={order.status}
                            onChange={(e) => updateOrderStatus(order._id, e.target.value)}
                            className={`rounded-full py-1 px-3 text-xs font-medium ${getStatusColor(order.status)} border-transparent focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                          >
                            <option value="Processing">Processing</option>
                            <option value="Confirmed">Confirmed</option>
                            <option value="Canceled">Canceled</option>
                          </select>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {new Date(order.createdAt).toLocaleDateString()}
                          <div className="text-xs text-gray-400">
                            {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                          <button
                            onClick={() => toggleProductView(order._id)}
                            className="text-indigo-600 hover:text-indigo-900 bg-indigo-50 hover:bg-indigo-100 rounded-md px-3 py-1.5 text-sm transition-colors duration-150"
                          >
                            {expandedOrderId === order._id ? "Hide Items" : "View Items"}
                          </button>
                          <button
                            onClick={() => deleteOrder(order._id)}
                            className="text-rose-600 hover:text-rose-900 bg-rose-50 hover:bg-rose-100 rounded-md px-3 py-1.5 text-sm transition-colors duration-150"
                          >
                            Delete
                          </button>
                        </td>
                      </tr>

                      {/* Expanded Product List */}
                      {expandedOrderId === order._id && (
                        <tr className="bg-gray-50">
                          <td colSpan="6" className="px-6 py-4">
                            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                              {order.products.map((p, index) => (
                                <div key={index} className="bg-white p-4 rounded-lg shadow-sm border border-gray-100">
                                  <div className="flex items-start">
                                    <div className="flex-1 min-w-0">
                                      <h4 className="text-sm font-medium text-gray-900 truncate">
                                        {p.productId?.name || "Unknown Product"}
                                      </h4>
                                      <p className="text-sm text-gray-500 mt-1">Quantity: {p.quantity}</p>
                                      {p.productId?.price && (
                                        <p className="text-sm text-gray-500">
                                          Price: ${p.productId.price.toFixed(2)}
                                        </p>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminOrders;