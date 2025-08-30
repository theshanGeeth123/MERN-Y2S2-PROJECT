// src/admin/T_Notifications/Notifications.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE =
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api/notifications`
    : "http://localhost:4000/api/notifications");

function Notifications() {
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [audienceFilter, setAudienceFilter] = useState("all");

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE, { withCredentials: true });
      setNotifications(data?.data || data || []);
    } catch {
      toast.error("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
      toast.success("Notification deleted");
      fetchNotifications();
    } catch {
      toast.error("Error deleting notification");
    }
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return notifications.filter((n) => {
      const matchesText =
        !term ||
        n.title?.toLowerCase().includes(term) ||
        n.body?.toLowerCase().includes(term);
      const matchesAudience =
        audienceFilter === "all" || n.audience === audienceFilter;
      return matchesText && matchesAudience;
    });
  }, [notifications, q, audienceFilter]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              Notifications
            </h1>
            <p className="text-sm text-neutral-500">
              Manage messages shown to users.
            </p>
          </div>

          <button
            onClick={() => navigate("/admin/notifications/create")}
            className="inline-flex items-center justify-center rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
          >
            <svg
              className="mr-2 h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
            Create New
          </button>
        </div>

        {/* Toolbar */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by title or body…"
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 pr-9 text-sm outline-none transition focus:border-neutral-400"
            />
            <svg
              className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z" />
            </svg>
          </div>

          <div className="flex gap-2">
            <select
              value={audienceFilter}
              onChange={(e) => setAudienceFilter(e.target.value)}
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
            >
              <option value="all">Audience: All</option>
              <option value="verified">Audience: Verified</option>
              <option value="unverified">Audience: Unverified</option>
            </select>
            <button
              onClick={() => {
                setQ("");
                setAudienceFilter("all");
              }}
              className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table / List */}
        <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="hidden grid-cols-12 gap-4 bg-neutral-100 px-4 py-3 text-xs font-medium text-neutral-600 sm:grid">
            <div className="col-span-6">Title</div>
            <div className="col-span-2">Audience</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-neutral-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-neutral-500">No notifications found.</div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {filtered.map((n) => (
                <li
                  key={n._id}
                  className="grid grid-cols-1 gap-3 px-4 py-4 transition hover:bg-neutral-50 sm:grid-cols-12 sm:items-center"
                >
                  {/* Title & preview */}
                  <div className="col-span-6">
                    <div className="font-medium">{n.title}</div>
                    <div className="mt-1 line-clamp-1 text-sm text-neutral-500">
                      {n.body}
                    </div>
                  </div>

                  {/* Audience */}
                  <div className="col-span-2">
                    <span className="inline-flex items-center ml-[-10px] border-neutral-300 px-2.5 py-0.5 text-xs capitalize text-neutral-700">
                      {n.audience}
                    </span>
                  </div>

                  {/* Status */}
                  <div className="col-span-2">
                    {n.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200">
                        Inactive
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="col-span-2 flex items-center justify-start gap-2 sm:justify-end">
                    <button
                      onClick={() => navigate(`/admin/notifications/${n._id}`)}
                      className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 transition hover:bg-neutral-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(n._id)}
                      className="inline-flex items-center rounded-md bg-rose-600 px-3 py-1.5 text-sm font-medium text-white transition hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer actions */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={fetchNotifications}
            className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
          >
            Refresh
          </button>
        </div>
      </div>
    </div>
  );
}

export default Notifications;
