import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/staff`
  : "http://localhost:4000/api/staff";

function StaffDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [row, setRow] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    // password not shown/required here; use separate flow if you need reset
    role: "photographer",
    imageUrl: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    dateHired: "",
    isActive: true,
  });

  const fetchOne = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${API_BASE}/${id}`, {
        withCredentials: true,
      });
      const s = data?.staff || data;
      setRow(s);
      setForm({
        firstName: s.firstName || "",
        lastName: s.lastName || "",
        email: s.email || "",
        role: s.role || "photographer",
        imageUrl: s.imageUrl || "",
        phone: s.phone || "",
        address: s.address || "",
        dateOfBirth: s.dateOfBirth ? s.dateOfBirth.slice(0, 10) : "",
        dateHired: s.dateHired ? s.dateHired.slice(0, 10) : "",
        isActive: !!s.isActive,
      });
    } catch {
      toast.error("Failed to load staff");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOne();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.dateHired) delete payload.dateHired;
      await axios.put(`${API_BASE}/${id}`, payload, { withCredentials: true });
      toast.success("Saved changes");
      setEditing(false);
      setRow({ ...row, ...payload });
    } catch {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <div className="h-8 w-40 animate-pulse rounded bg-neutral-200" />
          <div className="mt-6 h-40 animate-pulse rounded-lg border border-neutral-200 bg-white" />
        </div>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <p className="text-sm text-neutral-500">Staff not found.</p>
          <button
            onClick={() => navigate("/admin/staff")}
            className="mt-4 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {editing ? "Edit Staff" : "Staff Details"}
            </h1>
            <p className="text-sm text-neutral-500">
              {editing ? "Update fields and save changes." : "View details and edit if needed."}
            </p>
          </div>

          <div className="flex gap-2">
            {!editing ? (
              <button
                onClick={() => setEditing(true)}
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400"
              >
                Edit
              </button>
            ) : (
              <button
                onClick={() => setEditing(false)}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => navigate("/admin/staff")}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
            >
              Back
            </button>
          </div>
        </div>

        {/* Content */}
        {!editing ? (
          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
            <div className="flex items-start gap-4">
              {row.imageUrl ? (
                <img
                  src={row.imageUrl}
                  alt={`${row.firstName} ${row.lastName}`}
                  className="h-20 w-20 rounded-lg object-cover ring-1 ring-neutral-200"
                />
              ) : (
                <div className="flex h-20 w-20 items-center justify-center rounded-lg bg-neutral-100 text-lg font-semibold">
                  {row.firstName?.[0]}
                  {row.lastName?.[0]}
                </div>
              )}

              <div className="space-y-1">
                <h2 className="text-lg font-medium">
                  {row.firstName} {row.lastName}
                </h2>
                <div className="text-sm text-neutral-600">{row.email}</div>
                <div className="text-sm capitalize">{row.role}</div>
              </div>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Phone</div>
                <div className="mt-1 text-neutral-900">{row.phone || "-"}</div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Status</div>
                <div className="mt-1">
                  {row.isActive ? (
                    <span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-medium text-emerald-700 ring-1 ring-inset ring-emerald-200">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-medium text-neutral-700 ring-1 ring-inset ring-neutral-200">
                      Inactive
                    </span>
                  )}
                </div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4 sm:col-span-2">
                <div className="text-neutral-500">Address</div>
                <div className="mt-1 text-neutral-900">{row.address || "-"}</div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Date of birth</div>
                <div className="mt-1 text-neutral-900">
                  {row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : "-"}
                </div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Date hired</div>
                <div className="mt-1 text-neutral-900">
                  {row.dateHired ? new Date(row.dateHired).toLocaleDateString() : "-"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
            className="mt-6 space-y-4 rounded-lg border border-neutral-200 bg-white p-5"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  First name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                  required
                />
              </div>
              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Last name
                </label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Role
                </label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                >
                  <option value="photographer">Photographer</option>
                  <option value="manager">Manager</option>
                  <option value="editor">Editor</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Phone
                </label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                  required
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Address
                </label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Date of birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                  required
                />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Date hired (optional)
                </label>
                <input
                  type="date"
                  name="dateHired"
                  value={form.dateHired}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                  Profile image URL (optional)
                </label>
                <input
                  name="imageUrl"
                  value={form.imageUrl}
                  onChange={handleChange}
                  className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="inline-flex items-center gap-2 text-sm text-neutral-800">
                  <input
                    type="checkbox"
                    name="isActive"
                    checked={form.isActive}
                    onChange={handleChange}
                    className="h-4 w-4 accent-neutral-900"
                  />
                  Active
                </label>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-60"
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes"}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default StaffDetail;
