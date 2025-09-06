import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AppContent } from "../context/AppContext";
import { FaCalendarAlt, FaClock, FaMapMarkerAlt } from "react-icons/fa";

const BOOKING_API = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/bookings/user/`
  : "http://localhost:4000/api/bookings/user/";

function UserBookings() {
  const { userData } = useContext(AppContent);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchBookings = async () => {
    if (!userData?.email) return;
    const email = userData.email.trim().toLowerCase();

    try {
      const res = await axios.get(`${BOOKING_API}${email}`);
      setBookings(res.data.bookings || []);
    } catch (err) {
      console.error("Failed to fetch bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    const interval = setInterval(fetchBookings, 5000);
    return () => clearInterval(interval);
  }, [userData]);

  const formatTime = (time24) => {
    if (!time24) return "";
    const [hourStr, minute] = time24.split(":");
    let hour = parseInt(hourStr, 10);
    const ampm = hour >= 12 ? "PM" : "AM";
    hour = hour % 12 || 12;
    return `${hour}:${minute} ${ampm}`;
  };

  if (!userData) return <p className="text-center mt-10">Loading user data...</p>;
  if (loading) return <p className="text-center mt-10">Loading your bookings...</p>;

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-5xl mx-auto">
        <h1 className="mt-5 text-4xl font-bold mb-8 text-center text-gray-600">
          My Booking Requests
        </h1>

        {bookings.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">No bookings found.</p>
        ) : (
          <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2">
            {bookings.map((b) => (
              <div
                key={b._id}
                className="mt-6 bg-white rounded-2xl shadow-lg p-6 border border-orange-300 hover:shadow-xl transform hover:-translate-y-1 transition w-full max-w-sm mx-auto"
              >
                <h2 className="text-xl font-bold text-black mb-4">{b.packageName}</h2>

                <p className="flex items-center text-gray-800 mb-2">
                  <FaCalendarAlt className="mr-4 text-indigo-800" />{" "}
                  {new Date(b.date).toLocaleDateString()}
                </p>
                <p className="flex items-center text-gray-800 mb-2">
                  <FaClock className="mr-4 text-indigo-800" /> {formatTime(b.time)}
                </p>
                <p className="flex items-center text-gray-800 mb-4">
                  <FaMapMarkerAlt className="mr-4 text-indigo-800" /> {b.venue}
                </p>

                <div className="flex justify-center mt-4">
                  <span
                    className={`inline-block px-4 py-1 rounded-full text-white font-semibold ${
                      b.status.toLowerCase() === "approved"
                        ? "bg-green-500"
                        : b.status.toLowerCase() === "pending"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {b.status.charAt(0).toUpperCase() + b.status.slice(1)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default UserBookings;
