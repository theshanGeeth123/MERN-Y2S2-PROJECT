import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar2 from "../components/Navbar2";

function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const [error, setError] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const res = await axios.post("http://localhost:4000/api/admin/login", {
        email,
        password,
      });

      if (res.status === 200) {
        navigate("/admin/home");
      } else {
        setError("Invalid credentials");
      }
    } catch (err) {
      setError("Login failed. Check your credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <Navbar2 />
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-100 2xl:mx-30 xl:mx-20 mb-20">
        <div className="relative w-full max-w-md">
          {/* Keep your existing decorative background exactly the same */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-400 to-indigo-500 rounded-2xl blur-xl opacity-25"></div>

          {/* Dark/black themed card */}
          <div className="relative bg-neutral-900/95 backdrop-blur-md p-8 rounded-2xl shadow-2xl border border-neutral-800">
            {/* Header */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-600 rounded-2xl shadow-lg mb-4">
                {/* Lock icon */}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-8 w-8 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  aria-hidden="true"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h2 className="text-3xl font-semibold text-white tracking-tight">
                Admin Portal
              </h2>
              <p className="text-neutral-400 mt-2">
                Sign in to your administrator account
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-6">
              {/* Email */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-neutral-200">
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
                      aria-hidden="true"
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
                    className="w-full pl-10 pr-4 py-3 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="admin@example.com"
                    autoComplete="username"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-neutral-200">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    {/* Shield/lock icon */}
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-neutral-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      aria-hidden="true"
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
                    className="w-full pl-10 pr-12 py-3 rounded-lg bg-neutral-800 text-neutral-100 placeholder-neutral-500 border border-neutral-700 focus:outline-none focus:ring-2 focus:ring-blue-300 focus:border-blue-300 transition"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="••••••••"
                    autoComplete="current-password"
                  />

                  {/* Show/Hide password button */}
                  <button
                    type="button"
                    onClick={() => setShowPwd((s) => !s)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-neutral-400 hover:text-neutral-200 transition"
                    aria-label={showPwd ? "Hide password" : "Show password"}
                  >
                    {showPwd ? (
                      // Eye-off icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M17.94 17.94A10.94 10.94 0 0112 20c-5 0-9.27-3.11-11-8a11.81 11.81 0 013.06-4.5m3.2-2.12A10.94 10.94 0 0112 4c5 0 9.27 3.11 11 8a11.82 11.82 0 01-2.17 3.19M1 1l22 22" />
                        <path d="M9.88 9.88A3 3 0 0012 15a3 3 0 002.12-.88" />
                      </svg>
                    ) : (
                      // Eye icon
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 24 24"
                        fill="none"
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
                <div className="rounded-lg bg-red-900/30 border border-red-800 p-4 flex items-start space-x-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 text-red-400 mt-0.5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <p className="text-red-300 text-sm">{error}</p>
                </div>
              )}

              <button
                type="button"
                onClick={() => {
                  setEmail("demo@gmail.com");
                  setPassword("demo1234");
                }}
                className="w-full py-3 px-4 rounded-lg text-white font-medium shadow-md bg-blue-600 hover:bg-blue-700 transition active:scale-[0.99]"
              >
                Demo Login
              </button>
              {/* Submit */}
              <button
                type="submit"
                disabled={isLoading}
                className={`w-full py-3 px-4 rounded-lg text-black cursor-pointer font-medium shadow-md transition disabled:opacity-60 disabled:cursor-not-allowed
                bg-gray-100 active:scale-[0.99]`}
              >
                {isLoading ? (
                  <div className="flex items-center justify-center gap-2">
                    <svg
                      className="animate-spin h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      aria-hidden="true"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Signing in...
                  </div>
                ) : (
                  "Sign In"
                )}
              </button>
            </form>

            {/* Staff Login Link */}
            <div className="mt-6 text-center">
              <p className="text-sm text-neutral-400">
                Are you a staff member?
                <button
                  onClick={() => navigate("/staff/login")}
                  className="ml-1 text-blue-400 hover:text-blue-300 font-medium underline-offset-2 hover:underline"
                >
                  Login here
                </button>
              </p>
            </div>

            <div className="mt-6 text-center">
              <p className="text-[11px] text-neutral-500">
                © {new Date().getFullYear()} Admin Portal. Secure access only.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLogin;
