// components/AdminNavbar.jsx
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Home, Users, ShoppingBag, CreditCard, LogOut, User } from "lucide-react";

function AdminNavbar() {
  const navigate = useNavigate();
  const [showMenu, setShowMenu] = useState(false);

  const logout = () => {
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const viewProfile = () => {
    navigate("/admin-profile");
  };

  return (
    <div className="bg-white shadow-md px-6 py-4 flex justify-between items-center mt-5">
      {/* Left: Logo / Title */}
      <h1 className="text-xl font-bold text-slate-800">Admin Dashboard</h1>

      {/* Center: Navigation Links */}
      <nav className="hidden md:flex items-center space-x-6">
        <Link
          to="/admin/home"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
        >
          <Home size={18} /> Dashboard
        </Link>
        <Link
          to="/users"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
        >
          <Users size={18} /> Users
        </Link>
        <Link
          to="/admin/all-rentals"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
        >
          <ShoppingBag size={18} /> Rentals
        </Link>
        <Link
          to="/packages"
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-slate-600 hover:bg-slate-200 transition"
        >
          <CreditCard size={18} /> Packages
        </Link>
      </nav>

      {/* Profile Dropdown */}
      <div className="relative">
        <div
          className="w-10 h-10 rounded-full overflow-hidden border border-gray-300 cursor-pointer"
          onClick={() => setShowMenu(!showMenu)}
        >
          <img
            src="https://images.unsplash.com/photo-1579389083078-4e7018379f7e?w=600&auto=format&fit=crop&q=60"
            alt="avatar"
            className="w-full h-full object-cover"
          />
        </div>

        {showMenu && (
          <div className="absolute right-0 mt-2 w-40 bg-white shadow-lg rounded-lg overflow-hidden z-10">
            <ul className="list-none m-0 p-2 text-sm text-gray-700">
              <li
                onClick={viewProfile}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer"
              >
                <User size={16} /> Profile
              </li>
              <li
                onClick={logout}
                className="flex items-center gap-2 px-3 py-2 hover:bg-gray-100 cursor-pointer text-red-600"
              >
                <LogOut size={16} /> Logout
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminNavbar;
