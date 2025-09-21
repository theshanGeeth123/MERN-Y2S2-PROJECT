import React, { useContext, useEffect, useMemo, useState } from "react";
import { AppContent } from "../../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import NavbarCustomer from "../../components/NavbarCustomer";

const cx = (...c) => c.filter(Boolean).join(" ");
const TYPE_LABELS = {
  info: "Info",
  warning: "Warning",
  account: "Account",
  promo: "Promo",
  system: "System",
};
const TYPE_PILL = {
  info: "bg-blue-100 text-blue-700 ring-1 ring-inset ring-blue-200",
  warning: "bg-amber-100 text-amber-800 ring-1 ring-inset ring-amber-200",
  account: "bg-purple-100 text-purple-700 ring-1 ring-inset ring-purple-200",
  promo: "bg-pink-100 text-pink-700 ring-1 ring-inset ring-pink-200",
  system: "bg-slate-100 text-slate-700 ring-1 ring-inset ring-slate-200",
};
const TYPE_ICON = {
  info: "ℹ️",
  warning: "⚠️",
  account: "👤",
  promo: "🎁",
  system: "⚙️",
};
const PRIORITY_ACCENT = {
  1: "before:bg-red-500",
  2: "before:bg-orange-500",
  3: "before:bg-amber-500",
  4: "before:bg-emerald-500",
  5: "before:bg-blue-500",
};

function CardSkeleton() {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 p-5 before:absolute before:inset-y-0 before:left-0 before:w-1 before:bg-gray-300">
      <div className="animate-pulse space-y-3">
        <div className="h-4 w-24 rounded bg-gray-200" />
        <div className="h-5 w-3/4 rounded bg-gray-200" />
        <div className="h-4 w-full rounded bg-gray-200" />
        <div className="h-4 w-2/3 rounded bg-gray-200" />
      </div>
    </div>
  );
}

export default function CustomerNotifications() {
  const { userData } = useContext(AppContent);

  const [notifications, setNotifications] = useState([]);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState(null);

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:4000/api/notifications",
        { withCredentials: true }
      );
      const all = data?.data || data;

      const now = new Date();
      const filtered = (all || []).filter((n) => {
        const starts = n.startAt ? new Date(n.startAt) : null;
        const ends = n.expiresAt ? new Date(n.expiresAt) : null;
        const withinTime = (!starts || starts <= now) && (!ends || ends >= now);
        const matchesAudience =
          n.audience === "all" ||
          (n.audience === "verified" && userData?.isAccountVerified) ||
          (n.audience === "unverified" && !userData?.isAccountVerified);
        return n.isActive && withinTime && matchesAudience;
      });

      setNotifications(filtered);
    } catch (e) {
      toast.error("Failed to fetch notifications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userData) fetchNotifications();
  }, [userData]);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    return notifications
      .filter((n) => (n.title || "").toLowerCase().includes(term))
      .filter((n) => typeFilter === "all" || n.type === typeFilter)
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [notifications, search, typeFilter]);

  return (
    <>
      <NavbarCustomer />

      <div className="bg-gray-50 2xl:mx-30 xl:mx-20 lg:mx-15 md:mx-10 sm:mx-5  mb-10">
        <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 pb-16 pt-10">
          <div className="h-4 sm:h-6" />

          <div className="mt-2 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-extrabold tracking-tight text-gray-900">
                Your Notifications
              </h1>
              <p className="mt-1 text-gray-600">
                Stay updated with important information
              </p>
            </div>

            <div className="mt-1 inline-flex items-center gap-2 self-start rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              <span className="h-2 w-2 rounded-full bg-green-400" />
              {filtered.length} shown
            </div>
          </div>

          <div className="sticky top-2 z-10 mt-6">
            <div className="rounded-2xl border border-gray-200 bg-white/90 backdrop-blur px-3 py-3 sm:px-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <div className="relative flex-1">
                  <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                    <svg
                      className="h-5 w-5 text-gray-400"
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <input
                    type="text"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search notifications..."
                    className="w-full rounded-xl border border-gray-300 pl-10 pr-3 py-2.5 text-[15px] outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
                  />
                </div>

                <div className="flex items-center gap-2">
                  <label
                    htmlFor="type"
                    className="shrink-0 text-sm font-medium text-gray-700"
                  >
                    Type
                  </label>
                  <select
                    id="type"
                    value={typeFilter}
                    onChange={(e) => setTypeFilter(e.target.value)}
                    className="rounded-xl border border-gray-300 px-3 py-2.5 text-[15px] outline-none ring-blue-500 focus:border-blue-500 focus:ring-2"
                  >
                    <option value="all">All</option>
                    <option value="info">Info</option>
                    <option value="warning">Warning</option>
                    <option value="account">Account</option>
                    <option value="promo">Promo</option>
                    <option value="system">System</option>
                  </select>

                  {(search || typeFilter !== "all") && (
                    <button
                      onClick={() => {
                        setSearch("");
                        setTypeFilter("all");
                      }}
                      className="rounded-xl border border-gray-300 px-3 py-2.5 text-sm hover:bg-gray-50"
                      title="Clear filters"
                    >
                      Clear
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6">
            {loading && (
              <div className="space-y-4">
                <CardSkeleton />
                <CardSkeleton />
                <CardSkeleton />
              </div>
            )}

            {!loading && filtered.length === 0 && (
              <div className="mx-auto max-w-xl rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <h3 className="mt-3 text-lg font-semibold text-gray-900">
                  No notifications
                </h3>
                <p className="mt-1 text-gray-600">
                  Try changing the type or clearing your search.
                </p>
              </div>
            )}

            {!loading && filtered.length > 0 && (
              <ul className="space-y-4">
                {filtered.map((n) => {
                  const pill = TYPE_PILL[n.type] || TYPE_PILL.info;
                  const leftAccent = PRIORITY_ACCENT[n.priority] || "";
                  const isExpanded = expandedId === n._id;

                  return (
                    <li
                      key={n._id}
                      className={cx(
                        "relative overflow-hidden rounded-2xl bg-white p-5 shadow-sm ring-1 ring-gray-200 transition hover:shadow-md",
                        "before:absolute before:inset-y-0 before:left-0 before:w-1",
                        leftAccent
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className="text-xl leading-none">
                          {TYPE_ICON[n.type] || "📋"}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <h2 className="truncate text-lg font-semibold text-gray-900">
                              {n.title}
                            </h2>

                            <span
                              className={cx(
                                "inline-flex items-center gap-1 rounded-full px-2 py-1 text-xs font-medium",
                                pill
                              )}
                            >
                              {TYPE_LABELS[n.type] || "Info"}
                            </span>
                          </div>

                          <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-gray-500">
                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="h-3.5 w-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0" />
                              </svg>
                              {n.audience} user
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="h-3.5 w-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M13 10V3L4 14h7v7l9-11h-7z" />
                              </svg>
                              Priority {n.priority}
                            </span>

                            <span className="inline-flex items-center gap-1">
                              <svg
                                className="h-3.5 w-3.5"
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                              >
                                <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                              {new Date(n.createdAt).toLocaleDateString()}
                            </span>
                          </div>

                          <div className="mt-3">
                            <p
                              className={cx(
                                "text-[15px] text-gray-700",
                                !isExpanded && "line-clamp-2"
                              )}
                            >
                              {n.body}
                            </p>

                            {n.body && n.body.length > 140 && (
                              <button
                                onClick={() =>
                                  setExpandedId(isExpanded ? null : n._id)
                                }
                                className="mt-2 text-sm font-medium text-blue-700 hover:underline"
                              >
                                {isExpanded ? "Show less" : "Read more"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
