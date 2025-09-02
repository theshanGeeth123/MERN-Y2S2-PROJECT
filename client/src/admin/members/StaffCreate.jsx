import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/staff`
  : "http://localhost:4000/api/staff";

const initial = {
  firstName: "",
  lastName: "",
  email: "",
  password: "",
  role: "photographer",
  phone: "",
  address: "",
  dateOfBirth: "",
  dateHired: "",
  imageUrl: "",
  isActive: true,
};

function StaffCreate() {
  const navigate = useNavigate();
  const [form, setForm] = useState(initial);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((p) => ({ ...p, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    
    if (!form.firstName.trim() || !form.lastName.trim()) {
      toast.error("First and last name are required");
      return;
    }

    if (!form.email.includes("@") || !form.email.includes(".")) {
      toast.error("Please enter a valid email address");
      return;
    }

    if (form.password.length < 4) {
      toast.error("Password must be at least 4 characters");
      return;
    }

    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(form.phone)) {
      toast.error("Phone number must be exactly 10 digits");
      return;
    }

    if (form.dateOfBirth && new Date(form.dateOfBirth) > new Date()) {
      toast.error("Date of birth cannot be in the future");
      return;
    }

    setSaving(true);
    try {
      const payload = { ...form };
      if (!payload.dateHired) delete payload.dateHired;
      await axios.post(API_BASE, payload, { withCredentials: true });
      toast.success("Staff member created");
      navigate("/admin/staff");
    } catch {
      toast.error("Create failed");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-900">
      <div className="mx-auto max-w-4xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold tracking-tight text-blue-900">
              New Staff
            </h1>
            <p className="mt-3 text-l text-neutral-500">Add a new staff member.</p>
          </div>
          <button
            onClick={() => navigate(-1)}
            className="rounded-md border border-neutral-200 bg-gray-300 px-3 py-2 text-sm text-neutral-800 transition hover:bg-neutral-300"
          >
            Back
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="mt-6 space-y-6 rounded-xl border border-neutral-200 bg-white p-8 shadow-lg"
        >
          <div className="grid gap-6 sm:grid-cols-2">
            <div>
              <label className="mb-2 block text-xm font-semibold text-black">
                First name
              </label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xm font-semibold text-black">
                Last name
              </label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xm font-semibold text-black">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xm font-semibold text-black">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={form.password}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xm font-semibold text-black">
                Role
              </label>
              <select
                name="role"
                value={form.role}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
              >
                <option value="photographer">Photographer</option>
                <option value="manager">Manager</option>
                <option value="editor">Editor</option>
                <option value="other">Other</option>
              </select>
            </div>

            <div>
              <label className="mb-2 block text-xm font-semibold text-black">
                Phone
              </label>
              <input
                name="phone"
                value={form.phone}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <label className="mb-2 block text-xm font-semibold text-black">
                Address
              </label>
              <input
                name="address"
                value={form.address}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xm font-semibold text-black">
                Date of birth
              </label>
              <input
                type="date"
                name="dateOfBirth"
                value={form.dateOfBirth}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
                required
              />
            </div>

            <div>
              <label className="mb-2 block text-xm font-semibold text-black">
                Date hired (optional)
              </label>
              <input
                type="date"
                name="dateHired"
                value={form.dateHired}
                onChange={handleChange}
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
              />
            </div>

           
            <div className="sm:col-span-2">
              <label className="mb-2 block text-xm font-semibold text-black">
                Profile image URL (optional)
              </label>
              <input
                name="imageUrl"
                value={form.imageUrl}
                onChange={handleChange}
                placeholder="https://…"
                className="w-full rounded-lg border border-neutral-300 bg-neutral-50 px-4 py-2 text-sm text-neutral-900 outline-none transition focus:border-neutral-500 focus:ring-1 focus:ring-neutral-300"
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

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="rounded-lg border border-neutral-300 bg-white px-5 py-2 text-sm text-neutral-800 transition hover:bg-neutral-100"
              disabled={saving}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-lg bg-green-500 px-5 py-2 text-sm font-medium text-white transition hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-neutral-400 disabled:opacity-60"
              disabled={saving}
            >
              {saving ? "Saving…" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default StaffCreate;
