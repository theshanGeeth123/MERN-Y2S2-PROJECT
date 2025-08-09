// src/pages/admin/UsersReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";

const API = "http://localhost:4000/api/user-reports";
const PIE_COLORS = ["#10B981", "#EF4444"];

const Card = ({ title, value, className = "" }) => (
  <div className={`bg-white rounded-xl shadow p-5 ${className}`}>
    <div className="text-sm text-gray-500">{title}</div>
    <div className="text-2xl font-semibold mt-1">{value}</div>
  </div>
);

export default function UsersReport() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 });
  const [byMonth, setByMonth] = useState([]);
  const [ageDist, setAgeDist] = useState([]);
  const [domains, setDomains] = useState([]);
  const [verifiedSplit, setVerifiedSplit] = useState({ verified: 0, unverified: 0 });
  const [date, setDate] = useState({ start: "", end: "" });

  const fetchAll = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (date.start) qs.append("start", date.start);
      if (date.end) qs.append("end", date.end);
      const query = qs.toString() ? `?${qs.toString()}` : "";

      const [s, m, a, d, v] = await Promise.all([
        axios.get(`${API}/summary${query}`),
        axios.get(`${API}/by-month${query}`),
        axios.get(`${API}/age-distribution${query}`), // returns [{ range: "18-24", count: 5 }, ...]
        axios.get(`${API}/email-domains?limit=8${query ? `&${qs.toString()}` : ""}`),
        axios.get(`${API}/verified-split${query}`),
      ]);

      if (s.data?.success) setSummary(s.data.data || { totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 });
      if (m.data?.success) setByMonth(m.data.data || []);
      if (a.data?.success) setAgeDist(a.data.data || []);
      if (d.data?.success) setDomains(d.data.data || []);
      if (v.data?.success) setVerifiedSplit(v.data.data || { verified: 0, unverified: 0 });
    } catch (e) {
      console.error("Report fetch error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pieData = useMemo(
    () => [
      { name: "Verified", value: verifiedSplit.verified || 0 },
      { name: "Unverified", value: verifiedSplit.unverified || 0 },
    ],
    [verifiedSplit]
  );

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      {/* Header + Filters */}
      <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-6">
        <h1 className="text-3xl font-bold">👥 User Reports</h1>

        <div className="bg-white rounded-xl shadow p-4 flex flex-col md:flex-row gap-3">
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 w-16">Start</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={date.start}
              onChange={(e) => setDate((p) => ({ ...p, start: e.target.value }))}
            />
          </div>
          <div className="flex items-center gap-2">
            <label className="text-sm text-gray-600 w-16">End</label>
            <input
              type="date"
              className="border rounded px-2 py-1"
              value={date.end}
              onChange={(e) => setDate((p) => ({ ...p, end: e.target.value }))}
            />
          </div>
          <button
            onClick={fetchAll}
            className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700"
          >
            Apply
          </button>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <Card title="Total Users" value={summary.totalUsers} />
        <Card title="Verified Users" value={summary.verifiedUsers} />
        <Card title="Unverified Users" value={summary.unverifiedUsers} />
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading reports…</p>
      ) : (
        <div className="space-y-8">
          {/* By Month */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">📅 Registrations by Month</h2>
            {byMonth.length === 0 ? (
              <p className="text-gray-500">No registration data for the selected range.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={byMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* backend returns _id as "YYYY-MM" */}
                  <XAxis dataKey="_id" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Line type="monotone" dataKey="registrations" stroke="#6366F1" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Age Distribution */}
          <div className="bg-white rounded-xl shadow p-6">
            <h2 className="text-xl font-semibold mb-4">🎂 Age Distribution</h2>
            {ageDist.length === 0 ? (
              <p className="text-gray-500">No age data available for the selected range.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={ageDist}>
                  <CartesianGrid strokeDasharray="3 3" />
                  {/* NOTE: x-axis uses "range" (e.g., "18-24") */}
                  <XAxis dataKey="range" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#10B981" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Verified Split */}
<div className="bg-white rounded-xl shadow p-6">
  <h2 className="text-xl font-semibold mb-4">✅ Verified vs Unverified</h2>

  {(() => {
    const total = (verifiedSplit.verified || 0) + (verifiedSplit.unverified || 0);
    if (total === 0) {
      return <p className="text-gray-500">No verification data for the selected range.</p>;
    }
    const pieData = [
      { name: "Verified", value: Number(verifiedSplit.verified) || 0 },
      { name: "Unverified", value: Number(verifiedSplit.unverified) || 0 },
    ];
    return (
      <ResponsiveContainer width="100%" height={280}>
        <PieChart key={`${pieData[0].value}-${pieData[1].value}`}>
          <Pie
            data={pieData}
            dataKey="value"
            nameKey="name"
            outerRadius={110}
            label
            labelLine={false}
          >
            {pieData.map((_, i) => (
              <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    );
  })()}
</div>


          {/* Email Domains */}
          <div className="bg-white rounded-xl shadow p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">📧 Top Email Domains</h2>
              <span className="text-sm text-gray-500">Top 8</span>
            </div>
            {domains.length === 0 ? (
              <p className="text-gray-500">No domain data for the selected range.</p>
            ) : (
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={domains}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="domain" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="count" fill="#F59E0B" />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
