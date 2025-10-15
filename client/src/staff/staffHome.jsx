// src/pages/staff/StaffHome.jsx
import React, { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "./StaffAuthContext";
import {
  FaPlus,
  FaBox,
  FaClipboardList,
  FaUserTie,
  FaUsers,
  FaChartLine,
  FaBell,
} from "react-icons/fa";

/* ----------------------------- Helper UI bits ----------------------------- */

const Card = ({ children, className = "" }) => (
  <div
    className={
      "relative overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm p-5 " +
      className
    }
  >
    {children}
  </div>
);

const SectionTitle = ({ title, subtitle }) => (
  <div className="mb-6">
    <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
    {subtitle && <p className="text-gray-600">{subtitle}</p>}
  </div>
);

const changeStyle = (n) =>
  n > 0
    ? "text-emerald-600"
    : n < 0
    ? "text-rose-600"
    : "text-gray-500";

const changeLabel = (n) => (n > 0 ? `+${n}` : n < 0 ? `${n}` : `${n}`);

/* ------------------------- Placeholder chart widgets ------------------------ */

const Bar = ({ label, value, total }) => {
  const width = Math.max(2, Math.round((value / (total || 1)) * 100));
  return (
    <div className="mb-3">
      <div className="flex justify-between text-xs text-gray-600 mb-1">
        <span className="truncate pr-2">{label}</span>
        <span className="font-medium text-gray-800">{value}</span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className="h-full bg-indigo-500 rounded-full"
          style={{ width: `${Math.min(width, 100)}%` }}
        />
      </div>
    </div>
  );
};

const CustomerGrowthChart = ({ data = [] }) => {
  const max = useMemo(
    () => data.reduce((m, d) => Math.max(m, d.value), 0),
    [data]
  );
  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-4">Customer Growth</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No data</p>
      ) : (
        data.map((d, i) => (
          <Bar key={i} label={d.label} value={d.value} total={max} />
        ))
      )}
    </Card>
  );
};

const OrderStatusChart = ({ data = [] }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-4">Order Status</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No data</p>
      ) : (
        data.map((d, i) => (
          <Bar key={i} label={d.label} value={d.value} total={total} />
        ))
      )}
    </Card>
  );
};

const BookingStatusChart = ({ data = [] }) => {
  const total = data.reduce((s, d) => s + d.value, 0);
  return (
    <Card>
      <h3 className="font-semibold text-gray-900 mb-4">Booking Status</h3>
      {data.length === 0 ? (
        <p className="text-sm text-gray-500">No data</p>
      ) : (
        data.map((d, i) => (
          <Bar key={i} label={d.label} value={d.value} total={total} />
        ))
      )}
    </Card>
  );
};

/* -------------------------------- Component -------------------------------- */

