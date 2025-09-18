import React, { createContext, useContext, useEffect, useState } from "react";
import axios from "axios";

const StaffAuthContext = createContext(null);

export const StaffAuthProvider = ({ children }) => {
  const [staff, setStaff] = useState(null);     // the logged-in staff profile
  const [loading, setLoading] = useState(true); // initial restore
  const [error, setError] = useState("");

  // Restore from localStorage on refresh
  useEffect(() => {
    const raw = localStorage.getItem("staffProfile");
    if (raw) {
      try {
        setStaff(JSON.parse(raw));
      } catch {}
    }
    setLoading(false);
  }, []);

  const loginStaff = async ({ email, password }) => {
    setError("");
    // 1) hit your existing staff login endpoint (no JWT needed per your ask)
    //    Adjust if your login endpoint differs.
    const res = await axios.post("http://localhost:4000/api/staff/login", {
      email,
      password,
    });

    if (res.status !== 200 || !res.data?.success) {
      throw new Error(res.data?.message || "Invalid credentials");
    }

    // 2) fetch full staff profile by email and store it
    const prof = await axios.post("http://localhost:4000/api/staff/profile-by-email", { email });
    if (!prof.data?.success) {
      throw new Error("Failed to load staff profile");
    }

    const profile = prof.data.data;
    setStaff(profile);
    localStorage.setItem("staffProfile", JSON.stringify(profile));
    return profile;
  };

  const logoutStaff = () => {
    setStaff(null);
    localStorage.removeItem("staffProfile");
  };

  return (
    <StaffAuthContext.Provider
      value={{
        staff,
        loading,
        error,
        loginStaff,
        logoutStaff,
        setError,
      }}
    >
      {children}
    </StaffAuthContext.Provider>
  );
};

export const useStaffAuth = () => useContext(StaffAuthContext);
