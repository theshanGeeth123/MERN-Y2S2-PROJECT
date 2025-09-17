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
    <div className="min-h-screen bg-white py-12">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center text-purple-900">
          My Booking Requests
        </h1>

        <div className="mt-12 bg-gray-700 border border-gray-300 rounded-lg p-8 shadow-md max-w-3xl mx-auto">
          {bookings.length === 0 ? (
            <p className="text-center text-gray-200 text-lg">
              No bookings found.
            </p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-1 md:grid-cols-2">
              {bookings.map((b) => (
                <div
                  key={b._id}
                  className="border border-white rounded-2xl p-5 bg-white
                             shadow-sm transform transition duration-300
                             hover:-translate-y-2 hover:shadow-lg hover:bg-gray-100
                             max-w-sm w-full mx-auto flex flex-col justify-between"
                >
                  <h2 className="text-xl font-bold text-center text-gray-800 mb-4">
                    {b.packageName}
                  </h2>

                  <div className="flex flex-col space-y-3">
                    <p className="flex items-center text-gray-700 text-base">
                      <FaCalendarAlt className="mr-3 text-blue-800" />
                      {new Date(b.date).toLocaleDateString()}
                    </p>
                    <p className="flex items-center text-gray-700 text-base">
                      <FaClock className="mr-3 text-blue-800" />
                      {formatTime(b.time)}
                    </p>
                    <p className="flex items-center text-gray-700 text-base">
                      <FaMapMarkerAlt className="mr-3 text-blue-800" />
                      {b.venue}
                    </p>
                  </div>

                  <div className="flex justify-center mt-4">
                    <span
                      className={`inline-block px-4 py-1 rounded-full text-sm font-medium ${
                        b.status.toLowerCase() === "approved"
                          ? "bg-green-600 text-white"
                          : b.status.toLowerCase() === "pending"
                          ? "bg-yellow-500 text-black"
                          : "bg-red-600 text-white"
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
    </div>
  );
}

export default UserBookings;
