import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/staff`
  : "http://localhost:4000/api/staff";

export default function StaffList() {
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
    <div className="min-h-screen bg-gray-100 font-sans">
      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Staff Management</h1>
            <p className="mt-1 text-sm text-gray-500">
              Manage and organize your staff efficiently.
            </p>
          </div>
          <div className="flex gap-3 mt-4 sm:mt-0">
            <button
              onClick={() => navigate("/admin/staff/create")}
              className="px-5 py-2 rounded-lg bg-green-600 text-white font-semibold shadow-md hover:bg-green-700 transition"
            >
              + Add Staff
            </button>
            <button
              onClick={() => navigate("/admin/staff/report")}
              className="px-5 py-2 rounded-lg bg-blue-800 text-white font-semibold shadow-sm hover:bg-blue-900 transition"
            >
              Report
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6 bg-white border border-gray-200 rounded-lg shadow-sm p-4">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search by name, email, or phone..."
            className="w-full sm:w-1/2 rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          />
          <div className="flex items-center gap-3 w-full sm:w-auto">
            <select
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value)}
              className="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              <option value="all">All Roles</option>
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
              className="rounded-lg border border-gray-500 bg-gray-500 px-4 py-2 text-sm font-medium text-white hover:bg-gray-600 transition"
            >
              Reset
            </button>
          </div>
        </div>

      
        <div className="overflow-x-auto rounded-lg shadow-lg bg-white mt-12">
          <table className="min-w-full table-auto text-sm">
            <thead className="bg-black text-white font-semibold sticky top-0 shadow">
              <tr>
                <th className="px-6 py-3 text-left">Name / Email</th>
                <th className="px-6 py-3 text-left">Phone</th>
                <th className="px-6 py-3 text-left">Role</th>
                <th className="px-6 py-3 text-left">Status</th>
                <th className="px-6 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center animate-pulse text-gray-400">
                    Loading staff members...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-6 text-center text-gray-500">
                    No staff found.
                  </td>
                </tr>
              ) : (
                filtered.map((s, idx) => (
                  <tr
                    key={s._id}
                    className={`transition-all duration-200 transform hover:shadow-md hover:-translate-y-0.5 ${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <div className="font-medium text-gray-900">{s.firstName} {s.lastName}</div>
                      <div className="text-xs text-gray-500">{s.email}</div>
                    </td>
                    <td className="px-6 py-4">{s.phone || "-"}</td>
                    <td className="px-6 py-4 capitalize">{s.role}</td>
                    <td className="px-6 py-4">
                      <span
                        className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${
                          s.isActive
                            ? "bg-green-100 text-green-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {s.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => navigate(`/admin/staff/${s._id}`)}
                          className="rounded-lg bg-yellow-200 px-3 py-1.5 text-sm font-medium text-gray-800 hover:bg-yellow-300 transition"
                        >
                          View
                        </button>
                        <button
                          onClick={() => handleDelete(s._id)}
                          className="rounded-lg bg-red-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-red-700 transition"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
