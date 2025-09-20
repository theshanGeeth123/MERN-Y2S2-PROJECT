// src/admin/AdminHome.jsx
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBox,
  FaClipboardList,
  FaUsers,
  FaBell,
  FaChartLine,
  FaUserTie,
  FaPlus,
  FaBars,
  FaTimes,
  FaMoon,
  FaSun,
  FaBoxes,
  FaSignOutAlt,
  FaCalendarCheck,
  FaCommentDots,
  FaQuestionCircle,
} from "react-icons/fa";
import { toast } from "react-toastify";

export default function AdminHome() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dark, setDark] = useState(() =>
    typeof window !== "undefined" && window.matchMedia
      ? window.matchMedia("(prefers-color-scheme: dark)").matches
      : false
  );

  const stats = [
    { title: "Pending Tasks", value: 12, change: "-2%" },
    { title: "Appointments", value: 8, change: "+3%" },
    { title: "Reports", value: 5, change: "No change" },
    { title: "Messages", value: 3, change: "+1%" },
  ];

  const changeStyle = (c) => {
    if (!c) return "text-gray-500 dark:text-gray-400";
    if (c.toLowerCase().includes("no change"))
      return "text-gray-500 dark:text-gray-400";
    if (c.startsWith("-")) return "text-red-600 dark:text-red-400";
    if (c.startsWith("+")) return "text-emerald-600 dark:text-emerald-400";
    return "text-gray-600 dark:text-gray-400";
  };

  const NavItem = ({ icon, label, to, onClick }) => (
    <button
      type="button"
      onClick={() => {
        setMobileOpen(false);
        if (typeof onClick === "function") onClick();
        else if (to) navigate(to);
      }}
      className="py-4 cursor-pointer w-full flex items-center gap-3 p-3 rounded-lg text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-white/10 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
    >
      <span className="text-lg shrink-0">{icon}</span>
      <span className="text-[16px] font-medium">{label}</span>
    </button>
  );

  // lock body scroll when mobile drawer open
  useEffect(() => {
    const { style } = document.body;
    style.overflow = mobileOpen ? "hidden" : "";
    return () => (style.overflow = "");
  }, [mobileOpen]);

  // esc to close
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && setMobileOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // apply dark class
  useEffect(() => {
    const root = document.documentElement;
    dark ? root.classList.add("dark") : root.classList.remove("dark");
  }, [dark]);

  const closeBtnRef = useRef(null);
  useEffect(() => {
    if (mobileOpen) closeBtnRef.current?.focus();
  }, [mobileOpen]);

  const handleLogout = () => {
    const ok = window.confirm("Are you sure you want to log out?");
    if (!ok) return;

    try {
      localStorage.removeItem("token");
      sessionStorage.clear();

      navigate("/main-home", { replace: true });

      window.history.pushState(null, "", window.location.href);
      window.addEventListener("popstate", function () {
        navigate("/main-home", { replace: true });
      });

      toast.success("You have been logged out.");
    } catch (err) {
      toast.error("Something went wrong while logging out.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-300">
      {/* MOBILE TOP BAR ONLY */}
      <header className="fixed inset-x-0 top-0 z-40 border-b md:hidden bg-white/70 dark:bg-gray-900/80 backdrop-blur">
        <div className="mx-auto max-w-screen-2xl px-4 h-14 flex items-center justify-between">
          <button
            type="button"
            aria-label="Open menu"
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"
            onClick={() => setMobileOpen(true)}
          >
            <FaBars />
          </button>
          <h1 className="text-base font-semibold text-gray-900 dark:text-gray-100">
            Admin Portal
          </h1>
        </div>
      </header>

      {/* MAIN GRID: sidebar + content */}
      <div className="grid min-h-screen md:grid-cols-[18rem_1fr] pt-14 md:pt-0">
        {/* SIDEBAR (desktop) */}
        <aside className="hidden md:flex md:flex-col bg-white/90 dark:bg-gray-950 border-r dark:border-gray-800 overflow-y-auto">
          <div className="sticky top-0 z-30 bg-inherit">
            <div className="h-16 px-6 flex items-center justify-between border-b dark:border-gray-800">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-lg text-gray-900 dark:text-gray-100">
                  Admin Portal
                </span>
              </div>
            </div>
          </div>

          <nav className="flex-1 py-8 px-3 space-y-4">
            <NavItem icon={<FaBox />} label="Manage Products" to="/admin/products" />
            <NavItem icon={<FaClipboardList />} label="Orders" to="/admin/orders" />
            <NavItem icon={<FaUserTie />} label="Staff Members" to="/admin/staff" />
            <NavItem icon={<FaBell />} label="Notifications" to="/admin/notifications" />
            <NavItem icon={<FaUsers />} label="Customer Details" to="/customerManagement" />
            <NavItem icon={<FaBoxes />} label="Packages" to="/admin/packages" />
            <NavItem icon={<FaCalendarCheck />} label="Bookings" to="/admin/bookings" />
            <NavItem icon={<FaCommentDots />} label="Feedbacks" to="/admin/admin-feedback" />
            <NavItem icon={<FaQuestionCircle />} label="Q&A" to="/admin/admin-question" />
            <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
          </nav>

          <div className="p-4 border-t dark:border-gray-800 text-xs text-gray-500 dark:text-gray-400">
            © {new Date().getFullYear()} JW-Stduio
          </div>
        </aside>

        {/* MOBILE DRAWER */}
        <div
          className={`fixed inset-0 z-50 md:hidden ${mobileOpen ? "block" : "hidden"}`}
          aria-hidden={!mobileOpen}
        >
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setMobileOpen(false)}
          />
          <div
            role="dialog"
            aria-modal="true"
            // h-dvh handles mobile browser chrome; flex/overflow make list scrollable
            className={`absolute left-0 top-0 h-dvh w-72 bg-white dark:bg-gray-950 shadow-xl transform transition-transform
              ${mobileOpen ? "translate-x-0" : "-translate-x-full"} flex flex-col
              pt-[env(safe-area-inset-top)] pb-[env(safe-area-inset-bottom)]`}
          >
            <div className="h-14 px-4 border-b dark:border-gray-800 flex items-center justify-between">
              <span className="font-semibold text-gray-900 dark:text-gray-100">
                Admin Portal
              </span>
              <button
                type="button"
                aria-label="Close menu"
                className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-white/10 text-gray-700 dark:text-gray-200"
                onClick={() => setMobileOpen(false)}
                ref={closeBtnRef}
              >
                <FaTimes />
              </button>
            </div>

            {/* SCROLLABLE NAV AREA */}
            <nav className="flex-1 overflow-y-auto overscroll-contain p-4 space-y-1 pr-3">
              <NavItem icon={<FaBox />} label="Manage Products" to="/admin/products" />
              <NavItem icon={<FaClipboardList />} label="Orders" to="/admin/orders" />
              <NavItem icon={<FaUserTie />} label="Staff Members" to="/admin/staff" />
              <NavItem icon={<FaBell />} label="Notifications" to="/admin/notifications" />
              <NavItem icon={<FaUsers />} label="Customer Details" to="/customerManagement" />
              <NavItem icon={<FaBoxes />} label="Packages" to="/admin/packages" />
              <NavItem icon={<FaCalendarCheck />} label="Bookings" to="/admin/bookings" />
              <NavItem icon={<FaCommentDots />} label="Feedbacks" to="/admin/admin-feedback" />
              <NavItem icon={<FaQuestionCircle />} label="Q&A" to="/admin/admin-question" />
              <NavItem icon={<FaSignOutAlt />} label="Logout" onClick={handleLogout} />
            </nav>
          </div>
        </div>

        {/* CONTENT */}
        <main className="w-full">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
            {/* Header */}
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-black">Welcome back, Admin!</h2>
              <p className="text-gray-600">Here’s what’s happening with your account today.</p>
            </div>

            {/* Quick actions */}
            <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
              {[
                { icon: <FaPlus />, label: "Add", to: "/admin/add-product" },
                { icon: <FaBox />, label: "Products", to: "/admin/products" },
                { icon: <FaClipboardList />, label: "Orders", to: "/admin/orders" },
                { icon: <FaUserTie />, label: "Staff", to: "/admin/staff" },
                { icon: <FaUsers />, label: "Customers", to: "/customerManagement" },
                { icon: <FaChartLine />, label: "Reports", to: "/admin/reports" },
              ].map((a, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => navigate(a.to)}
                  className="group rounded-xl border dark:border-gray-800 bg-white/80 dark:bg-gray-900/60 hover:bg-white dark:hover:bg-gray-900 shadow-sm p-3 flex items-center gap-3 transition focus:outline-none focus:ring-2 focus:ring-primary/40"
                >
                  <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-700 dark:text-gray-200">
                    {a.icon}
                  </span>
                  <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
                    {a.label}
                  </span>
                </button>
              ))}
            </section>

            {/* Stats */}
            <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
              {stats.map((s, idx) => (
                <div
                  key={idx}
                  className="relative overflow-hidden rounded-2xl border dark:border-gray-800 bg-white/80 dark:bg-gray-900 shadow-sm p-5"
                >
                  <div
                    className={[
                      "absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20",
                      ["bg-purple-400", "bg-indigo-400", "bg-emerald-400", "bg-amber-400"][idx % 4],
                    ].join(" ")}
                    aria-hidden="true"
                  />
                  <div className="relative flex items-center justify-between">
                    <div className="min-w-0">
                      <p className="text-sm text-gray-500 dark:text-gray-400 truncate">{s.title}</p>
                      <div className="mt-1 flex items-baseline gap-2">
                        <span className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                          {s.value}
                        </span>
                        <span className={`text-xs ${changeStyle(s.change)}`}>{s.change}</span>
                      </div>
                    </div>
                    <div
                      className={[
                        "inline-flex h-10 w-10 items-center justify-center rounded-full",
                        [
                          "bg-purple-100 text-purple-700 dark:bg-purple-500/15 dark:text-purple-300",
                          "bg-indigo-100 text-indigo-700 dark:bg-indigo-500/15 dark:text-indigo-300",
                          "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300",
                          "bg-amber-100 text-amber-700 dark:bg-amber-500/15 dark:text-amber-300",
                        ][idx % 4],
                      ].join(" ")}
                    >
                      {idx === 0 && <FaClipboardList />}
                      {idx === 1 && <FaUsers />}
                      {idx === 2 && <FaChartLine />}
                      {idx === 3 && <FaBell />}
                    </div>
                  </div>
                </div>
              ))}
            </section>

            {/* Placeholder for charts/tables */}
            <section className="rounded-2xl border dark:border-gray-800 bg-white/80 dark:bg-gray-900 shadow-sm h-64 sm:h-72 lg:h-80 flex items-center justify-center">
              <div className="text-center">
                <div className="text-sm text-gray-500 dark:text-gray-400">
                  Your analytics will appear here.
                </div>
                <div className="mt-2 text-xs text-gray-400 dark:text-gray-500">
                  Hook up your API data or charts when ready.
                </div>
              </div>
            </section>
          </div>
        </main>
      </div>
    </div>
  );
}
