import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

function NotificationDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notif, setNotif] = useState(null);
  const backendUrl = "http://localhost:4000/api/notifications";

  useEffect(() => {
    const fetchNotif = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/${id}`, { withCredentials: true });
        if (data.success) setNotif(data.data || data);
      } catch {
        toast.error("Failed to load notification");
      }
    };
    fetchNotif();
  }, [id]);

  if (!notif) return <p className="p-6">Loading...</p>;

  return (
    <div className="p-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">{notif.title}</h1>
      <p className="mb-2">{notif.body}</p>
      <p><b>Audience:</b> {notif.audience}</p>
      <p><b>Type:</b> {notif.type}</p>
      <p><b>Priority:</b> {notif.priority}</p>
      <p><b>Status:</b> {notif.isActive ? "Active" : "Inactive"}</p>
      <p><b>Start:</b> {notif.startAt ? new Date(notif.startAt).toLocaleString() : "-"}</p>
      <p><b>Expires:</b> {notif.expiresAt ? new Date(notif.expiresAt).toLocaleString() : "-"}</p>

      <div className="mt-4 space-x-2">
        <button
          onClick={() => navigate(`/admin/notifications/${id}/edit`)}
          className="px-4 py-2 bg-yellow-500 text-white rounded"
        >
          Edit
        </button>
        <button
          onClick={() => navigate("/admin/notifications")}
          className="px-4 py-2 bg-gray-400 text-white rounded"
        >
          Back
        </button>
      </div>
    </div>
  );
}

export default NotificationDetail;
