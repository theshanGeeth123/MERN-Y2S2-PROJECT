import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useStaffAuth } from "./StaffAuthContext";

const StaffLogin = () => {
  const { loginStaff, error, setError } = useStaffAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white w-full max-w-md p-6 rounded-xl shadow">
        <h1 className="text-xl font-semibold text-center mb-4">Staff Login</h1>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Email</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Password</label>
            <input
              className="w-full border rounded px-3 py-2"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {error && <p className="text-sm text-red-600">{error}</p>}

          <button
            disabled={submitting}
            className="w-full bg-neutral-900 text-white py-2 rounded hover:bg-neutral-800 transition"
          >
            {submitting ? "Signing in…" : "Login"}
          </button>
        </form>

        <p className="text-center text-xs text-gray-500 mt-4">
          Admin?{" "}
          <Link to="/admin/login" className="text-blue-600 hover:text-blue-800">
            Login here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default StaffLogin;
