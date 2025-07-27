import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function MyProfile() {
  const [user, setUser] = useState({ name: '', email: '', _id: '' });
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

        // Get user ID and data
        const idRes = await axios.get(`http://localhost:4000/api/user/customer?email=${customer.email}`);
        const userId = idRes.data.userId;

        const dataRes = await axios.get(`http://localhost:4000/api/user/customer/${userId}`);
        const { name, email, _id } = dataRes.data.data;
        setUser({ name, email, _id });
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
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md mt-30">
      <h2 className="text-2xl font-semibold text-gray-800 mb-6">My Profile</h2>
      
      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-500 mb-4">{error}</p>
      ) : (
        <>
          <div className="mb-4">
            <label className="block text-gray-700 text-sm font-medium mb-2">Name:</label>
            <input
              type="text"
              name="name"
              value={user.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">Email:</label>
            <input
              type="email"
              name="email"
              value={user.email}
              onChange={handleChange}
              readOnly
              className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed"
            />
          </div>
          
          <div className="flex items-center space-x-4">
            <button
              onClick={handleUpdate}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
            >
              Update Profile
            </button>
            
            <button
              onClick={handleDelete}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-colors"
            >
              Delete Profile
            </button>
          </div>
          
          {message && <p className="mt-4 text-green-600">{message}</p>}
        </>
      )}
    </div>
  );
}

export default MyProfile;