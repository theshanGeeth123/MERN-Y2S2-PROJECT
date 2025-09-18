import React, { useContext, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar2 from "../components/Navbar2";
import { FiMail, FiLock } from "react-icons/fi";

function ResetPassword() {
  const { backendUrl } = useContext(AppContent);
  axios.defaults.withCredentials = true;

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isEmailSent, setIsEmailSent] = useState(false); // was "" (string) → boolean
  const [otp, setOtp] = useState(""); // store as string for consistency
  const [isOtpSubmitted, setIsOtpSubmitted] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  const inputRefs = useRef([]);

  const handleInput = (e, index) => {
    const v = e.target.value.replace(/\D/g, ""); // keep only digits
    e.target.value = v;

    if (v && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select?.();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !e.target.value && index > 0) {
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1].value = "";
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < inputRefs.current.length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const paste = (e.clipboardData.getData("text") || "")
      .replace(/\D/g, "")
      .slice(0, 6);
    paste.split("").forEach((char, i) => {
      if (inputRefs.current[i]) inputRefs.current[i].value = char;
    });
  };

  const onSubmitEmail = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/send-reset-otp",
        { email }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      if (data.success) setIsEmailSent(true);
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const onSubmitOTP = async (e) => {
    e.preventDefault();
    const otpArray = inputRefs.current.map((el) => el?.value || "");
    const joined = otpArray.join("");
    if (joined.length !== 6) {
      toast.error("Please enter the 6-digit code.");
      return;
    }
    setOtp(joined);
    setIsOtpSubmitted(true);
  };

  const onSubmitNewPassword = async (e) => {
    e.preventDefault();

    if (!isStrongPassword(newPassword)) {
      toast.error(
        "Password must be at least 6 characters, include at least 1 uppercase letter and 1 special character."
      );
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error("Password and Confirm Password do not match.");
      return;
    }

    try {
      const { data } = await axios.post(
        "http://localhost:4000/api/auth/reset-password",
        { email, otp, newPassword }
      );
      data.success ? toast.success(data.message) : toast.error(data.message);
      data.success ? navigate("/login") : navigate("/");
    } catch (error) {
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Something went wrong"
      );
    }
  };

  const isStrongPassword = (pw) => {
    // ≥6 chars, at least 1 uppercase, at least 1 special character
    return /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/.test(pw);
  };

  return (
    <>
      <Navbar2 />

      <div className="mt-25  flex items-center justify-center px-6 sm:px-0">
        {/* Step 1: enter email */}
        {!isEmailSent && (
          <form
            onSubmit={onSubmitEmail}
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your registered email address.
            </p>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <FiMail className="text-indigo-300" />
              <input
                type="email"
                placeholder="Email id"
                className="bg-transparent outline-none text-white w-full"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3"
            >
              Submit
            </button>
          </form>
        )}

        {/* Step 2: OTP input */}
        {!isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitOTP}
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              Reset password OTP
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter the 6-digit code sent to your email.
            </p>

            <div className="flex justify-between mb-8" onPaste={handlePaste}>
              {Array(6)
                .fill(0)
                .map((_, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="\d*"
                    maxLength={1}
                    required
                    ref={(el) => (inputRefs.current[index] = el)}
                    onInput={(e) => handleInput(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    className="w-12 h-12 bg-[#333A5C] text-white text-lg rounded-md text-center outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                ))}
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-3 bg-gradient-to-r from-indigo-500 to-indigo-900 rounded-full text-white"
            >
              Submit
            </button>
          </form>
        )}

        {/* Step 3: enter new password */}
        {isOtpSubmitted && isEmailSent && (
          <form
            onSubmit={onSubmitNewPassword}
            className="bg-slate-900 p-8 rounded-lg shadow-lg w-full max-w-md text-sm"
          >
            <h1 className="text-white text-2xl font-semibold text-center mb-4">
              New Password
            </h1>
            <p className="text-center mb-6 text-indigo-300">
              Enter your new password below.
            </p>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <FiLock className="text-indigo-300" />
              <input
                type="password"
                placeholder="Password"
                className="bg-transparent outline-none text-white w-full"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <div className="mb-4 flex items-center gap-3 w-full px-5 py-2.5 rounded-full bg-[#333A5C]">
              <FiLock className="text-indigo-300" />
              <input
                type="password"
                placeholder="Confirm Password"
                className="bg-transparent outline-none text-white w-full"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                autoComplete="new-password"
              />
            </div>

            <button
              type="submit"
              className="cursor-pointer w-full py-2.5 bg-gradient-to-r from-indigo-500 to-indigo-900 text-white rounded-full mt-3"
            >
              Submit
            </button>
          </form>
        )}
      </div>
    </>
  );
}

export default ResetPassword;
