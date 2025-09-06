import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const BOOKING_API = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/bookings`
  : "http://localhost:4000/api/bookings";

function Bookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const navigate = useNavigate();

  const fetchBookings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(BOOKING_API, { withCredentials: true });
      setBookings(Array.isArray(res.data?.bookings) ? res.data.bookings : []);
    } catch (err) {
      console.error("Error fetching bookings:", err);
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const openModal = (booking) => {
    setSelectedBooking(booking);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedBooking(null);
    setModalOpen(false);
  };

  const handleStatusUpdate = async (status) => {
    if (!selectedBooking) return;
    try {
      await axios.put(
        `${BOOKING_API}/${selectedBooking._id}/status`,
        { status },
        { withCredentials: true }
      );
      toast.success(`Booking ${status.charAt(0).toUpperCase() + status.slice(1)}!`);
      fetchBookings();
      closeModal();
    } catch (err) {
      console.error(err.response?.data || err.message);
      toast.error("Failed to update status.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BOOKING_API}/${id}`, { withCredentials: true });
      toast.success("Booking deleted!");
      fetchBookings();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete booking.");
    }
  };

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-gray-900 mb-2 text-center">
          Booking Requests
        </h1>
        <p className="text-center text-gray-600 mb-4 text-lg">
          Manage all user bookings in one place
        </p>

        
        <div className="flex justify-center mb-6">
          <button
            onClick={() => navigate("/admin/booking-report")}
            className="mt-5 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition font-medium text-base"
          >
            Booking Trend Report
          </button>
        </div>

        {loading && <p className="text-center text-gray-500 text-lg">Loading bookings...</p>}
        {!loading && bookings.length === 0 && (
          <p className="text-center text-gray-500 text-lg font-medium">No bookings found.</p>
        )}

        {!loading && bookings.length > 0 && (
          <div className="mt-10 overflow-x-auto shadow-lg rounded-lg bg-white">
            <table className="min-w-full divide-y divide-gray-300">
              <thead className="bg-gray-700">
                <tr>
                  {["Email", "Package", "Venue", "Date", "Time", "Status", "Actions"].map((col) => (
                    <th
                      key={col}
                      className="px-6 py-3 text-left text-lg font-semibold text-white tracking-normal"
                    >
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookings.map((booking, index) => (
                  <tr
                    key={booking._id}
                    className={`hover:bg-gray-100 transition ${index % 2 === 0 ? "bg-gray-50" : "bg-white"}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-base text-black">{booking.userEmail}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-black">{booking.packageName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-black">{booking.venue}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-black">{booking.date}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-base text-black">{formatTime(booking.time)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={`px-4 py-2 rounded-full text-white text-sm font-semibold ${
                          booking.status.toLowerCase() === "approved"
                            ? "bg-green-600"
                            : booking.status.toLowerCase() === "pending"
                            ? "bg-yellow-500"
                            : "bg-red-600"
                        }`}
                      >
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap space-x-2">
                      <button
                        onClick={() => openModal(booking)}
                        className="px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition text-base font-medium"
                      >
                        Update
                      </button>
                      {booking.status.toLowerCase() === "cancelled" && (
                        <button
                          onClick={() => handleDelete(booking._id)}
                          className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-800 transition text-base font-medium"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl w-96 p-6">
            <h2 className="text-2xl font-bold mb-4 text-black">Update Booking Status</h2>
            <p className="text-lg text-gray-800 mb-6">
              Booking for <strong>{selectedBooking.packageName}</strong> by{" "}
              <strong>{selectedBooking.userEmail}</strong>
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => handleStatusUpdate("approved")}
                className="flex-1 py-2 bg-green-400 text-white rounded-lg hover:bg-green-700 transition font-medium text-base"
              >
                Approve
              </button>
              <button
                onClick={() => handleStatusUpdate("pending")}
                className="flex-1 py-2 bg-yellow-400 text-white rounded-lg hover:bg-yellow-500 transition font-medium text-base"
              >
                Pending
              </button>
              <button
                onClick={() => handleStatusUpdate("cancelled")}
                className="flex-1 py-2 bg-red-400 text-white rounded-lg hover:bg-red-700 transition font-medium text-base"
              >
                Cancel
              </button>
            </div>
            <button
              onClick={closeModal}
              className="mt-4 w-full py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition font-medium text-base"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Bookings;
