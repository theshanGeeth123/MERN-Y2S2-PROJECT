import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStaffAuth } from "./StaffAuthContext";

import Navbar2 from "../components/Navbar2";

const StaffLogin = () => {
  const { loginStaff, error, setError } = useStaffAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");

    try {
      await loginStaff({ email, password });
      navigate("/staff/home");
    } catch (err) {
      setError(err.message || "Login failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (

    <><Navbar2/>

    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4 2xl:mx-30 xl:mx-20">
      <div className="relative w-full max-w-md">
        {/* Glow border background */}
        <div className="absolute -inset-4 rounded-2xl blur-xl opacity-25"></div>

        {/* Dark card */}
        <div className="relative bg-neutral-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-neutral-800">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-14 h-14 bg-gray-600 rounded-xl shadow-lg mb-4">
              {/* User icon */}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-7 w-7 text-white"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5.121 17.804A8 8 0 1112 20a7.978 7.978 0 01-6.879-2.196zM15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              Staff Login
            </h1>
            <p className="text-neutral-400 mt-1 text-sm">
              Sign in to your staff account
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Mail icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoFocus
                  className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300  transition"
                  placeholder="staff@example.com"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-neutral-200 mb-1">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  {/* Lock icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-neutral-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                    />
                  </svg>
                </div>
                <input
                  type={showPwd ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-3 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:ring-2  focus:ring-blue-300 focus:border-blue-300  transition"
                  placeholder="••••••••"
                />

                {/* Toggle password */}
                <button
                  type="button"
                  onClick={() => setShowPwd((s) => !s)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200 transition"
                >
                  {showPwd ? (
                    // Eye-off
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3.11-11-8a11.81 11.81 0 013.06-4.5m3.2-2.12A10.94 10.94 0 0112 4c5 0 9.27 3.11 11 8a11.82 11.82 0 01-2.17 3.19M1 1l22 22" />
                      <path d="M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88" />
                    </svg>
                  ) : (
                    // Eye
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <p className="text-sm text-red-400 bg-red-900/30 border border-red-800 p-2 rounded">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              disabled={submitting}
              className="w-full py-3 px-4 rounded-lg text-black font-medium shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed
                bg-gray-200  active:scale-[0.99]"
            >
              {submitting ? "Signing in…" : "Login"}
            </button>
          </form>

          <p className="text-center text-sm text-neutral-400 mt-6">
            Admin?{" "}
            <Link
              to="/admin/login"
              className="text-indigo-400 hover:text-indigo-300 font-medium hover:underline underline-offset-2"
            >
              Login here
            </Link>
          </p>
        </div>
      </div>
    </div>
    </>
  );
};

export default StaffLogin;
