import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import { FaBox, FaShoppingBag, FaCalendarAlt, FaReceipt, FaChevronDown, FaChevronUp, FaTruck, FaCheckCircle, FaClock } from "react-icons/fa";

const MyOrders = () => {
  const { userData } = useContext(AppContent);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

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

  const toggleOrderExpand = (orderId) => {
    if (expandedOrder === orderId) {
      setExpandedOrder(null);
    } else {
      setExpandedOrder(orderId);
    }
  };

  const getStatusIcon = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return <FaCheckCircle className="text-green-500" />;
      case 'shipped':
        return <FaTruck className="text-blue-500" />;
      case 'processing':
        return <FaClock className="text-yellow-500" />;
      default:
        return <FaShoppingBag className="text-gray-500" />;
    }
  };

  const getStatusColor = (status) => {
    switch (status.toLowerCase()) {
      case 'delivered':
        return "bg-green-100 text-green-800";
      case 'shipped':
        return "bg-blue-100 text-blue-800";
      case 'processing':
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-gray-900 flex items-center justify-center">
            <FaBox className="mr-3 text-blue-500" /> Order History
          </h1>
          <p className="text-gray-600 mt-2">View and manage your past purchases</p>
        </div>

        {orders.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm p-8 text-center">
            <div className="bg-gray-100 rounded-full p-4 inline-flex mb-4">
              <FaShoppingBag className="text-gray-400 text-2xl" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No orders yet</h3>
            <p className="text-gray-500 mb-4">You haven't placed any orders yet.</p>
            <button 
              onClick={() => window.location.href = '/'}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="bg-white rounded-xl shadow-sm overflow-hidden">
                {/* Order Summary Header */}
                <div 
                  className="p-6 cursor-pointer border-b border-gray-100"
                  onClick={() => toggleOrderExpand(order._id)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className="bg-blue-50 rounded-lg p-3 mr-4">
                        <FaReceipt className="text-blue-500 text-xl" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">Order #{order._id.slice(-8).toUpperCase()}</h3>
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <FaCalendarAlt className="mr-1" />
                          <span>{new Date(order.createdAt).toLocaleDateString('en-US', { 
                            year: 'numeric', 
                            month: 'long', 
                            day: 'numeric' 
                          })}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(order.status)} flex items-center mr-4`}>
                        {getStatusIcon(order.status)}
                        <span className="ml-1 capitalize">{order.status}</span>
                      </div>
                      <div className="text-gray-400">
                        {expandedOrder === order._id ? <FaChevronUp /> : <FaChevronDown />}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Expanded Order Details */}
                {expandedOrder === order._id && (
                  <div className="p-6 bg-gray-50">
                    <h4 className="font-medium text-gray-900 mb-4">Order Details</h4>
                    
                    <div className="space-y-4">
                      {order.products.map((item) => (
                        <div key={item.productId._id} className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0">
                          <div className="flex items-center">
                            <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                              {item.productId.image ? (
                                <img 
                                  src={item.productId.image} 
                                  alt={item.productId.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                  <FaShoppingBag className="text-gray-400" />
                                </div>
                              )}
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{item.productId.name}</p>
                              <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-medium text-gray-900">${(item.productId.price * item.quantity).toFixed(2)}</p>
                            <p className="text-sm text-gray-500">${item.productId.price} each</p>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Order Summary */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-gray-900">${(order.total * 0.92).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Shipping</span>
                        <span className="text-gray-900">$5.99</span>
                      </div>
                      <div className="flex justify-between py-2">
                        <span className="text-gray-600">Tax</span>
                        <span className="text-gray-900">${(order.total * 0.08).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-2 font-bold text-lg mt-2">
                        <span>Total</span>
                        <span>${order.total.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Shipping Information */}
                    <div className="mt-6 pt-4 border-t border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-3">Shipping Information</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-gray-600">Shipping Address</p>
                          <p className="text-gray-900">{order.shippingAddress?.street || "123 Main St"}</p>
                          <p className="text-gray-900">{order.shippingAddress?.city || "Anytown"}, {order.shippingAddress?.state || "CA"} {order.shippingAddress?.zipCode || "12345"}</p>
                        </div>
                        <div>
                          <p className="text-gray-600">Payment Method</p>
                          <p className="text-gray-900">{order.payment?.type || "Credit Card"} ending in •••• {order.payment?.last4 || "1234"}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;