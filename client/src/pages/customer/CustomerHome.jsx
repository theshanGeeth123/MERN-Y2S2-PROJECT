// src/admin/CustomerHome.jsx
import React, { useRef, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBars,
  FaTimes,
  FaShoppingBag,
  FaShoppingCart,
  FaCreditCard,
  FaClipboardList,
  FaBell,
  FaCommentDots,
  FaQuestionCircle,
  FaBookOpen,
  FaBoxOpen,
  FaUser,
  FaSignOutAlt,
  FaHome
} from "react-icons/fa";
import axios from "axios";
import { toast } from "react-toastify";
import { AppContent } from "../../context/AppContext";
import { ShoppingBag, Star, Calendar, Quote, User } from "lucide-react";

const links = [
  { label: "Home", path: "/main-home", icon: <FaHome  /> },
  { label: "View Products", path: "/products", icon: <FaShoppingBag /> },
  { label: "Packages", path: "/userpackages", icon: <FaBoxOpen /> },
  { label: "My Bookings", path: "/my-bookings", icon: <FaBookOpen /> },
  { label: "View Cart", path: "/cart", icon: <FaShoppingCart /> },
  { label: "My Cards", path: "/cards", icon: <FaCreditCard /> },
  { label: "My Orders", path: "/my-orders", icon: <FaClipboardList /> },
  { label: "Notifications", path: "/notifications", icon: <FaBell /> },
  { label: "Feedback", path: "/customer-feedback", icon: <FaCommentDots /> },
  { label: "Q&A", path: "/customer-questions", icon: <FaQuestionCircle /> },
  { label: "Rentals", path: "/all-rentals", icon: <ShoppingBag size={18} /> },
];

