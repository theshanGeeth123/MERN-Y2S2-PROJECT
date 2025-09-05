import React, { useContext, useEffect, useState } from "react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function CustomerNotifications() {
  const { userData } = useContext(AppContent);
  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get("http://localhost:4000/api/notifications", {
        withCredentials: true,
      });
      const all = data?.data || data;

      const now = new Date();
      const filtered = all.filter((n) => {
        const starts = n.startAt ? new Date(n.startAt) : null;
        const ends = n.expiresAt ? new Date(n.expiresAt) : null;
        const withinTime = (!starts || starts <= now) && (!ends || ends >= now);
        const matchesAudience =
          n.audience === "all" ||
          (n.audience === "verified" && userData.isAccountVerified) ||
          (n.audience === "unverified" && !userData.isAccountVerified);
        return n.isActive && withinTime && matchesAudience;
      });

      setNotifications(filtered);
    } catch {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchNotifications();
  }, [userData]);

  const getFilteredNotifications = () => {
    const term = search.trim().toLowerCase();
    return notifications
      .filter((n) => (n.title || "").toLowerCase().includes(term))
      .filter((n) => typeFilter === "all" || n.type === typeFilter)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  };

  const priorityColors = {
    1: "bg-gradient-to-r from-red-50 to-red-100 border-l-4 border-red-500",
    2: "bg-gradient-to-r from-orange-50 to-orange-100 border-l-4 border-orange-500",
    3: "bg-gradient-to-r from-amber-50 to-amber-100 border-l-4 border-amber-500",
    4: "bg-gradient-to-r from-green-50 to-green-100 border-l-4 border-green-500",
    5: "bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-500",
  };

  const typeIcons = {
    info: "ℹ️",
    warning: "⚠️",
    account: "👤",
    promo: "🎁",
    system: "⚙️",
  };

  if (!userData) return <div className="p-6 text-center text-gray-600">Loading user information...</div>;
  if (loading) return <div className="p-6 text-center text-gray-600">Loading notifications...</div>;

  const filtered = getFilteredNotifications();

  return (
    <div className="max-w-4xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Your Notifications</h1>
        <p className="text-gray-600">Stay updated with important information</p>
      </div>

      <div className="flex flex-col sm:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search notifications..."
            className="block w-full pl-10 pr-3 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-4 py-2.5 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">All Types</option>
          <option value="info">Info</option>
          <option value="warning">Warning</option>
          <option value="account">Account</option>
          <option value="promo">Promo</option>
          <option value="system">System</option>
        </select>
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-xl border border-gray-200">
          <svg className="mx-auto h-12 w-12 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="mt-2 text-lg font-medium text-gray-900">No notifications</h3>
          <p className="mt-1 text-gray-500">We couldn't find any notifications matching your criteria.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((n) => (
            <div
              key={n._id}
              className={`rounded-xl p-5 shadow-sm transition-all duration-200 hover:shadow-md ${priorityColors[n.priority] || "bg-white border-l-4 border-gray-200"}`}
            >
              <div className="flex items-start">
                <span className="text-xl mr-3 mt-0.5">{typeIcons[n.type] || "📋"}</span>
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h2 className="text-lg font-semibold text-gray-900">{n.title}</h2>
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                      {n.type}
                    </span>
                  </div>
                  <p className="mt-2 text-gray-700">{n.body}</p>
                  <div className="mt-3 flex flex-wrap gap-2 text-xs text-gray-500">
                    <span className="inline-flex items-center">
                      <svg className="mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      {n.audience} user
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Priority {n.priority}
                    </span>
                    <span className="inline-flex items-center">
                      <svg className="mr-1 h-3 w-3" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      {new Date(n.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CustomerNotifications;