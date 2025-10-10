import React, { useState, useContext, useEffect } from "react"; 
import { useLocation } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../context/AppContext";

function BookingForm() {
  const { userData } = useContext(AppContent);
  const location = useLocation();
  const pkg = location.state?.package || {};

  const [formData, setFormData] = useState({
    userEmail: "",
    packageName: pkg.title || "",
    date: "",
    time: "",
    venue: "",
  });

  const [showPopup, setShowPopup] = useState(false); 

  useEffect(() => {
    if (userData?.email) {
      setFormData((prev) => ({ ...prev, userEmail: userData.email }));
    }
  }, [userData]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.date) {
      toast.error("Please select a date.");
      return;
    }

    if (!formData.time) {
      toast.error("Please enter a time.");
      return;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [year, month, day] = formData.date.split("-");
    const selectedDate = new Date(year, month - 1, day);

    if (selectedDate <= today) {
      toast.error("Please select a future date for booking.");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:4000/api/bookings",
        formData,
        { withCredentials: true }
      );
      console.log(res.data);

      setShowPopup(true);

      setFormData({
        ...formData,
        date: "",
        time: "",
        venue: "",
      });
    } catch (err) {
      console.error(err);
      toast.error("Failed to book. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-md bg-blue-950 p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-white">
          Booking Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5 text-lg">
          <div>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
              readOnly
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div>
            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-lg text-gray-900"
            />
          </div>

          <div>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Enter venue/location"
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-gray-900 text-lg placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          <div className="relative">
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              min={new Date().toISOString().split("T")[0]}
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              style={{ color: formData.date ? "black" : "transparent" }}
            />
            {!formData.date && (
              <span
                className="absolute left-3 top-3 text-gray-400 text-lg cursor-text"
                onClick={() => document.getElementsByName("date")[0].focus()}
              >
                mm/dd/yyyy
              </span>
            )}
          </div>

          <div className="relative">
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
              style={{ color: formData.time ? "black" : "transparent" }}
            />
            {!formData.time && (
              <span
                className="absolute left-3 top-3 text-gray-400 text-lg cursor-text"
                onClick={() => document.getElementsByName("time")[0].focus()}
              >
                6:30 PM
              </span>
            )}
          </div>

          <div className="flex justify-center">
            <button
              type="submit"
              className="w-48 py-2.5 bg-green-600 text-white font-bold rounded-xl hover:bg-green-700 transition duration-300 shadow-md text-lg"
            >
              Confirm Booking
            </button>
          </div>
        </form>
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-lg text-center w-80">
            <h2 className="text-2xl font-bold mb-4">Booking Successful!</h2>
            <p className="mb-6">Your package request has been submitted.</p>
            <button
              onClick={() => setShowPopup(false)}
              className="px-6 py-2 bg-green-600 text-white rounded-xl hover:bg-green-700 transition"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default BookingForm;