const StaffHome = () => {
  const navigate = useNavigate();
  const { logoutStaff, staff } = useStaffAuth();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    logoutStaff();
    navigate("/staff/login");
  };

  // Stats cards content (safe defaults)
  const statsData = [
    { title: "Pending Tasks", value: 12, change: -2 },
    { title: "Appointments", value: 8, change: +3 },
    { title: "Reports", value: 5, change: 0 },
    { title: "Messages", value: 3, change: +1 },
  ];

  // Demo datasets for placeholder charts
  const growthData = [
    { label: "Jan", value: 12 },
    { label: "Feb", value: 20 },
    { label: "Mar", value: 17 },
    { label: "Apr", value: 26 },
    { label: "May", value: 24 },
  ];

  const orderStatusData = [
    { label: "Completed", value: 34 },
    { label: "Pending", value: 9 },
    { label: "Cancelled", value: 3 },
  ];

  const bookingStatusData = [
    { label: "Confirmed", value: 18 },
    { label: "Rescheduled", value: 4 },
    { label: "No-Show", value: 1 },
  ];

  const initials =
    (staff?.firstName?.[0] || staff?.name?.[0] || "S").toUpperCase();

  const role = staff?.role || "staff";

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static`}
      >
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Staff Portal</h2>
          <button
            className="md:hidden text-gray-400 hover:text-white text-xl"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {initials}
            </div>
            <div className="ml-4">
              <h3 className="text-white font-medium">
                {staff?.firstName || staff?.name || "Staff Member"}
              </h3>
              <p className="text-gray-400 text-sm">
                {role.charAt(0).toUpperCase() + role.slice(1)}
              </p>
            </div>
          </div>
        </div>

        <nav className="px-4 py-6 space-y-1">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 ${
              activeTab === "dashboard" ? "bg-gray-800 text-white" : ""
            }`}
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              ></path>
            </svg>
            Dashboard
          </button>

          <button
            onClick={() => {
              navigate("/staff/profile");
              setSidebarOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
              ></path>
            </svg>
            Profile
          </button>

          {role === "photographer" && (
            <button
              onClick={() => {
                navigate("/staff/packages");
                setSidebarOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Packages
            </button>
          )}

          {role === "manager" && (
            <button
              onClick={() => {
                navigate("/staff/customerManage");
                setSidebarOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                ></path>
              </svg>
              Customer Details
            </button>
          )}

          {role === "manager" && (
            <button
              onClick={() => {
                navigate("/staff/notifications");
                setSidebarOpen(false);
              }}
              className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
            >
              <svg
                className="w-5 h-5 mr-3"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3c0 .386-.145.735-.395 1.005L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
                />
              </svg>
              Notifications
            </button>
          )}

          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-red-400 hover:bg-red-900 hover:text-white transition-colors duration-200"
          >
            <svg
              className="w-5 h-5 mr-3"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
              ></path>
            </svg>
            Logout
          </button>
        </nav>
      </aside>

      {/* Main */}
      <main className="flex-1 w-full">
        {/* Top bar */}
        <div className="sticky top-0 z-10 bg-white border-b border-gray-200">
          <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 h-14 flex items-center justify-between">
            <button
              className="md:hidden inline-flex items-center justify-center rounded-lg border border-gray-300 px-3 py-2 text-gray-700"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open sidebar"
            >
              ☰
            </button>
            <div className="text-sm text-gray-500">
              {new Date().toLocaleString()}
            </div>
          </div>
        </div>

        <div className="mx-auto max-w-screen-2xl px-4 sm:px-6 lg:px-8 py-6 md:py-8">
          <SectionTitle
            title={`Welcome back, ${staff?.firstName || "Admin"}!`}
            subtitle="Here’s what’s happening with your account today."
          />

          {/* Quick actions */}
          <section className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 mb-6">
            {[
              // { icon: <FaPlus />, label: "Add", to: "/admin/add-product" },
              // { icon: <FaBox />, label: "Products", to: "/admin/products" },
              // { icon: <FaClipboardList />, label: "Orders", to: "/admin/orders" },
              // { icon: <FaUserTie />, label: "Staff", to: "/admin/staff" },
              // { icon: <FaUsers />, label: "Customers", to: "/customerManagement" },
              // { icon: <FaChartLine />, label: "Reports", to: "/admin/reports" },
            ].map((a, i) => (
              <button
                key={i}
                type="button"
                onClick={() => navigate(a.to)}
                className="group rounded-xl border border-gray-200 bg-white hover:bg-gray-50 shadow-sm p-3 flex items-center gap-3 transition focus:outline-none focus:ring-2 focus:ring-indigo-400/40"
              >
                <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-700">
                  {a.icon}
                </span>
                <span className="text-sm font-medium text-gray-800">
                  {a.label}
                </span>
              </button>
            ))}
          </section>

          {/* Stats */}
          <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-8">
            {statsData.map((s, idx) => (
              <Card key={idx}>
                <div
                  className={[
                    "absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20",
                    ["bg-purple-400", "bg-indigo-400", "bg-emerald-400", "bg-amber-400"][idx % 4],
                  ].join(" ")}
                  aria-hidden="true"
                />
                <div className="relative flex items-center justify-between">
                  <div className="min-w-0">
                    <p className="text-sm text-gray-500 truncate">{s.title}</p>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-2xl font-semibold text-gray-900">
                        {s.value}
                      </span>
                      <span className={`text-xs font-medium ${changeStyle(s.change)}`}>
                        {s.change > 0 ? "▲" : s.change < 0 ? "▼" : "•"} {changeLabel(s.change)}
                      </span>
                    </div>
                  </div>
                  <div
                    className={[
                      "inline-flex h-10 w-10 items-center justify-center rounded-full",
                      [
                        "bg-purple-100 text-purple-700",
                        "bg-indigo-100 text-indigo-700",
                        "bg-emerald-100 text-emerald-700",
                        "bg-amber-100 text-amber-700",
                      ][idx % 4],
                    ].join(" ")}
                  >
                    {idx === 0 && <FaClipboardList />}
                    {idx === 1 && <FaUsers />}
                    {idx === 2 && <FaChartLine />}
                    {idx === 3 && <FaBell />}
                  </div>
                </div>
              </Card>
            ))}
          </section>

          {/* Charts */}
          <CustomerGrowthChart data={growthData} />
          <div className="mt-4 flex flex-col md:flex-row gap-4">
            <div className="w-full md:w-1/2">
              <OrderStatusChart data={orderStatusData} />
            </div>
            <div className="w-full md:w-1/2">
              <BookingStatusChart data={bookingStatusData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default StaffHome;
