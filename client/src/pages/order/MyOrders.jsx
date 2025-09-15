import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../../context/AppContext";
import {
  FaBox,
  FaShoppingBag,
  FaCalendarAlt,
  FaReceipt,
  FaChevronDown,
  FaChevronUp,
  FaTruck,
  FaCheckCircle,
  FaClock,
  FaTimesCircle,
} from "react-icons/fa";

/** Helpers */
const toId = (v) => (v != null ? String(v) : "");
const fmt = (n) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(
    Number.isFinite(Number(n)) ? Number(n) : 0
  );
const firstNumber = (...vals) => {
  for (const v of vals) {
    const n = Number(v);
    if (Number.isFinite(n)) return n;
  }
  return 0;
};
const firstString = (...vals) => {
  for (const v of vals) {
    if (typeof v === "string" && v.trim()) return v.trim();
  }
  return "";
};

/** Product field accessors (your Product uses `url` for image) */
const getProductImage = (p, item) => {
  if (p?.url) return p.url; // main image field from your model
  if (item?.image) return item.image; // fallback if you ever store a snapshot
  return null;
};

const statusMeta = (raw) => {
  const s = (raw || "").toLowerCase();
  if (s === "confirmed")
    return {
      chip: "bg-blue-100 text-blue-800",
      icon: <FaTruck className="text-blue-500" />,
      label: "Confirmed",
    };
  if (s === "canceled" || s === "cancelled")
    return {
      chip: "bg-red-100 text-red-800",
      icon: <FaTimesCircle className="text-red-500" />,
      label: "Canceled",
    };
  // default Processing
  return {
    chip: "bg-yellow-100 text-yellow-800",
    icon: <FaClock className="text-yellow-500" />,
    label: "Processing",
  };
};

const MyOrders = () => {
  const { userData } = useContext(AppContent);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [expandedOrder, setExpandedOrder] = useState(null);

  const fetchOrders = async () => {
    try {
      const res = await axios.get("http://localhost:4000/api/orders/my-orders", {
        withCredentials: true,
      });

      // Normalize ids & safely map products (populated or not)
      const normalized = (res.data?.orders ?? []).map((o) => ({
        ...o,
        _id: toId(o._id),
        products: (o.products ?? []).map((p) => {
          const pid = p.productId;
          if (pid && typeof pid === "object") {
            return { ...p, productId: { ...pid, _id: toId(pid._id) } };
          }
          return { ...p, productId: toId(p.productId) };
        }),
      }));

      setOrders(normalized);
    } catch (err) {
      console.error("Failed to fetch orders", err?.message || err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const toggleOrderExpand = (orderId) => {
    const idStr = toId(orderId);
    setExpandedOrder((prev) => (prev === idStr ? null : idStr));
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
              onClick={() => (window.location.href = "/")}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const orderId = toId(order._id);
              const created = order.createdAt ? new Date(order.createdAt) : null;
              const { chip, icon, label } = statusMeta(order.status);
              const orderTotal = Number(order.total || 0);

              return (
                <div key={orderId} className="bg-white rounded-xl shadow-sm overflow-hidden">
                  {/* Order Summary Header */}
                  <button
                    type="button"
                    className="w-full text-left p-6 border-b border-gray-100 focus:outline-none"
                    onClick={() => toggleOrderExpand(orderId)}
                    aria-expanded={expandedOrder === orderId}
                    aria-controls={`order-panel-${orderId}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="bg-blue-50 rounded-lg p-3 mr-4">
                          <FaReceipt className="text-blue-500 text-xl" />
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">
                            Order #{orderId.slice(-8).toUpperCase()}
                          </h3>
                          <div className="flex items-center text-sm text-gray-500 mt-1">
                            <FaCalendarAlt className="mr-1" />
                            <span>
                              {created
                                ? created.toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "long",
                                    day: "numeric",
                                  })
                                : "Unknown date"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center">
                        <div className={`px-3 py-1 rounded-full text-xs font-medium ${chip} flex items-center mr-4`}>
                          {icon}
                          <span className="ml-1">{label}</span>
                        </div>
                        <div className="text-gray-400">
                          {expandedOrder === orderId ? <FaChevronUp /> : <FaChevronDown />}
                        </div>
                      </div>
                    </div>
                  </button>

                  {/* Expanded Order Details */}
                  {expandedOrder === orderId && (
                    <div
                      id={`order-panel-${orderId}`}
                      className="p-6 bg-gray-50"
                      role="region"
                      aria-labelledby={`order-header-${orderId}`}
                    >
                      <h4 className="font-medium text-gray-900 mb-4">Order Details</h4>

                      <div className="space-y-4">
                        {(order.products || []).map((item, idx) => {
                          const p =
                            item?.productId && typeof item.productId === "object"
                              ? item.productId
                              : {}; // populated product
                          const pid = toId(p?._id || item?.productId);
                          const qty = firstNumber(item?.quantity, item?.qty, 1);

                          // Prefer snapshot (if you add it later), else from product doc
                          const unitPrice = firstNumber(
                            item?.unitPrice,
                            item?.priceAtPurchase,
                            item?.price,
                            p?.price
                          );

                          const name = firstString(p?.name, item?.name, "Product");
                          const image = getProductImage(p, item);
                          const lineTotal = unitPrice * qty;

                          return (
                            <div
                              key={pid || `${orderId}-line-${idx}`}
                              className="flex justify-between items-center py-3 border-b border-gray-100 last:border-b-0"
                            >
                              <div className="flex items-center">
                                <div className="w-16 h-16 bg-gray-200 rounded-lg overflow-hidden mr-4">
                                  {image ? (
                                    <img
                                      src={image}
                                      alt={name}
                                      className="w-full h-full object-cover"
                                    />
                                  ) : (
                                    <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                      <FaShoppingBag className="text-gray-400" />
                                    </div>
                                  )}
                                </div>
                                <div>
                                  <p className="font-medium text-gray-900">{name}</p>
                                  <p className="text-sm text-gray-500">Quantity: {qty}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-medium text-gray-900">{fmt(lineTotal)}</p>
                                <p className="text-sm text-gray-500">{fmt(unitPrice)} each</p>
                              </div>
                            </div>
                          );
                        })}
                      </div>

                      {/* Order Summary */}
                      <div className="mt-6 pt-4 border-t border-gray-200">
                        <div className="flex justify-between py-2">
                          <span className="text-gray-600">Total</span>
                          <span className="text-gray-900">{fmt(orderTotal)}</span>
                        </div>
                      </div>

                      {/* Optional Shipping / Payment sections (render only if present) */}
                      {(order.shippingAddress || order.payment) && (
                        <div className="mt-6 pt-4 border-t border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-3">Shipping & Payment</h5>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                              <p className="text-gray-600">Shipping Address</p>
                              <p className="text-gray-900">{order.shippingAddress?.street || "—"}</p>
                              {(order.shippingAddress?.city ||
                                order.shippingAddress?.state ||
                                order.shippingAddress?.zipCode) && (
                                <p className="text-gray-900">
                                  {order.shippingAddress?.city || ""}
                                  {order.shippingAddress?.city ? ", " : ""}
                                  {order.shippingAddress?.state || ""}{" "}
                                  {order.shippingAddress?.zipCode || ""}
                                </p>
                              )}
                            </div>
                            <div>
                              <p className="text-gray-600">Payment Method</p>
                              <p className="text-gray-900">
                                {order.payment?.type
                                  ? `${order.payment.type}${
                                      order.payment?.last4 ? ` •••• ${order.payment.last4}` : ""
                                    }`
                                  : "—"}
                              </p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
