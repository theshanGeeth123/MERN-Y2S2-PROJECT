import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();
  const backendUrl = "http://localhost:4000/api/notifications";

  const fetchNotifications = async () => {
    try {
      const { data } = await axios.get(backendUrl, { withCredentials: true });
      if (data.success) setNotifications(data.data || data);
    } catch {
      toast.error("Failed to load notifications");
    }
  };

  useEffect(() => {
    fetchNotifications();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notification?")) return;
    try {
      await axios.delete(`${backendUrl}/${id}`, { withCredentials: true });
      toast.success("Notification deleted");
      fetchNotifications();
    } catch {
      toast.error("Error deleting notification");
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between mb-4">
        <h1 className="text-2xl font-bold">Notifications</h1>
        <button
          onClick={() => navigate("/admin/notifications/create")}
          className="px-4 py-2 bg-blue-600 text-white rounded"
        >
          + Create New
        </button>
      </div>

      <table className="w-full bg-white rounded shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Title</th>
            <th className="p-2">Active</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {notifications.map((n) => (
            <tr key={n._id} className="border-t">
              <td className="p-2">{n.title}</td>
              <td className="p-2">{n.isActive ? "Yes" : "No"}</td>
              <td className="p-2 space-x-2">
                <button
                  onClick={() => navigate(`/admin/notifications/${n._id}`)}
                  className="px-2 py-1 bg-green-600 text-white rounded"
                >
                  View
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
