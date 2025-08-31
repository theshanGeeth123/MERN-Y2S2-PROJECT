import React, { useEffect, useState } from 'react';
import axios from 'axios';
import CustomerHomeNavbar from '../components/CustomerHomeNavbar';

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
    if (!window.confirm("Are you sure you want to delete your profile?")) return;
    try {
      await axios.delete(`http://localhost:4000/api/user/customer/${user._id}`);
      localStorage.removeItem("customer");
      window.location.href = "/";
    } catch (err) {
      setError("Error deleting profile");
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <CustomerHomeNavbar />
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-20">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h2>

        {loading ? (
          <p className="text-gray-600">Loading...</p>
        ) : error ? (
          <p className="text-red-500 mb-4">{error}</p>
        ) : (
          <>
            {/* Name */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Name:</label>
              <input
                type="text"
                name="name"
                value={user.name}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Email (read-only) */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Email:</label>
              <input
                type="email"
                name="email"
                value={user.email}
                readOnly
                className="w-full px-3 py-2 border rounded-md bg-gray-100 cursor-not-allowed"
              />
            </div>

            {/* Age */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Age:</label>
              <input
                type="number"
                name="age"
                value={user.age}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Phone */}
            <div className="mb-4">
              <label className="block text-gray-700 text-sm font-medium mb-2">Phone:</label>
              <input
                type="text"
                name="phone"
                value={user.phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Address */}
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-medium mb-2">Address:</label>
              <input
                type="text"
                name="address"
                value={user.address}
                onChange={handleChange}
                className="w-full px-3 py-2 border rounded-md"
              />
            </div>

            {/* Buttons */}
            <div className="flex items-center space-x-4">
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
              >
                Update Profile
              </button>
              <button
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
              >
                Delete Profile
              </button>
            </div>

            {/* Message */}
            {message && <p className="mt-4 text-green-600">{message}</p>}
          </>
        )}
      </div>
    </div>
  );
}

export default MyProfile;
