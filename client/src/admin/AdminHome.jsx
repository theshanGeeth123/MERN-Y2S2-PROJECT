// pages/AdminHome.jsx
import React from "react";
import AdminNavbar from "../components/AdminNavbar";

function AdminHome() {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* Navbar */}
      <AdminNavbar />

      {/* Body Section */}
      <div className="p-6 space-y-6">
        
        {/* Top Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Total Users</h2>
            <p className="text-2xl font-bold text-slate-800 mt-2">1,240</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Active Rentals</h2>
            <p className="text-2xl font-bold text-slate-800 mt-2">320</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Payments</h2>
            <p className="text-2xl font-bold text-slate-800 mt-2">Rs. 56,000</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Revenue</h2>
            <p className="text-2xl font-bold text-green-600 mt-2">Rs. 1.2M</p>
          </div>
        </div>

        {/* Recent Activity Table */}
        <div className="bg-white shadow-md rounded-xl p-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Recent Rentals</h2>
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b text-gray-600">
                <th className="py-2">User</th>
                <th className="py-2">Item</th>
                <th className="py-2">Date</th>
                <th className="py-2">Status</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">John Doe</td>
                <td className="py-2">DJI Mavic 4 pro</td>
                <td className="py-2">2025-08-30</td>
                <td className="py-2 text-yellow-600 font-medium">Pending</td>
              </tr>
              <tr className="border-b hover:bg-gray-50">
                <td className="py-2">Sarah Lee</td>
                <td className="py-2">Canon EOS R5 Mark 2</td>
                <td className="py-2">2025-08-29</td>
                <td className="py-2 text-red-600 font-medium">Returned</td>
              </tr>
              <tr className="hover:bg-gray-50">
                <td className="py-2">No name</td>
                <td className="py-2">lockheed martin f-22 raptor</td>
                <td className="py-2">2025-08-28</td>
                <td className="py-2 text-green-600 font-medium">Active</td>
              </tr>
            </tbody>
          </table>
        </div>


        

      </div>
    </div>
  );
}

export default AdminHome;
