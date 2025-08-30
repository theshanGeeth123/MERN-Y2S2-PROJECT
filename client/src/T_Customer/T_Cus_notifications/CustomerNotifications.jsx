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
    1: "bg-red-100",
    2: "bg-orange-100",
    3: "bg-yellow-100",
    4: "bg-green-100",
    5: "bg-blue-100",
  };

  if (!userData) return <div className="p-6 text-center">Loading user...</div>;
  if (loading) return <div className="p-6 text-center">Loading notifications...</div>;

  const filtered = getFilteredNotifications();

  return (
    <div className="max-w-3xl mx-auto py-10 px-4">
      <h1 className="text-2xl font-semibold mb-6 text-neutral-900">Your Notifications</h1>

      <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-6">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by title..."
          className="flex-1 border border-gray-300 px-3 py-2 rounded text-sm"
        />
        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value)}
          className="border border-gray-300 px-3 py-2 rounded text-sm"
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
        <p className="text-neutral-500">No notifications found.</p>
      ) : (
        <ul className="space-y-4">
          {filtered.map((n) => (
            <li
              key={n._id}
              className={`rounded-lg border border-neutral-200 p-4 shadow transition hover:shadow-md ${priorityColors[n.priority] || "bg-white"}`}
            >
              <h2 className="text-lg font-semibold text-neutral-800">{n.title}</h2>
              <p className="text-sm text-neutral-700 mt-1">{n.body}</p>
              <div className="mt-2 text-xs text-neutral-600 flex gap-4">
                <span className="capitalize">{n.audience} user</span>
                <span>{n.type} type</span>
                <span>{n.priority > 0 ? `Priority ${n.priority}` : "Normal Priority"}</span>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CustomerNotifications;
