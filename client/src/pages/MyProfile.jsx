import React, { useEffect, useState } from 'react';
import axios from 'axios';

function MyProfile() {
  const [user, setUser] = useState(null);   // store user object
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const customer = JSON.parse(localStorage.getItem("customer"));

        if (!customer || !customer.email) {
          setError("No email found in localStorage");
          return;
        }

        // Step 1: Get user ID by email
        const idResponse = await axios.get(
          `http://localhost:4000/api/user/customer?email=${customer.email}`
        );

        if (!idResponse.data.success) {
          setError(idResponse.data.message || "Failed to get user ID");
          return;
        }

        const userId = idResponse.data.userId;

        // Step 2: Get full user details by ID
        const userResponse = await axios.get(
          `http://localhost:4000/api/user/customer/${userId}`
        );

        if (!userResponse.data.success) {
          setError(userResponse.data.message || "Failed to get user details");
          return;
        }

        // Step 3: Set user data (exclude password)
        const { _id, name, email } = userResponse.data.data;
        setUser({ _id, name, email });

      } catch (err) {
        console.error("Error fetching user details:", err);
        setError("Something went wrong while fetching user details.");
      }
    };

    fetchUserDetails();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <h2>My Profile</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {user ? (
        <div>
          <p><strong>User ID:</strong> {user._id}</p>
          <p><strong>Name:</strong> {user.name}</p>
          <p><strong>Email:</strong> {user.email}</p>
        </div>
      ) : !error ? (
        <p>Loading...</p>
      ) : null}
    </div>
  );
}

export default MyProfile;
