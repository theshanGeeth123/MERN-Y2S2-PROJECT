import React, { useEffect, useState } from 'react';
import axios from 'axios';

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

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));

        if (!customer || !customer.email) {
          setError("No email found in localStorage");
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

  const handleChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleUpdate = async () => {
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
        // Clear message after 3 seconds
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

  return (
    <div className="max-w-2xl mx-auto p-6 mt-8 mb-12">
      <div className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100">
        {/* Header Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6 text-white">
          <h2 className="text-2xl font-bold">My Profile</h2>
          <p className="text-blue-100 mt-1">Manage your personal information</p>
        </div>

        {/* Content Section */}
        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={user.name}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Enter your full name"
                />
              </div>

              {/* Email (read-only) */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  type="email"
                  name="email"
                  value={user.email}
                  readOnly
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="mt-1 text-xs text-gray-500">Email cannot be changed</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Age */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <input
                    type="number"
                    name="age"
                    value={user.age}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    min="1"
                  />
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleChange}
                    className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                    placeholder="Your phone number"
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
                <input
                  type="text"
                  name="address"
                  value={user.address}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                  placeholder="Your full address"
                />
              </div>

              {/* Success Message */}
              {message && (
                <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-green-700">{message}</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
                <button
                  onClick={handleUpdate}
                  className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm"
                >
                  Update Profile
                </button>
                <button
                  onClick={handleDelete}
                  className="px-5 py-2.5 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 font-medium rounded-lg transition duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 shadow-sm"
                >
                  Delete Profile
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MyProfile;