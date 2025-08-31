// client/src/staff/staffHome.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "./StaffAuthContext";

const formatDate = (val) => {
  if (!val) return "-";
  const d = new Date(val);
  // falls back gracefully if the value isn't a valid date
  return isNaN(d.getTime()) ? String(val) : d.toLocaleDateString();
};

const StaffHome = () => {
  const { staff, logoutStaff } = useStaffAuth();
  const navigate = useNavigate();

  if (!staff) {
    return (
      <div className="min-h-[40vh] flex items-center justify-center">
        <p className="text-sm text-gray-600">Not logged in.</p>
      </div>
    );
  }

  const fullName = `${staff.firstName || ""} ${staff.lastName || ""}`.trim();

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Header card */}
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6 flex items-center gap-4">
        {/* Avatar / Image */}
        {staff.imageUrl ? (
          <img
            src={staff.imageUrl}
            alt={fullName || "Staff"}
            className="h-16 w-16 rounded-full object-cover border"
          />
        ) : (
          <div className="h-16 w-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-semibold">
            {fullName ? fullName[0].toUpperCase() : "S"}
          </div>
        )}

        <div className="flex-1">
          <h1 className="text-2xl font-semibold text-neutral-900">
            {fullName || "Staff Member"}
          </h1>
          <p className="text-sm text-neutral-600">
            Role: <span className="capitalize">{staff.role || "-"}</span>
          </p>
          <p className="text-sm text-neutral-600">Email: {staff.email || "-"}</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate("/staff/profile")}
            className="px-4 py-2 rounded-md border border-gray-300 text-sm hover:bg-gray-50"
          >
            View Profile
          </button>
          <button
            onClick={() => {
              logoutStaff();
              navigate("/staff/login");
            }}
            className="px-4 py-2 rounded-md bg-red-600 text-white text-sm hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Details grid */}
      <div className="mt-6 bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <h2 className="text-lg font-medium text-neutral-900 mb-4">Account Details</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Detail label="ID" value={staff._id} mono />
          <Detail label="First Name" value={staff.firstName} />
          <Detail label="Last Name" value={staff.lastName} />
          <Detail label="Email" value={staff.email} />
          <Detail label="Phone" value={staff.phone} />
          <Detail label="Address" value={staff.address} />
          <Detail label="Role" value={staff.role} />
          <Detail label="Active" value={staff.isActive ? "Yes" : "No"} />
          <Detail label="Date of Birth" value={formatDate(staff.dateOfBirth)} />
          <Detail label="Date Hired" value={formatDate(staff.dateHired)} />
          <Detail label="Created At" value={formatDate(staff.createdAt)} />
          <Detail label="Updated At" value={formatDate(staff.updatedAt)} />
        </div>
      </div>
    </div>
  );
};

const Detail = ({ label, value, mono = false }) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="text-neutral-500">{label}</div>
    <div className={`mt-1 ${mono ? "font-mono break-all" : "text-neutral-900"}`}>
      {value ?? "-"}
    </div>
  </div>
);

export default StaffHome;
