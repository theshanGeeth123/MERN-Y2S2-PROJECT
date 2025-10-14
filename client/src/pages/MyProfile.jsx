import React, { useEffect, useState } from 'react';
import axios from 'axios';

import NavbarCustomer from '../components/NavbarCustomer';

function MyProfile() {
  const [user, setUser] = useState({
    name: '',
    email: '',
    age: '',
    phone: '',
    address: '',
    _id: ''
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(true);

  // NEW: inline validation errors
  const [errors, setErrors] = useState({});

  // Validators
  const isValidName = (n) => (n || '').trim().length >= 5;
  const isAdult = (a) => Number(a) >= 18;
  const isValidPhone = (p) => /^\d{10}$/.test((p || '').toString());

  const validate = () => {
    const e = {};
    if (!isValidName(user.name)) e.name = 'Full name must be at least 5 characters.';
    if (!isAdult(user.age)) e.age = 'You must be 18 or older.';
    if (!isValidPhone(user.phone)) e.phone = 'Phone number must be exactly 10 digits.';
    setErrors(e);
    return e;
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));

        if (!customer || !customer.email) {
          setError("No email found in localStorage");
          setLoading(false);
          return;
        }

        const idRes = await axios.get(`http://localhost:4000/api/user/customer?email=${customer.email}`);
        const userId = idRes.data.userId;

        const dataRes = await axios.get(`http://localhost:4000/api/user/customer/${userId}`);
        const { name, email, _id, age, phone, address } = dataRes.data.data;

        setUser({ name, email, _id, age, phone, address });
        setLoading(false);
      } catch (err) {
        setError("Failed to load profile");
        setLoading(false);
      }
    };

    fetchUserDetails();
  }, []);

  // Keep existing handler but add per-field cleanup + phone sanitizing
  const handleChange = (e) => {
    const { name, value } = e.target;

    // live clear error for the edited field
    setErrors((prev) => {
      if (!prev[name]) return prev;
      const copy = { ...prev };
      delete copy[name];
      return copy;
    });

    if (name === 'phone') {
      // digits only + cap at 10
      const val = value.replace(/\D/g, '').slice(0, 10);
      setUser({ ...user, phone: val });
    } else {
      setUser({ ...user, [name]: value });
    }
  };

  const handleUpdate = async () => {
    // block if invalid
    const e = validate();
    if (Object.keys(e).length > 0) return;

    try {
      const res = await axios.put(`http://localhost:4000/api/user/customer/${user._id}`, {
        name: user.name,
        email: user.email,
        age: user.age,
        phone: user.phone,
        address: user.address
      });

      if (res.data.success) {
        setMessage("Profile updated successfully");
        setError('');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setError("Update failed");
        setMessage('');
      }
    } catch (err) {
      setError("Error updating profile");
      setMessage('');
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete your profile? This action cannot be undone.")) return;
    try {
      await axios.delete(`http://localhost:4000/api/user/customer/${user._id}`);
      localStorage.removeItem("customer");
      window.location.href = "/";
    } catch (err) {
      setError("Error deleting profile");
    }
  };

  // helper to toggle error border
  const inputClass = (hasError) =>
    `block w-full pl-10 pr-4 py-3 text-gray-700 bg-white border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition ${
      hasError ? 'border-red-500' : 'border-gray-300'
    }`;

  const hint = (msg, id) =>
    msg ? <p id={id} className="mt-1 text-xs text-red-600">{msg}</p> : null;

  return (

    <><NavbarCustomer/>
    <div className="max-w-7xl mx-auto p-6 mt-8 mb-12  ">
      <div className="bg-white rounded-xl shadow-xl overflow-hidden border border-gray-200 ">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-600 p-8 text-white">
          <div className="flex items-center">
            <div className="bg-white/20 p-3 rounded-full mr-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-3xl font-bold">Profile Settings</h2>
              <p className="text-indigo-100 mt-1">Manage and protect your account information</p>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="p-8">
          {loading ? (
            <div className="flex flex-col justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600 mb-4"></div>
              <p className="text-gray-500">Loading your profile...</p>
            </div>
          ) : error ? (
            <div className="bg-red-50 border border-red-200 p-4 mb-6 rounded-lg flex items-start">
              <div className="flex-shrink-0">
                <svg className="h-6 w-6 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-red-800 font-medium">Error</h3>
                <p className="text-red-700 text-sm mt-1">{error}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Name */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Full Name</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="name"
                      value={user.name}
                      onChange={handleChange}
                      className={inputClass(!!errors.name)}
                      placeholder="Enter your full name"
                      aria-invalid={!!errors.name}
                      aria-describedby="name-error"
                    />
                  </div>
                  {hint(errors.name, 'name-error')}
                </div>

                {/* Email (read-only) */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Email Address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <input
                      type="email"
                      name="email"
                      value={user.email}
                      readOnly
                      className="block w-full pl-10 pr-4 py-3 text-gray-500 bg-gray-100 border border-gray-300 rounded-lg cursor-not-allowed"
                    />
                  </div>
                  <p className="mt-2 text-xs text-gray-500 flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Email cannot be changed
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Age */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Age</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                    <input
                      type="number"
                      name="age"
                      value={user.age}
                      onChange={handleChange}
                      className={inputClass(!!errors.age)}
                      min="1"
                      aria-invalid={!!errors.age}
                      aria-describedby="age-error"
                    />
                  </div>
                  {hint(errors.age, 'age-error')}
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Phone Number</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                    </div>
                    <input
                      type="text"
                      name="phone"
                      value={user.phone}
                      onChange={handleChange}
                      className={inputClass(!!errors.phone)}
                      placeholder="Your phone number"
                      inputMode="numeric"
                      aria-invalid={!!errors.phone}
                      aria-describedby="phone-error"
                    />
                  </div>
                  {hint(errors.phone, 'phone-error')}
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2 uppercase tracking-wide">Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 pt-3 flex items-start pointer-events-none">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    name="address"
                    value={user.address}
                    onChange={handleChange}
                    className="block w-full pl-10 pr-4 py-3 text-gray-700 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition"
                    placeholder="Your full address"
                  />
                </div>
              </div>

              {/* Success Message */}
              {message && (
                <div className="bg-green-50 border border-green-200 p-4 rounded-lg flex items-start">
                  <div className="flex-shrink-0">
                    <svg className="h-6 w-6 text-green-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-3">
                    <h3 className="text-green-800 font-medium">Success</h3>
                    <p className="text-green-700 text-sm mt-1">{message}</p>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t border-gray-200">
                <button
                  onClick={handleUpdate}
                  className="cursor-pointer px-6 py-3 bg-gray-600 hover:bg-black text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 shadow-sm flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  Save Changes
                </button>
                <button
                  onClick={handleDelete}
                  className="cursor-pointer px-6 py-3 bg-white hover:bg-red-400 border border-gray-300 text-gray-700 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm flex items-center justify-center"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Delete Account
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
    </>
  );
}

export default MyProfile;
