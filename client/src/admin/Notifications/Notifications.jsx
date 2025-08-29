import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [editing, setEditing] = useState(null);
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

  const backendUrl = "http://localhost:4000/api/notifications"; // ⚡ replace with context backendUrl if available

  // Fetch all notifications
  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(backendUrl, { withCredentials: true });
      if (data.success) {
        setNotifications(data.data || data);
      }
    } catch (err) {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  // Handle form changes
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({
      ...form,
      [name]: type === "checkbox" ? checked : value
    });
  };

  // Submit (Add or Edit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editing) {
        await axios.put(`${backendUrl}/${editing}`, form, { withCredentials: true });
        toast.success("Notification updated");
      } else {
        await axios.post(backendUrl, form, { withCredentials: true });
        toast.success("Notification created");
      }
      resetForm();
      fetchNotifications();
    } catch (err) {
      toast.error(err.response?.data?.message || "Error saving notification");
    }
  };

  // Edit
  const handleEdit = (notif) => {
    setEditing(notif._id);
    setForm({
      title: notif.title,
      body: notif.body,
      audience: notif.audience,
      type: notif.type,
      priority: notif.priority,
      isActive: notif.isActive,
      startAt: notif.startAt ? notif.startAt.slice(0, 16) : "",
      expiresAt: notif.expiresAt ? notif.expiresAt.slice(0, 16) : ""
    });
  };

  // Delete
  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await axios.delete(`${backendUrl}/${id}`, { withCredentials: true });
      toast.success("Notification deleted");
      fetchNotifications();
    } catch (err) {
      toast.error("Error deleting notification");
    }
  };

  // Reset form
  const resetForm = () => {
    setForm({
      title: "",
      body: "",
      audience: "all",
      type: "info",
      priority: 0,
      isActive: true,
      startAt: "",
      expiresAt: ""
    });
    setEditing(null);
  };

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Manage Notifications</h1>

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white p-4 rounded shadow mb-6 space-y-3"
      >
        <input
          type="text"
          name="title"
          value={form.title}
          onChange={handleChange}
          placeholder="Title"
          required
          className="w-full border p-2 rounded"
        />
        <textarea
          name="body"
          value={form.body}
          onChange={handleChange}
          placeholder="Body"
          required
          className="w-full border p-2 rounded"
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
          <input
            type="number"
            name="priority"
            value={form.priority}
            onChange={handleChange}
            placeholder="Priority"
            className="border p-2 rounded w-24"
          />
        </div>

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

        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          {editing ? "Update" : "Create"} Notification
        </button>
        {editing && (
          <button
            type="button"
            onClick={resetForm}
            className="ml-3 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Cancel
          </button>
        )}
      </form>

      {/* List */}
      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Audience</th>
            <th className="p-2">Type</th>
            <th className="p-2">Priority</th>
            <th className="p-2">Active</th>
            <th className="p-2">Start</th>
            <th className="p-2">Expires</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n._id} className="border-t">
              <td className="p-2">{n.title}</td>
              <td className="p-2">{n.audience}</td>
              <td className="p-2">{n.type}</td>
              <td className="p-2">{n.priority}</td>
              <td className="p-2">{n.isActive ? "Yes" : "No"}</td>
              <td className="p-2">{n.startAt ? new Date(n.startAt).toLocaleString() : "-"}</td>
              <td className="p-2">{n.expiresAt ? new Date(n.expiresAt).toLocaleString() : "-"}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => handleEdit(n)}
                  className="px-2 py-1 bg-yellow-500 text-white rounded"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(n._id)}
                  className="px-2 py-1 bg-red-600 text-white rounded"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default Notifications;
