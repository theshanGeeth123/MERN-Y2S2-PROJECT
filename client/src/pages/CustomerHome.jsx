import React, { useContext } from "react";
import { AppContent } from "../context/AppContext";
import CustomerHomeNavbar from '../components/CustomerHomeNavbar';

function CustomerHome() {
  const { userData } = useContext(AppContent);

  if (!userData) {
    return (
      <div className="text-center mt-10">
        <h1 className="text-2xl">Loading user data...</h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-green-100">
      <CustomerHomeNavbar />
      <div className="w-full max-w-4xl mx-auto mt-10 p-6 bg-white shadow-lg rounded-2xl">
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
    </div>
  );
}

export default CustomerHome;
