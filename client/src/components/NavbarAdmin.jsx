// src/components/Navbar.jsx
import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import MainLogo from "../assets/Main_Logo.png";

function NavbarAdmin() {
  const navigate = useNavigate();

  // Superset of both branches' context values
  const { userData, backendUrl, setUserData, setIsLoggedin, isLoggedin } =
    useContext(AppContent);

  const API_BASE = backendUrl || "http://localhost:4000";

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post(`${API_BASE}/api/auth/send-verify-otp`);
      if (data.success) {
        navigate("/email-verify");
        toast.success(data.message);
      } else {
        toast.error(data.message || "Failed to send verification email");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const logout = async () => {
    try {
      axios.defaults.withCredentials = true;

      // Try to clear cart on server (graceful failure)
      if (userData?.id) {
        try {
          await axios.delete(`${API_BASE}/api/cart/clear`, {
            data: { userId: userData.id },
          });
        } catch (err) {
          // Not fatal—continue with logout
          // console.error("Failed to clear cart on logout:", err?.response?.data || err.message);
        }
      }

      // Clear local state/storage
      localStorage.removeItem("customer");

      // Invalidate session on server
      const { data } = await axios.post(`${API_BASE}/api/auth/logout`);

      if (data.success) {
        setIsLoggedin?.(false);
        setUserData?.(null);
        toast.success("Logged out");
      } else {
        toast.error(data.message || "Logout failed");
      }

      navigate("/");
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  const viewProfile = () => navigate("/my-profile");
  const viewHome = () => navigate("/customer-home");
  const viewNotifications = () => navigate("/notifications");

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24 mt-5 max-h-[100px]">
      <img src={MainLogo} alt="logo" className="w-28 sm:w-32" />

      <div className="flex items-center gap-4">
        {/* Notifications (only when logged in) */}
        {isLoggedin && (
          <button
            onClick={viewNotifications}
            aria-label="Notifications"
            className="relative p-2 rounded-full hover:bg-gray-100 transition"
            title="Notifications"
          >
            {/* Bell icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-gray-700"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.8"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.243 17.657a2 2 0 01-4.486 0M18 8a6 6 0 10-12 0c0 4-2 5.5-2 5.5h16S18 12 18 8z"
              />
            </svg>
            {/* Optional unread badge */}
            {userData?.unreadCount > 0 && (
              <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] leading-none">
                {userData.unreadCount > 9 ? "9+" : userData.unreadCount}
              </span>
            )}
          </button>
        )}

        
          <button
            onClick={() => navigate("/admin/home")}
            className="2xl:mr-5 flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800 hover:bg-gray-100 transition-all"
          >
            Dashboard
          </button>
       
      </div>
    </div>
  );
}

export default NavbarAdmin;
