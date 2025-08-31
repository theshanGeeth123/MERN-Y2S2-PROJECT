import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/staff`
  : "http://localhost:4000/api/staff";

function StaffList() {
  const navigate = useNavigate();

  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");

  const fetchRows = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(API_BASE, { withCredentials: true });
      setRows(data?.staff || []);
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this staff member?")) return;
    try {
      await axios.delete(`${API_BASE}/${id}`, { withCredentials: true });
      toast.success("Staff member deleted");
      fetchRows();
    } catch {
      toast.error("Delete failed");
    }
  };

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return rows
      .filter((r) => {
        const matchesText =
          !term ||
          r.firstName?.toLowerCase().includes(term) ||
          r.lastName?.toLowerCase().includes(term) ||
          r.email?.toLowerCase().includes(term) ||
          r.phone?.toLowerCase().includes(term);
        const matchesRole = roleFilter === "all" || r.role === roleFilter;
        return matchesText && matchesRole;
      })
      .sort(
        (a, b) =>
          new Date(b.createdAt || 0).getTime() -
          new Date(a.createdAt || 0).getTime()
      );
  }, [rows, q, roleFilter]);

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-6xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Staff</h1>
            <p className="text-sm text-neutral-500">
              View, search, edit and remove staff members.
            </p>
          </div>

        <div className="flex gap-2">
            <button
              onClick={fetchRows}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
            >
              Refresh
            </button>
            <button
              onClick={() => navigate("/admin/staff/create")}
              className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
            >
              + New Staff
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <div className="relative">
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by name, email or phone…"
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 pr-9 text-sm outline-none transition focus:border-neutral-400"
            />
            <svg
              className="pointer-events-none absolute right-3 top-2.5 h-5 w-5 text-neutral-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-4.35-4.35M10 18a8 8 0 100-16 8 8 0 000 16z"
              />
            </svg>
          </div>

          <div className="flex gap-2">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
            >
              <option value="all">Role: All</option>
              <option value="photographer">Photographer</option>
              <option value="manager">Manager</option>
              <option value="editor">Editor</option>
              <option value="other">Other</option>
            </select>
            <button
              onClick={() => {
                setQ("");
                setRoleFilter("all");
              }}
              className="rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-700 transition hover:bg-neutral-100"
            >
              Reset
            </button>
          </div>
        </div>

        {/* Table */}
        <div className="mt-6 overflow-hidden rounded-lg border border-neutral-200 bg-white">
          <div className="hidden grid-cols-12 gap-4 bg-neutral-100 px-4 py-3 text-xs font-medium text-neutral-600 sm:grid">
            <div className="col-span-4">Name / Email</div>
            <div className="col-span-2">Phone</div>
            <div className="col-span-2">Role</div>
            <div className="col-span-2">Status</div>
            <div className="col-span-2 text-right">Actions</div>
          </div>

          {loading ? (
            <div className="p-6 text-sm text-neutral-500">Loading…</div>
          ) : filtered.length === 0 ? (
            <div className="p-6 text-sm text-neutral-500">
              No staff found. Try adjusting filters.
            </div>
          ) : (
            <ul className="divide-y divide-neutral-200">
              {filtered.map((s) => (
                <li
                  key={s._id}
                  className="grid grid-cols-1 gap-3 px-4 py-4 transition hover:bg-neutral-50 sm:grid-cols-12 sm:items-center"
                >
                  <div className="col-span-4">
                    <div className="font-medium">
                      {s.firstName} {s.lastName}
                    </div>
                    <div className="mt-1 text-sm text-neutral-500">{s.email}</div>
                  </div>

                  <div className="col-span-2 text-sm">{s.phone || "-"}</div>
                  <div className="col-span-2 capitalize text-sm">{s.role}</div>

                  <div className="col-span-2">
                    {s.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200">
                        Inactive
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center justify-start gap-2 sm:justify-end">
                    <button
                      onClick={() => navigate(`/admin/staff/${s._id}`)}
                      className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-3 py-1.5 text-sm text-neutral-800 transition hover:bg-neutral-100"
                    >
                      View
                    </button>
                    <button
                      onClick={() => handleDelete(s._id)}
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
      </div>
    </div>
  );
}

export default StaffList;
