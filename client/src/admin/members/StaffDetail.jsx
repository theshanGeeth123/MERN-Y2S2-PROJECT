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

  
  const [pwOpen, setPwOpen] = useState(false);
  const [newPw, setNewPw] = useState("");
  const [confirmPw, setConfirmPw] = useState("");
  const [savingPw, setSavingPw] = useState(false);

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
    } catch (err) {
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
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setSaving(false);
    }
  };

 
  const openPwModal = () => {
    setNewPw("");
    setConfirmPw("");
    setPwOpen(true);
  };

  const closePwModal = () => {
    if (savingPw) return;
    setPwOpen(false);
    setNewPw("");
    setConfirmPw("");
  };

  const submitPassword = async () => {
    if (!newPw || !confirmPw) {
      toast.error("Please enter and confirm the new password");
      return;
    }
    if (newPw !== confirmPw) {
      toast.error("Passwords do not match");
      return;
    }
    if (newPw.length < 6) {
      toast.error("Password must be at least 6 characters");
      return;
    }
    try {
      setSavingPw(true);
      await axios.put(
        `${API_BASE}/${id}`,
        { password: newPw },
        { withCredentials: true }
      );
      toast.success("Password updated");
      closePwModal();
    } catch {
      toast.error("Failed to update password");
    } finally {
      setSavingPw(false);
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
            <h1 className="mt-8 text-3xl font-bold text-green-800">
              {editing ? "Edit Staff" : "Staff Details"}
            </h1>
            <p className="mt-3 text-sm text-gray-500">
              {editing
                ? "Update fields and save changes."
                : "View details of staff member."}
            </p>
          </div>
          <div className="flex gap-2">
            {!editing && (
              <button
                onClick={openPwModal}
                className="mt-8 rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-100 transition"
              >
                Change Password
              </button>
            )}
            <button
              onClick={() => navigate("/admin/staff")}
              className="mt-8 rounded-md border border-gray-300 bg-gray-700 px-4 py-2 text-sm text-white shadow-sm hover:bg-black transition"
            >
              Back
            </button>
          </div>
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
                  <h2 className="text-lg font-semibold text-black">
                    {row.firstName} {row.lastName}
                  </h2>
                  <div className="text-sm text-gray-700">{row.email}</div>
                  <div className="text-sm capitalize text-gray-700">
                    {row.role}
                  </div>
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
                    {row.dateOfBirth
                      ? new Date(row.dateOfBirth).toLocaleDateString()
                      : "-"}
                  </div>
                </div>
                <div className="rounded-lg border border-gray-200 p-4 shadow-sm">
                  <div className="text-black font-semibold">Date hired</div>
                  <div className="mt-1 text-gray-700">
                    {row.dateHired
                      ? new Date(row.dateHired).toLocaleDateString()
                      : "-"}
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
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm text-gray-700">
                  First Name
                </label>
                <input
                  name="firstName"
                  value={form.firstName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Last Name</label>
                <input
                  name="lastName"
                  value={form.lastName}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Email</label>
                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Role</label>
                <select
                  name="role"
                  value={form.role}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                >
                  <option value="photographer">Photographer</option>
                  <option value="editor">Editor</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-700">Phone</label>
                <input
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">Address</label>
                <input
                  name="address"
                  value={form.address}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  Date of Birth
                </label>
                <input
                  type="date"
                  name="dateOfBirth"
                  value={form.dateOfBirth}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-700">
                  Date Hired
                </label>
                <input
                  type="date"
                  name="dateHired"
                  value={form.dateHired}
                  onChange={handleChange}
                  className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  name="isActive"
                  checked={form.isActive}
                  onChange={handleChange}
                />
                <label className="text-sm text-gray-700">Active</label>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow hover:bg-blue-700 disabled:opacity-60"
              >
                {saving ? "Saving..." : "Save Changes"}
              </button>
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm text-gray-800 shadow-sm hover:bg-gray-100"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      
      {pwOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded-xl bg-white shadow-lg">
            <div className="border-b border-gray-200 px-5 py-4">
              <h3 className="text-base font-semibold text-gray-900">
                Change Password
              </h3>
              <p className="mt-1 text-xs text-gray-500">
                {row.firstName} {row.lastName} · {row.email}
              </p>
            </div>

            <div className="px-5 py-4">
              <label className="block text-sm text-gray-700">New password</label>
              <input
                type="password"
                value={newPw}
                onChange={(e) => setNewPw(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Enter new password"
              />

              <label className="mt-4 block text-sm text-gray-700">
                Confirm password
              </label>
              <input
                type="password"
                value={confirmPw}
                onChange={(e) => setConfirmPw(e.target.value)}
                className="mt-1 w-full rounded-md border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-400"
                placeholder="Re-enter password"
              />
            </div>

            <div className="flex items-center justify-end gap-2 border-t border-gray-200 px-5 py-3">
              <button
                onClick={closePwModal}
                disabled={savingPw}
                className="rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-800 hover:bg-gray-100 disabled:opacity-60"
              >
                Cancel
              </button>
              <button
                onClick={submitPassword}
                disabled={savingPw}
                className="rounded-md bg-blue-700 px-3 py-2 text-sm font-medium text-white hover:bg-blue-800 disabled:opacity-60"
              >
                {savingPw ? "Saving…" : "Save Password"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default StaffDetail;
