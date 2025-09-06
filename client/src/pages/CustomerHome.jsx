import React, { useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";

function CustomerHome() {
  const { userData } = useContext(AppContent);
  const navigate = useNavigate();

  if (!userData) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Loading user data...</h1>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto mt-10">
      <div className="p-6 bg-white shadow-lg rounded-2xl">
        <h1 className="text-4xl font-bold text-center mb-6">Customer Home</h1>

        <div className="space-y-4">
          <p className="text-lg">
            <span className="font-semibold">ID:</span> {userData.id}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Name:</span> {userData.name}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Email:</span> {userData.email}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Age:</span> {userData.age}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Phone:</span> {userData.phone}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Address:</span> {userData.address}
          </p>
          <p className="text-lg">
            <span className="font-semibold">Verified:</span>{" "}
            {userData.isAccountVerified ? "✅ Yes" : "❌ No"}
          </p>
        </div>
      </div>

      <div className="mt-6 flex justify-center gap-4">
        <button
          onClick={() => navigate("/userpackages")}
          className="px-6 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          View Packages
        </button>

       
        <button
          onClick={() => navigate("/my-bookings")}
          className="px-6 py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition"
        >
          My Booking Requests
        </button>
      </div>
    </div>
  );
}

export default CustomerHome;
