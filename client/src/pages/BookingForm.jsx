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
    try {
      const res = await axios.post(
        "http://localhost:4000/api/bookings",
        formData,
        { withCredentials: true }
      );
      toast.success("Booking Request successful!");
      console.log(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to book. Try again.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center py-10 px-4">
      <div className="w-full max-w-lg bg-white p-8 rounded-2xl shadow-xl">
        <h1 className="text-3xl font-bold mb-8 text-center text-black">
          Booking Request
        </h1>

        <form onSubmit={handleSubmit} className="space-y-5">
          
          <div>
            <label className="block text-lg font-semibold text-black mb-1">
              Email
            </label>
            <input
              type="email"
              name="userEmail"
              value={formData.userEmail}
              onChange={handleChange}
              required
              readOnly
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

         
          <div>
            <label className="block text-lg font-semibold text-black mb-1">
              Package
            </label>
            <input
              type="text"
              name="packageName"
              value={formData.packageName}
              readOnly
              className="w-full p-3 border border-gray-300 rounded-xl bg-gray-100 text-lg text-gray-900"
            />
          </div>

          
          <div>
            <label className="block text-lg font-semibold text-black mb-1">
              Venue
            </label>
            <input
              type="text"
              name="venue"
              value={formData.venue}
              onChange={handleChange}
              placeholder="Enter venue/location"
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          
          <div>
            <label className="block text-lg font-semibold text-black mb-1">
              Date
            </label>
            <input
              type="date"
              name="date"
              value={formData.date}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
          </div>

          
          <div>
            <label className="block text-lg font-semibold text-black mb-1">
              Time
            </label>
            <input
              type="time"
              name="time"
              value={formData.time}
              onChange={handleChange}
              required
              className="w-full p-3 border border-gray-300 rounded-xl bg-white text-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500"
            />
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
    </div>
  );
}

export default BookingForm;