const CustomerHome = () => {
  const navigate = useNavigate();
  const closeBtnRef = useRef(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);
  const [loading, setLoading] = useState(false);
  const [feedbacks, setFeedbacks] = useState([]);

  const { backendUrl, userData, setIsLoggedin, setUserData } =
    useContext(AppContent);

  const API_BASE = backendUrl || "http://localhost:4000";

  // Lock background scroll + focus the close button when drawer is open
  useEffect(() => {
    loadAllFeedbacks();
    if (mobileOpen) {
      document.body.style.overflow = "hidden";
      // slight delay to allow element to mount
      setTimeout(() => closeBtnRef.current?.focus(), 0);
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const loadAllFeedbacks = async () => {
    setLoading(true);
    try {
      const data = await axios.get(`http://localhost:4000/api/user/feedback`);
      if (data.status=="200") {
         let feedbackList = Array.isArray(data) ? data :Array.isArray(data.data) ? data.data : data.data.data || [];
         feedbackList.reverse();
         setFeedbacks(feedbackList);
      } else {
         toast.error(data.message);
      }
      setLoading(false);
    } catch (e) {
      setLoading(false);
      toast.error("Error occurred: " + e);
    }
  };

  const PartialStar = ({ value = 0 }) => {
    const percent = Math.min(Math.max((value / 5) * 100, 0), 100); // 0–100%
    return (
      <div className="relative h-5 w-5">
        {/* Background star (gray) */}
        <Star className="absolute top-0 left-0 h-5 w-5 text-gray-300" />

        {/* Foreground star (yellow) clipped to width */}
        <div
          className="absolute top-0 left-0 h-5 overflow-hidden"
          style={{ width: `${percent}%` }}
        >
          <Star className="h-5 w-5 text-yellow-400 fill-yellow-400" />
        </div>
      </div>
    );
  };

  const logout = async () => {
    if (loggingOut) return;
    setLoggingOut(true);
    try {
      axios.defaults.withCredentials = true;

      if (userData?.id) {
        try {
          await axios.delete(`${API_BASE}/api/cart/clear`, {
            data: { userId: userData.id },
          });
        } catch { /* ignore */ }
      }

      localStorage.removeItem("customer");

      const { data } = await axios.post(`${API_BASE}/api/auth/logout`);
      if (data?.success) {
        setIsLoggedin?.(false);
        setUserData?.(null);
        toast.success("Logged out successfully");
      } else {
        toast.error(data?.message || "Logout failed");
      }

      navigate("/main-home", { replace: true });
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* MOBILE TOP BAR */}
      <header className="fixed inset-x-0 top-0 z-40 border-b border-gray-200 md:hidden bg-white backdrop-blur-sm shadow-sm">
        <div className="mx-auto max-w-screen-2xl px-4 h-16 flex items-center justify-between">
          <button
            type="button"
            aria-label="Open menu"
            className="p-2 rounded-md hover:bg-gray-100 text-gray-700 transition-colors"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars className="text-lg" />
          </button>
          <h1 className="text-lg font-semibold text-gray-900">
            {userData?.name || "Customer"}
          </h1>
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700">
            <FaUser className="text-sm" />
          </div>
        </div>
      </header>

      {/* MAIN GRID */}
      <div className="grid min-h-screen md:grid-cols-[20rem_1fr] pt-16 md:pt-0">
        {/* SIDEBAR (desktop) - BLACK THEME */}
        <aside className="hidden md:flex md:flex-col bg-gray-900 border-r border-gray-800 shadow-lg">
          <div className="sticky top-0 z-30 bg-gray-900">
            <div className="h-20 px-6 flex items-center justify-between border-b border-gray-800">
              <div className="flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-gray-800 text-white">
                  <a href="/my-profile"><FaUser className="text-lg" /></a>
                </div>
                <div>
                  <span className="font-semibold text-lg text-white block">
                    {userData?.name || "Customer"}
                  </span>
                  <span className="text-sm text-gray-400">Welcome back!</span>
                </div>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-6 px-4 space-y-1">
            {links.map((link, i) => (
              <NavItem
                key={i}
                icon={link.icon}
                label={link.label}
                onClick={() => navigate(link.path)}
              />
            ))}
            <div className="pt-4 mt-4 border-t border-gray-800">
              <NavItem
                icon={<FaSignOutAlt />}
                label={loggingOut ? "Logging out..." : "Logout"}
                onClick={logout}
                isLogout
              />
            </div>
          </nav>

          <div className="p-4 border-t border-gray-800 text-xs text-gray-500 bg-gray-900">
            © {new Date().getFullYear()} JW-Studio. All rights reserved.
          </div>
        </aside>

        {/* MOBILE DRAWER - BLACK THEME (SCROLLABLE) */}
        {mobileOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            <div
              className="absolute inset-0 bg-black/50 backdrop-blur-sm"
              onClick={() => setMobileOpen(false)}
              aria-hidden="true"
            />
            <div
              role="dialog"
              aria-modal="true"
              className="absolute left-0 top-0 h-full w-80 bg-gray-900 shadow-xl flex flex-col"
              // safe area paddings to avoid cutoffs on devices with home bar/notch
              style={{
                paddingTop: "env(safe-area-inset-top)",
                paddingBottom: "env(safe-area-inset-bottom)",
              }}
            >
              {/* Drawer Header */}
              <div className="h-16 px-4 border-b border-gray-800 flex items-center justify-between">
                <span className="font-semibold text-white text-lg">Customer Portal</span>
                <button
                  type="button"
                  aria-label="Close menu"
                  className="p-2 rounded-md hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                  onClick={() => setMobileOpen(false)}
                  ref={closeBtnRef}
                >
                  <FaTimes />
                </button>
              </div>

              {/* Profile */}
              <div className="p-4 border-b border-gray-800 flex items-center gap-3">
                <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gray-800 text-white">
                  <FaUser />
                </div>
                <div>
                  <p className="text-sm font-medium text-white">
                    {userData?.name || "Customer"}
                  </p>
                  <p className="text-xs text-gray-400">Welcome back!</p>
                </div>
              </div>

              {/* SCROLL AREA */}
              <div className="flex-1 overflow-y-auto">
                <nav className="p-4 space-y-1">
                  {links.map((link, i) => (
                    <NavItem
                      key={i}
                      icon={link.icon}
                      label={link.label}
                      onClick={() => {
                        setMobileOpen(false);
                        navigate(link.path);
                      }}
                    />
                  ))}

                  <div className="pt-4 mt-4 border-t border-gray-800">
                    <NavItem
                      icon={<FaSignOutAlt />}
                      label={loggingOut ? "Logging out..." : "Logout"}
                      onClick={async () => {
                        setMobileOpen(false);
                        await logout();
                      }}
                      isLogout
                    />
                  </div>
                </nav>
              </div>
            </div>
          </div>
        )}

        {/* CONTENT - WHITE BACKGROUND */}
        <main className="w-full bg-white">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-8 md:py-10">
            <div className="mb-8">
              <h2 className="text-3xl font-bold text-gray-900">Welcome back!</h2>
              <p className="text-gray-600 mt-2">
                Manage your account and explore our products
              </p>
            </div>

            {/* Quick actions */}
            <section>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Actions</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {links.map((a, i) => (
                  <button
                    key={i}
                    type="button"
                    onClick={() => navigate(a.path)}
                    className="group rounded-xl border border-gray-200 bg-white hover:border-gray-300 hover:shadow-md transition-all p-5 flex flex-col items-start gap-4 focus:outline-none focus:ring-2 focus:ring-gray-300 focus:ring-offset-2"
                  >
                    <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-gray-100 text-gray-700 group-hover:bg-gray-200 transition-colors">
                      {a.icon}
                    </span>
                    <span className="text-base font-medium text-gray-900 text-left">
                      {a.label}
                    </span>
                  </button>
                ))}
              </div>
            </section>

            {/* Stats */}
            <section className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Recent Orders</h4>
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">No recent orders</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Cart Items</h4>
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Items waiting for you</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
                <h4 className="text-sm font-medium text-gray-500 mb-2">Saved Cards</h4>
                <p className="text-2xl font-semibold text-gray-900">0</p>
                <p className="text-xs text-gray-500 mt-1">Payment methods</p>
              </div>
            </section>

            {/* Customer Reviews */}
            <section>
              <h3 className="mt-12 text-lg font-medium text-gray-900 mb-4">Customer Reviews</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                {!loading && feedbacks.length > 0 && (
                  <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {feedbacks.map((fb) => (
                      <article key={fb._id} className="group relative flex h-full flex-col rounded-xl border border-gray-200 bg-white p-5
                          shadow-sm transition-all hover:shadow-md hover:-translate-y-0.5">
                        <div className="flex-1 flex flex-col">
                          <header className="mt-2 mb-3 flex items-start justify-between gap-3">
                            <h4 className="text-sm font-semibold text-gray-900">
                              {/* If your value is like "John Doe Photography" and you only want the name: */}
                              {(fb.selectedPhotographer )}
                            </h4>
                            <div className="flex items-center gap-2 rounded-full bg-gray-100 px-3 py-1">
                              <span className="text-xs font-medium text-gray-500">{fb.rate}/5</span>
                              <PartialStar value={Number(fb.rate) || 0} />
                            </div>
                          </header>
                          <div className="relative">
                            <Quote className="absolute -left-1 -top-1 h-4 w-4 text-gray-300" />
                            <p className="pl-5 text-sm leading-relaxed text-gray-700 line-clamp-4">
                              {fb.comment || "No comment provided."}
                            </p>
                          </div>
                        </div>
                        <footer className="mt-8 flex flex-col items-start justify-between text-xs text-gray-500 space-y-1">
                          <div className="flex items-center gap-1.5">
                            <User className="h-3.5 w-3.5 text-gray-400" />
                            <span className="truncate" title={fb.username}>
                              {fb.username || "Anonymous"}
                            </span>
                          </div>
                          <div>
                            <span className="inline-flex items-center gap-1">
                              <Calendar className="h-3.5 w-3.5 text-gray-400" />
                              {fb.createdAt ? new Date(fb.createdAt).toISOString().split("T")[0]  : ""}
                            </span>
                          </div>
                        </footer>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
};

// Enhanced NavItem component with black theme styling
function NavItem({ icon, label, onClick, isLogout = false }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-base font-medium transition-all cursor-pointer
        ${
          isLogout
            ? "text-red-400 hover:bg-gray-800 focus:bg-gray-800"
            : "text-gray-300 hover:bg-gray-800 hover:text-white focus:bg-gray-800"
        }`}
    >
      <span
        className={`inline-flex h-10 w-10 items-center justify-center rounded-lg 
          ${
            isLogout
              ? "bg-gray-800 text-red-400"
              : "bg-gray-800 text-gray-400"
          }`}
      >
        {icon}
      </span>
      <span>{label}</span>
    </button>
  );
}

export default CustomerHome;
