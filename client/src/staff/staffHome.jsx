// src/staff/staffHome.jsx
import React from "react";

export default function StaffHome() {
  const staff = JSON.parse(localStorage.getItem("staff") || "null");
  return (
    <div className="min-h-screen p-6">
      <h1 className="text-3xl font-bold mb-2">Staff Dashboard</h1>
      {staff ? (
        <p className="text-gray-700">Welcome, {staff.firstName} {staff.lastName} ({staff.role})</p>
      ) : (
        <p className="text-gray-500">No staff session found.</p>
      )}
    </div>
  );
}
