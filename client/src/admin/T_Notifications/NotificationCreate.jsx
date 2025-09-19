// src/admin/T_Notifications/NotificationCreate.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const API_BASE ="http://localhost:4000/api/notifications";

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

  // NEW: inline errors (same pattern as other screens)
  const [errors, setErrors] = useState({});

  // -------------------
  // Helpers / Validators
  // -------------------
  const now = () => new Date();

  const parseLocalDateTime = (val) => (val ? new Date(val) : null);

  const isBodyOk = (b) => (b || "").trim().length >= 20;

  const isPriorityOk = (p) => {
    const n = Number(p);
    return Number.isInteger(n) && n >= 1 && n <= 5;
  };

  // if provided: startAt must be >= now
  const isStartOk = (start) => {
    if (!start) return true; // treat empty as ok (optional field)
    const s = parseLocalDateTime(start);
    return s && s >= now();
  };

  // if provided: expiresAt must be > now and > startAt if start provided
  const isExpireOk = (expire, start) => {
    if (!expire) return true; // treat empty as ok (optional field)
    const e = parseLocalDateTime(expire);
    if (!e || e <= now()) return false;
    if (start) {
      const s = parseLocalDateTime(start);
      if (s && e <= s) return false;
    }
    return true;
  };

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = "Title is required.";
    if (!form.body.trim()) e.body = "Body is required.";
    else if (!isBodyOk(form.body)) e.body = "Body must be at least 20 characters.";

    if (!isPriorityOk(form.priority))
      e.priority = "Priority must be an integer between 1 and 5.";

    if (!isStartOk(form.startAt))
      e.startAt = "Start At cannot be in the past.";

    if (!isExpireOk(form.expiresAt, form.startAt))
      e.expiresAt = "Expires At must be in the future and after Start At.";

    setErrors(e);
    return e;
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    // live clear specific field error
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    if (name === "priority") {
      // normalize to digits, clamp 1..5, allow empty while typing
      const digits = value.replace(/[^\d-]/g, "");
      if (digits === "") {
        setForm((prev) => ({ ...prev, priority: "" }));
      } else {
        let n = Number(digits);
        if (!Number.isFinite(n)) n = 1;
        if (n < 1) n = 1;
        if (n > 5) n = 5;
        setForm((prev) => ({ ...prev, priority: n }));
      }
      return;
    }

    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length) return; // block submit

    setSaving(true);
    try {
      await axios.post(API_BASE, {
        ...form,
        // ensure priority is number on submit
        priority: Number(form.priority)
      }, { withCredentials: true });

      toast.success("Notification created");
      navigate("/admin/notifications");
    } catch (err) {
      toast.error(err?.response?.data?.message || "Error creating notification");
    } finally {
      setSaving(false);
    }
  };

  // UI helpers: apply red border when error present
  const inputClass = (hasError) =>
    `w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 ${
      hasError ? "border-red-500" : "border-neutral-200"
    }`;

  const hint = (msg, id) =>
    msg ? <p id={id} className="mt-1 text-xs text-red-600">{msg}</p> : null;

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
          noValidate
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
                className={inputClass(!!errors.title)}
                aria-invalid={!!errors.title}
                aria-describedby="title-error"
                required
              />
              {hint(errors.title, "title-error")}
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
                className={inputClass(!!errors.body) + " resize-y"}
                aria-invalid={!!errors.body}
                aria-describedby="body-error"
                required
              />
              {hint(errors.body, "body-error")}
              <p className="mt-1 text-[11px] text-neutral-500">
                {Math.min((form.body || "").trim().length, 20)}/20 minimum characters
              </p>
            </div>

            <div>
              <label className="mb-1 block text-xs font-medium uppercase tracking-wide text-neutral-500">
                Audience
              </label>
              <select
                name="audience"
                value={form.audience}
                onChange={handleChange}
                className={inputClass(false)}
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
                className={inputClass(false)}
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
                className={inputClass(!!errors.priority)}
                aria-invalid={!!errors.priority}
                aria-describedby="priority-error"
                min={1}
                max={5}
                step={1}
                placeholder="1 (lowest) - 5 (highest)"
              />
              {hint(errors.priority, "priority-error")}
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
                className={inputClass(!!errors.startAt)}
                aria-invalid={!!errors.startAt}
                aria-describedby="startAt-error"
              />
              {hint(errors.startAt, "startAt-error")}
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
                className={inputClass(!!errors.expiresAt)}
                aria-invalid={!!errors.expiresAt}
                aria-describedby="expiresAt-error"
              />
              {hint(errors.expiresAt, "expiresAt-error")}
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
