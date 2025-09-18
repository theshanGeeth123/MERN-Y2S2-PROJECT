import React from "react";
import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "./StaffAuthContext";

const fmt = (d) => {
  if (!d) return "-";
  const x = new Date(d);
  return isNaN(x.getTime()) ? String(d) : x.toLocaleDateString();
};

const Row = ({ label, value, mono }) => (
  <div className="rounded-lg border border-gray-200 p-4">
    <div className="text-neutral-500">{label}</div>
    <div className={`mt-1 ${mono ? "font-mono break-all" : "text-neutral-900"}`}>
      {value ?? "-"}
    </div>
  </div>
);

export default function StaffProfile() {
  const { staff } = useStaffAuth();
  const navigate = useNavigate();

  if (!staff) {
    
    navigate("/staff/login");
    return null;
  }

  const fullName = `${staff.firstName || ""} ${staff.lastName || ""}`.trim();

  return (
    <div className="max-w-4xl mx-auto p-6">
      
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={() => navigate(-1)}
          className="text-sm text-gray-600 hover:text-gray-800"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-semibold text-neutral-900">My Profile</h1>
        <div />
      </div>

     
      <div className="bg-white border border-gray-200 rounded-2xl shadow-sm p-6">
        <div className="flex items-center gap-4 mb-6">
          {staff.imageUrl ? (
            <img
              src={staff.imageUrl}
              alt={fullName || "Staff"}
              className="h-16 w-16 rounded-full object-cover border"
            />
          ) : (
            <div className="h-16 w-16 rounded-full bg-neutral-900 text-white flex items-center justify-center text-xl font-semibold">
              {(fullName && fullName[0]) ? fullName[0].toUpperCase() : "S"}
            </div>
          )}

          <div className="flex-1">
            <div className="text-xl font-medium text-neutral-900">{fullName || "Staff Member"}</div>
            <div className="text-sm text-neutral-600 capitalize">{staff.role || "-"}</div>
          </div>

          
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
          <Row label="ID" value={staff._id} mono />
          <Row label="Email" value={staff.email} />
          <Row label="First Name" value={staff.firstName} />
          <Row label="Last Name" value={staff.lastName} />
          <Row label="Phone" value={staff.phone} />
          <Row label="Address" value={staff.address} />
          <Row label="Role" value={staff.role} />
          <Row label="Active" value={staff.isActive ? "Yes" : "No"} />
          <Row label="Date of Birth" value={fmt(staff.dateOfBirth)} />
          <Row label="Date Hired" value={fmt(staff.dateHired)} />
          <Row label="Created At" value={fmt(staff.createdAt)} />
          <Row label="Updated At" value={fmt(staff.updatedAt)} />
        </div>
      </div>
    </div>
  );
}
