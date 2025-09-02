import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";

const API_BASE = "http://localhost:4000/api/staff";

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
      const { data } = await axios.get(`${API_BASE}/${id}`, { withCredentials: true });
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
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-3xl animate-pulse">
          <div className="h-6 w-48 rounded bg-gray-200"></div>
          <div className="h-64 rounded-lg bg-white shadow-md"></div>
        </div>
      </div>
    );
  }

  if (!row) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-gray-500 text-sm">Staff not found.</p>
        <button
          onClick={() => navigate("/admin/staff")}
          className="mt-4 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-100"
        >
          Back to list
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 py-6">
      <div className="mx-auto max-w-5xl px-4">
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="mt-8 text-3xl font-bold text-green-800">{editing ? "Edit Staff" : "Staff Details"}</h1>
            <p className="mt-3 text-sm text-gray-500">
              {editing ? "Update fields and save changes." : "View details of staff member."}
            </p>
          </div>
          <button
            onClick={() => navigate("/admin/staff")}
            className="mt-8 rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm text-white shadow-sm hover:bg-black transition"
          >
            Back
          </button>
        </div>

        
        {!editing ? (
          <>
            <div className="mt-6 rounded-lg border border-gray-200 bg-white p-6 shadow-md">
              <div className="flex items-center gap-4">
                {row.imageUrl ? (
                  <img
                    src={row.imageUrl}
                    alt={`${row.firstName} ${row.lastName}`}
                    className="h-24 w-24 rounded-lg object-cover ring-1 ring-gray-200"
                  />
                ) : (
                  <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-gray-100 text-xl font-semibold">
                    {row.firstName?.[0]}
                    {row.lastName?.[0]}
                  </div>
                )}
                <div className="space-y-1">
                  <h2 className="text-lg font-semibold text-black">{row.firstName} {row.lastName}</h2>
                  <div className="text-sm text-gray-700">{row.email}</div>
                  <div className="text-sm capitalize text-gray-700">{row.role}</div>
                </div>
              </div>

              <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-black font-semibold">Phone</div>
                  <div className="mt-1 text-gray-700">{row.phone || "-"}</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-black font-semibold">Status</div>
                  <div className="mt-1">
                    {row.isActive ? (
                      <span className="inline-flex items-center rounded-full bg-green-50 px-2.5 py-0.5 text-xs font-medium text-green-700 ring-1 ring-green-200">
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-700 ring-1 ring-gray-200">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 sm:col-span-2 shadow-sm">
                  <div className="text-black font-semibold">Address</div>
                  <div className="mt-1 text-gray-700">{row.address || "-"}</div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-black font-semibold">Date of birth</div>
                  <div className="mt-1 text-gray-700">
                    {row.dateOfBirth ? new Date(row.dateOfBirth).toLocaleDateString() : "-"}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-black font-semibold">Date hired</div>
                  <div className="mt-1 text-gray-700">
                    {row.dateHired ? new Date(row.dateHired).toLocaleDateString() : "-"}
                  </div>
                </div>
              </div>
            </div>

            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setEditing(true)}
                className="rounded-md bg-blue-600 px-10 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 transition"
              >
                Edit
              </button>
            </div>
          </>
        ) : (
          <form
            onSubmit={handleSave}
            className="mt-6 space-y-4 rounded-lg border border-gray-200 bg-white p-6 shadow-md"
          >
            <div className="grid gap-4 sm:grid-cols-2">
              
              <div>
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                <label className="mb-1 block text-xs font-bold uppercase tracking-wide text-black">
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
                onClick={() => {
                  setEditing(false);
                  setForm({
                    firstName: row.firstName || "",
                    lastName: row.lastName || "",
                    email: row.email || "",
                    role: row.role || "photographer",
                    imageUrl: row.imageUrl || "",
                    phone: row.phone || "",
                    address: row.address || "",
                    dateOfBirth: row.dateOfBirth ? row.dateOfBirth.slice(0, 10) : "",
                    dateHired: row.dateHired ? row.dateHired.slice(0, 10) : "",
                    isActive: !!row.isActive,
                  });
                }}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
                disabled={saving}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="rounded-md bg-blue-700 px-4 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
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
