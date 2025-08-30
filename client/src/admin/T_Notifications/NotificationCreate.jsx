import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function NotificationCreate() {
  const navigate = useNavigate();
  const backendUrl = "http://localhost:4000/api/notifications";

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
    setForm({ ...form, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(backendUrl, form, { withCredentials: true });
      toast.success("Notification created");
      navigate("/admin/notifications");
    } catch (err) {
      toast.error(err.response?.data?.message || "Error creating notification");
    }
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Create Notification</h1>
      <form onSubmit={handleSubmit} className="space-y-3 bg-white p-4 rounded shadow">
        <input
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          className="w-full border p-2 rounded"
          required
        />
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Body"
          className="w-full border p-2 rounded"
          required
        />
        <div className="flex gap-4">
          <select
            name="audience"
            value={form.audience}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="all">All</option>
            <option value="verified">Verified</option>
            <option value="unverified">Unverified</option>
          </select>
          <select
            name="type"
            value={form.type}
            onChange={handleChange}
            className="border p-2 rounded"
          >
            <option value="info">Info</option>
            <option value="warning">Warning</option>
            <option value="account">Account</option>
            <option value="promo">Promo</option>
            <option value="system">System</option>
          </select>
        </div>
        <input
          type="number"
          name="priority"
          value={form.priority}
          onChange={handleChange}
          placeholder="Priority"
          className="border p-2 rounded"
        />
        <div className="flex gap-4">
          <input
            type="datetime-local"
            name="startAt"
            value={form.startAt}
            onChange={handleChange}
            className="border p-2 rounded"
          />
          <input
            type="datetime-local"
            name="expiresAt"
            value={form.expiresAt}
            onChange={handleChange}
            className="border p-2 rounded"
          />
        </div>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            name="isActive"
            checked={form.isActive}
            onChange={handleChange}
          />
          Active
        </label>
        <div className="space-x-2">
          <button className="px-4 py-2 bg-blue-600 text-white rounded">
            Create
          </button>
          <button
            type="button"
            onClick={() => navigate("/admin/notifications")}
            className="px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default NotificationCreate;
