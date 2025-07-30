import React, { useEffect, useState } from "react";
import { fetchEmailDomainReport } from "../../api/reportAPI.js";
import {
  PieChart, Pie, Tooltip, Cell, Legend, ResponsiveContainer,
} from "recharts";

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AA3377', '#7733AA'];

export default function EmailDomainReport() {
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEmailDomainReport()
      .then(res => {
        if (res.data.success) setData(res.data.data);
        else setError("Failed to load email domain report");
      })
      .catch(() => setError("Network error"));
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data.length) return <div>Loading...</div>;

  return (
    <div>
      <h2>Email Domains</h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="count"
            nameKey="domain"
            cx="50%"
            cy="50%"
            outerRadius={100}
            fill="#8884d8"
            label
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
}
