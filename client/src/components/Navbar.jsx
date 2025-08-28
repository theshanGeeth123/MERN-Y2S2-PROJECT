import React, { useContext } from "react";
import { assets } from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

function Navbar() {
  const navigate = useNavigate();
  const { userData, backendUrl, setUserData, setIsLoggedin } = useContext(AppContent);

  const sendVerificationOtp = async () => {
    try {
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/auth/send-verify-otp');
      if (data.success) {
        navigate('/email-verify');
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const logout = async () => {
    try {
      localStorage.removeItem('customer');
      axios.defaults.withCredentials = true;
      const { data } = await axios.post('http://localhost:4000/api/auth/logout');
      data.success && setIsLoggedin(false);
      data.success && setUserData(false);
      navigate('/');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const viewProfile = () => {
    navigate('/my-profile');
  };

  const viewHome = () => {
    navigate('/customer-home');
  };

  // NEW: notifications navigation
  const viewNotifications = () => {
    navigate('/notifications'); // adjust path if your route differs
  };

  return (
    <div className="w-full flex justify-between items-center p-4 sm:p-6 sm:px-24">
      <img src={assets.pic2} alt="" className="w-28 sm:w-32 " />

      {/* Right side: Notification + existing content (unchanged) */}
      <div className="flex items-center gap-4">
        {/* Notification icon */}
        <button
          onClick={viewNotifications}
          aria-label="Notifications"
          className="relative p-2 rounded-full hover:bg-gray-100 transition"
        >
          {/* Inline bell SVG to avoid extra deps */}
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

          {/* Optional unread badge: shows only if you track a count on userData */}
          {userData?.unreadCount > 0 && (
            <span className="absolute -top-0.5 -right-0.5 h-4 min-w-4 px-1 flex items-center justify-center rounded-full bg-red-500 text-white text-[10px] leading-none">
              {userData.unreadCount > 9 ? "9+" : userData.unreadCount}
            </span>
          )}
        </button>

        {userData ? (
          <div className="w-8 h-8 flex justify-center items-center rounded-full bg-black text-white relative group">
            {userData.name[0].toUpperCase()}
            <div className="absolute hidden group-hover:block top-0 right-0 z-10 text-black rounded pt-10">
              <ul className="list-none m-0 p-2 bg-gray-100 text-sm">
                {!userData.isAccountVerified && (
                  <li
                    onClick={sendVerificationOtp}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer"
                  >
                    Verify email
                  </li>
                )}
                <li
                  onClick={logout}
                  className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                >
                  Logout
                </li>
                {userData.isAccountVerified && (
                  <li
                    onClick={viewHome}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                  >
                    Home
                  </li>
                )}
                {userData.isAccountVerified && (
                  <li
                    onClick={viewProfile}
                    className="py-1 px-2 hover:bg-gray-200 cursor-pointer pr-10"
                  >
                    My Profile
                  </li>
                )}
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="flex items-center gap-2 border border-gray-500 rounded-full px-6 py-2 text-gray-800
        hover:bg-gray-100 transition-all"
          >
            Login <img src={assets.arrow_icon} alt="" />
          </button>
        )}
      </div>
    </div>
  );
}

export default Navbar;
