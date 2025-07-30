import React, { useEffect, useState } from "react";
import { fetchUserSummary } from "../../api/reportAPI.js";

export default function UserSummaryReport() {
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUserSummary()
      .then(res => {
        if (res.data.success) setSummary(res.data.data);
        else setError("Failed to load summary");
      })
      .catch(() => setError("Network error"));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!summary) return <div>Loading...</div>;

  return (
    <div>
      <h2>User Summary</h2>
      <ul>
        <li>Total Users: {summary.totalUsers}</li>
        <li>Verified Users: {summary.verifiedUsers}</li>
        <li>Unverified Users: {summary.unverifiedUsers}</li>
      </ul>
    </div>
  );
}
