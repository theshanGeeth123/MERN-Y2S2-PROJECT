import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { AppContent } from "../context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import Navbar2 from "../components/Navbar2";
import {
  FiUser,
  FiMail,
  FiLock,
  FiCalendar,
  FiPhone,
  FiMapPin,
  FiEye,
  FiEyeOff,
} from "react-icons/fi";

function Login() {
  const navigate = useNavigate();
  const { backendUrl, setIsLoggedin, getUserData } = useContext(AppContent);

  const [state, setState] = useState("Login"); // "Login" | "Sign Up"

  // form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [age, setAge] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  // UI
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // inline error state
  const [errors, setErrors] = useState({});

  // Helpers (JS-only validations)
  const isStrongPassword = (pw) => /^(?=.*[A-Z])(?=.*[^A-Za-z0-9]).{6,}$/.test(pw);
  const isValidName = (n) => n.trim().length >= 5;
  const isAdult = (a) => Number(a) >= 18;
  const isValidPhone = (p) => /^\d{10}$/.test(p);
  const isValidEmail = (em) =>
    // simple, practical email check (client-side)
    /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(em);

  // Reset errors when swapping modes
  useEffect(() => {
    setErrors({});
  }, [state]);

  // Live cleanup: remove a field's error when user edits it
  const clearError = (key) =>
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const copy = { ...prev };
      delete copy[key];
      return copy;
    });

  const validateSignUp = () => {
    const newErrors = {};

    // Required checks (JS, even though inputs have required)
    if (!name.trim()) newErrors.name = "Full name is required.";
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (!confirmPassword) newErrors.confirmPassword = "Confirm your password.";
    if (!age && age !== 0) newErrors.age = "Age is required.";
    if (!phone.trim()) newErrors.phone = "Phone number is required.";
    if (!address.trim()) newErrors.address = "Address is required.";

    // Business rules
    if (name && !isValidName(name)) newErrors.name = "Full name must be at least 5 characters.";
    if (email && !isValidEmail(email)) newErrors.email = "Enter a valid email address.";
    if (age && !isAdult(age)) newErrors.age = "You must be 18 or older.";
    if (phone && !isValidPhone(phone)) newErrors.phone = "Phone number must be exactly 10 digits.";
    if (password && !isStrongPassword(password))
      newErrors.password =
        "Password must be ≥ 6 chars, with at least 1 uppercase and 1 special character.";
    if (password && confirmPassword && password !== confirmPassword)
      newErrors.confirmPassword = "Passwords do not match.";

    return newErrors;
  };

  const validateLogin = () => {
    const newErrors = {};
    if (!email.trim()) newErrors.email = "Email is required.";
    if (!password) newErrors.password = "Password is required.";
    if (email && !isValidEmail(email)) newErrors.email = "Enter a valid email address.";
    return newErrors;
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();
    axios.defaults.withCredentials = true;

    // Validate in JS only
    const newErrors = state === "Sign Up" ? validateSignUp() : validateLogin();
    setErrors(newErrors);

    if (Object.keys(newErrors).length > 0) {
      // stop submit if any errors
      return;
    }

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(
          (backendUrl || "http://localhost:4000") + "/api/auth/register",
          { name, email, password, age, phone, address }
        );

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          localStorage.setItem("customer", JSON.stringify({ email }));
          navigate("/");
        } else {
          toast.error(data.message || "Registration failed");
        }
      } else {
        const { data } = await axios.post(
          (backendUrl || "http://localhost:4000") + "/api/auth/login",
          { email, password }
        );

        if (data.success) {
          setIsLoggedin(true);
          getUserData();
          localStorage.setItem("customer", JSON.stringify({ email }));
          navigate("/");
        } else {
          toast.error(data.message || "Login failed");
        }
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || error.message || "An error occurred");
    }
  };

  // Utility for red border on error
  const fieldWrap = (hasError) =>
    `flex mb-2 items-center gap-3 w-full px-5 py-2.5 rounded-full ${
      hasError ? "border border-red-500" : "bg-[#333A5C]"
    }`;

  return (
    <div className="min-h-screen flex flex-col ">
      <Navbar2 />

      <div className="flex flex-1 items-center justify-center px-6 sm:px-0 ">
        <div className="bg-slate-900 p-10 rounded-lg shadow-lg w-full sm:w-96 text-indigo-300 text-sm lg:min-w-[450px] mb-20">
          <h2 className="text-3xl font-semibold text-white text-center mb-3">
            {state === "Sign Up" ? "Create account" : "Login"}
          </h2>
          <p className="text-center text-sm mb-6">
            {state === "Sign Up" ? "Create your account" : "Login to your account"}
          </p>

          {/* Disable native validation, rely on JS only; keep required attributes for semantics */}
          <form onSubmit={onSubmitHandler} noValidate className="text-sm mb-6">
            {state === "Sign Up" && (
              <>
                <div className={fieldWrap(!!errors.name)}>
                  <FiUser className="text-indigo-400" />
                  <input
                    className="bg-transparent outline-none w-full"
                    type="text"
                    placeholder="Full Name"
                    required
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                      clearError("name");
                    }}
                    aria-invalid={!!errors.name}
                    aria-describedby="name-error"
                  />
                </div>
                {errors.name && (
                  <p id="name-error" className="text-red-500 text-xs -mt-1 mb-2">
                    {errors.name}
                  </p>
                )}
              </>
            )}

            <div className={fieldWrap(!!errors.email)}>
              <FiMail className="text-indigo-400" />
              <input
                className="bg-transparent outline-none w-full"
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearError("email");
                }}
                autoComplete="email"
                aria-invalid={!!errors.email}
                aria-describedby="email-error"
              />
            </div>
            {errors.email && (
              <p id="email-error" className="text-red-500 text-xs -mt-1 mb-2">
                {errors.email}
              </p>
            )}

            {/* Password */}
            <div className={fieldWrap(!!errors.password)}>
              <FiLock className="text-indigo-400" />
              <input
                className="bg-transparent outline-none w-full"
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearError("password");
                }}
                autoComplete={state === "Sign Up" ? "new-password" : "current-password"}
                aria-invalid={!!errors.password}
                aria-describedby="password-error"
              />
              <button
                type="button"
                onClick={() => setShowPassword((s) => !s)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                className="text-indigo-300 hover:text-indigo-200 focus:outline-none"
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <FiEyeOff /> : <FiEye />}
              </button>
            </div>
            {errors.password && (
              <p id="password-error" className="text-red-500 text-xs -mt-1 mb-2">
                {errors.password}
              </p>
            )}

            {/* Confirm Password (Sign Up only) */}
            {state === "Sign Up" && (
              <>
                <div className={fieldWrap(!!errors.confirmPassword)}>
                  <FiLock className="text-indigo-400" />
                  <input
                    className="bg-transparent outline-none w-full"
                    type={showConfirm ? "text" : "password"}
                    placeholder="Confirm Password"
                    required
                    value={confirmPassword}
                    onChange={(e) => {
                      setConfirmPassword(e.target.value);
                      clearError("confirmPassword");
                    }}
                    autoComplete="new-password"
                    aria-invalid={!!errors.confirmPassword}
                    aria-describedby="confirm-error"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirm((s) => !s)}
                    aria-label={showConfirm ? "Hide confirm password" : "Show confirm password"}
                    className="text-indigo-300 hover:text-indigo-200 focus:outline-none"
                    title={showConfirm ? "Hide confirm password" : "Show confirm password"}
                  >
                    {showConfirm ? <FiEyeOff /> : <FiEye />}
                  </button>
                </div>
                {errors.confirmPassword && (
                  <p id="confirm-error" className="text-red-500 text-xs -mt-1 mb-2">
                    {errors.confirmPassword}
                  </p>
                )}
              </>
            )}

            {state === "Sign Up" && (
              <>
                <div className={fieldWrap(!!errors.age)}>
                  <FiCalendar className="text-indigo-400" />
                  <input
                    className="bg-transparent outline-none w-full"
                    type="number"
                    placeholder="Age"
                    required
                    value={age}
                    onChange={(e) => {
                      setAge(e.target.value);
                      clearError("age");
                    }}
                    aria-invalid={!!errors.age}
                    aria-describedby="age-error"
                  />
                </div>
                {errors.age && (
                  <p id="age-error" className="text-red-500 text-xs -mt-1 mb-2">
                    {errors.age}
                  </p>
                )}

                <div className={fieldWrap(!!errors.phone)}>
                  <FiPhone className="text-indigo-400" />
                  <input
                    className="bg-transparent outline-none w-full"
                    type="text"
                    placeholder="Phone Number"
                    required
                    value={phone}
                    onChange={(e) => {
                      // allow only digits and cap at 10
                      const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                      setPhone(val);
                      clearError("phone");
                    }}
                    inputMode="numeric"
                    aria-invalid={!!errors.phone}
                    aria-describedby="phone-error"
                  />
                </div>
                {errors.phone && (
                  <p id="phone-error" className="text-red-500 text-xs -mt-1 mb-2">
                    {errors.phone}
                  </p>
                )}

                <div className={fieldWrap(!!errors.address)}>
                  <FiMapPin className="text-indigo-400" />
                  <input
                    className="bg-transparent outline-none w-full"
                    type="text"
                    placeholder="Address"
                    required
                    value={address}
                    onChange={(e) => {
                      setAddress(e.target.value);
                      clearError("address");
                    }}
                    aria-invalid={!!errors.address}
                    aria-describedby="address-error"
                  />
                </div>
                {errors.address && (
                  <p id="address-error" className="text-red-500 text-xs -mt-1 mb-2">
                    {errors.address}
                  </p>
                )}

                <p className="text-xs text-indigo-300 -mt-1 mb-3 text-center">
                  Password must be at least 6 characters, with at least 1 uppercase letter and 1
                  special character.
                </p>
              </>
            )}

            <p
              onClick={() => navigate("/reset-password")}
              className="ml-1   mb-4 text-indigo-500 cursor-pointer hover:underline "
            >
              Forgot password?
            </p>

            <button
              type="submit"
              className="w-full py-2.5 rounded-full bg-gradient-to-r from-indigo-500 to-indigo-900 text-white font-medium"
            >
              {state === "Sign Up" ? "Sign Up" : "Login"}
            </button>
          </form>

          <p className="text-center text-gray-400 text-xs mt-4">
            {state === "Sign Up" ? "Already have an account?" : "Don't have an account?"}{" "}
            <span
              onClick={() => setState(state === "Sign Up" ? "Login" : "Sign Up")}
              className="cursor-pointer underline text-blue-400"
            >
              {state === "Sign Up" ? "Login here" : "Sign Up"}
            </span>
          </p>

          <p className="text-center text-gray-400 text-xs mt-4">
            Staff Member?{" "}
            <span
              onClick={() => navigate("/admin/login")}
              className="cursor-pointer underline text-red-700"
            >
              Login
            </span>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;
