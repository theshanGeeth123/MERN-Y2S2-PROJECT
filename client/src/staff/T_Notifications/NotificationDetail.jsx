// src/admin/T_Notifications/NotificationDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import NavBarStaff from "../../components/NavbarStaff";


const API_BASE = "http://localhost:4000/api/notifications";

function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [notif, setNotif] = useState(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

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

 
  const [errors, setErrors] = useState({});

  
  const now = () => new Date();
  const parseLocalDateTime = (val) => (val ? new Date(val) : null);
  const isBodyOk = (b) => (b || "").trim().length >= 20;
  const isPriorityOk = (p) => {
    const n = Number(p);
    return Number.isInteger(n) && n >= 1 && n <= 5;
  };
  const isStartOk = (start) => {
    if (!start) return true; 
    const s = parseLocalDateTime(start);
    return s && s >= now();
  };
  const isExpireOk = (expire, start) => {
    if (!expire) return true;
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
    if (!isPriorityOk(form.priority)) e.priority = "Priority must be an integer between 1 and 5.";
    if (!isStartOk(form.startAt)) e.startAt = "Start At cannot be in the past.";
    if (!isExpireOk(form.expiresAt, form.startAt))
      e.expiresAt = "Expires At must be in the future and after Start At.";
    setErrors(e);
    return e;
  };

  
  const inputClass = (hasError) =>
    `w-full rounded-md border bg-white px-3 py-2 text-sm outline-none transition focus:border-neutral-400 ${
      hasError ? "border-red-500" : "border-neutral-200"
    }`;
  const hint = (msg, id) => (msg ? <p id={id} className="mt-1 text-xs text-red-600">{msg}</p> : null);

  useEffect(() => {
    const fetchNotif = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${API_BASE}/${id}`, { withCredentials: true });
        const n = data?.data || data;
        setNotif(n);
        setForm({
          title: n.title || "",
          body: n.body || "",
          audience: n.audience || "all",
          type: n.type || "info",
          priority: n.priority ?? 0,
          isActive: !!n.isActive,
          startAt: n.startAt ? n.startAt.slice(0, 16) : "",
          expiresAt: n.expiresAt ? n.expiresAt.slice(0, 16) : ""
        });
      } catch {
        toast.error("Failed to load notification");
      } finally {
        setLoading(false);
      }
    };
    fetchNotif();
  }, [id]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    if (name === "priority") {
     
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

  const handleSave = async (e) => {
    e.preventDefault();
    const eMap = validate();
    if (Object.keys(eMap).length) return; 

    setSaving(true);
    try {
      await axios.put(
        `${API_BASE}/${id}`,
        { ...form, priority: Number(form.priority) },
        { withCredentials: true }
      );
      toast.success("Notification updated");
      setEditing(false);
      setNotif({ ...notif, ...form, priority: Number(form.priority) });
    } catch {
      toast.error("Error updating notification");
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

  if (!notif) {
    return (
      <div className="min-h-screen bg-neutral-50 text-neutral-900">
        <div className="mx-auto max-w-5xl px-4 py-6">
          <p className="text-sm text-neutral-500">Notification not found.</p>
          <button
            onClick={() => navigate("/staff/notifications")}
            className="mt-4 rounded-md border border-neutral-200 bg-white px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
          >
            Back to list
          </button>
        </div>
      </div>
    );
  }

  return (

    <><NavBarStaff/>

    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-5xl px-4 py-6">
        {/* Header */}
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold tracking-tight">
              {editing ? "Edit Notification" : "Notification Details"}
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
                onClick={() => {
                  setEditing(false);
                  setErrors({});
                }}
                className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
              >
                Cancel
              </button>
            )}
            <button
              onClick={() => navigate("/staff/notifications")}
              className="rounded-md border border-neutral-200 bg-white px-4 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
            >
              Back
            </button>
          </div>
        </div>

        {/* Content */}
        {!editing ? (
          <div className="mt-6 rounded-lg border border-neutral-200 bg-white p-5">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium">{notif.title}</h2>
              <p className="text-sm text-neutral-600">{notif.body}</p>
            </div>

            <div className="mt-5 grid grid-cols-1 gap-4 text-sm sm:grid-cols-2">
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Audience</div>
                <div className="mt-1 capitalize text-neutral-900">{notif.audience}</div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Type</div>
                <div className="mt-1 text-neutral-900">{notif.type}</div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Priority</div>
                <div className="mt-1 text-neutral-900">{notif.priority}</div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Status</div>
                <div className="mt-1">
                  {notif.isActive ? (
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
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Start</div>
                <div className="mt-1 text-neutral-900">
                  {notif.startAt ? new Date(notif.startAt).toLocaleString() : "-"}
                </div>
              </div>
              <div className="rounded-lg border border-neutral-200 p-4">
                <div className="text-neutral-500">Expires</div>
                <div className="mt-1 text-neutral-900">
                  {notif.expiresAt ? new Date(notif.expiresAt).toLocaleString() : "-"}
                </div>
              </div>
            </div>
          </div>
        ) : (
          <form
            onSubmit={handleSave}
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
                  placeholder="Title"
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
                  placeholder="Body"
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
                onClick={() => {
                  setEditing(false);
                  setErrors({});
                }}
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
    </>
  );
}

export default NotificationDetail;
