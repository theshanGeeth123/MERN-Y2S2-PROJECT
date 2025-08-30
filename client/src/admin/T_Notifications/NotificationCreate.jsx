// src/admin/T_Notifications/NotificationCreate.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE =
  (import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api/notifications`
    : "http://localhost:4000/api/notifications");

function NotificationCreate() {
  const navigate = useNavigate();

  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState({
    title: "",
    body: "",
    audience: "all",
    type: "info",
    priority: 0,
    isActive: true,
    startAt: "",
    expiresAt: ""
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const validate = () => {
    if (!form.title.trim() || !form.body.trim()) {
      toast.error("Title and Body are required");
      return false;
    }
    if (form.startAt && form.expiresAt) {
      const start = new Date(form.startAt);
      const end = new Date(form.expiresAt);
      if (end < start) {
        toast.error("Expires At must be after Start At");
        return false;
      }
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSaving(true);
    try {
      await axios.post(API_BASE, form, { withCredentials: true });
      toast.success("Notification created");
      navigate("/admin/notifications");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating notification");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">Create Notification</h1>
            <p className="text-sm text-neutral-500">Fill the fields and hit Create.</p>
          </div>

          <button
            onClick={() => navigate("/admin/notifications")}
            className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
          >
            Back
          </button>
        </div>

        {/* Form card */}
        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-4 rounded-lg border border-neutral-200 bg-white p-5"
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Title
              </label>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="System Maintenance"
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Body
              </label>
              <textarea
                name="body"
                value={form.body}
                onChange={handleChange}
                placeholder="Our system will be down on Sept 15 from 2 AM to 4 AM."
                rows={4}
                className="w-full resize-y rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
                required
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Audience
              </label>
              <select
                name="audience"
                value={form.audience}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              >
                <option value="all">All</option>
                <option value="verified">Verified</option>
                <option value="unverified">Unverified</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Type
              </label>
              <select
                name="type"
                value={form.type}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              >
                <option value="info">Info</option>
                <option value="warning">Warning</option>
                <option value="account">Account</option>
                <option value="promo">Promo</option>
                <option value="system">System</option>
              </select>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Priority
              </label>
              <input
                type="number"
                name="priority"
                value={form.priority}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </div>

            <br />

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Start at
              </label>
              <input
                type="datetime-local"
                name="startAt"
                value={form.startAt}
                onChange={handleChange}
                className="w-full rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400"
              />
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Expires at
              </label>
              <input
                type="datetime-local"
                name="expiresAt"
                value={form.expiresAt}
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
              onClick={() => navigate("/admin/notifications")}
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
              {saving ? "Creating…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default NotificationCreate;
