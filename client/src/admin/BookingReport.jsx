import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { FiArrowUpRight, FiArrowDownRight } from "react-icons/fi";

const BOOKING_API = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/bookings`
  : "http://localhost:4000/api/bookings";


const COLORS = ["#60a5fa", "#2dd66bff", "#facc15", "#f472b6"]; 

function BookingReport() {
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState({ total: 0, approved: 0, pending: 0, cancelled: 0 });
  const [mostBooked, setMostBooked] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const trendRes = await axios.get(`${BOOKING_API}/trends`, { withCredentials: true });
        setTrendData(trendRes.data.trends || []);

        const allRes = await axios.get(BOOKING_API, { withCredentials: true });
        const bookings = Array.isArray(allRes.data.bookings) ? allRes.data.bookings : [];

        const summaryData = bookings.reduce(
          (acc, b) => {
            acc.total += 1;
            if (b.status === "approved") acc.approved += 1;
            if (b.status === "pending") acc.pending += 1;
            if (b.status === "cancelled") acc.cancelled += 1;
            return acc;
          },
          { total: 0, approved: 0, pending: 0, cancelled: 0 }
        );
        setSummary(summaryData);

        
        const packageCounts = {};
        bookings.forEach((b) => {
          packageCounts[b.packageName] = (packageCounts[b.packageName] || 0) + 1;
        });
        const sortedPackages = Object.entries(packageCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);

        const top5 = sortedPackages.slice(0, 5);
        const othersCount = sortedPackages.slice(5).reduce((sum, pkg) => sum + pkg.value, 0);
        if (othersCount > 0) top5.push({ name: "Others", value: othersCount });
        setMostBooked(top5);
      } catch (err) {
        console.error("Failed to fetch booking report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const getMonthChange = (key) => {
    if (!trendData || trendData.length < 2) return 0;
    const lastMonth = trendData[trendData.length - 2][key] || 0;
    const thisMonth = trendData[trendData.length - 1][key] || 0;
    return ((thisMonth - lastMonth) / (lastMonth || 1)) * 100;
  };

  return (
    <div className="p-8 min-h-screen bg-black">
      <h1 className="text-4xl font-bold text-white mb-8 text-center"> Booking Report</h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading report...</p>
      ) : (
        <>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { title: "Total Bookings", value: summary.total, color: "bg-gray-100", key: "total" },
              { title: "Approved", value: summary.approved, color: "bg-green-100 text-green-800", key: "approved" },
              { title: "Pending", value: summary.pending, color: "bg-yellow-100 text-yellow-800", key: "pending" },
              { title: "Cancelled", value: summary.cancelled, color: "bg-red-100 text-red-800", key: "cancelled" },
            ].map((card) => {
              const change = getMonthChange(card.key);
              return (
                <div key={card.key} className={`${card.color} p-6 rounded-2xl shadow hover:shadow-lg transition text-center`}>
                  <h2 className="text-lg font-semibold">{card.title}</h2>
                  <p className="text-3xl font-bold mt-2">{card.value}</p>
                  {trendData.length >= 2 && (
                    <p className={`mt-1 flex items-center justify-center text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                      {change >= 0 ? <FiArrowUpRight className="mr-1" /> : <FiArrowDownRight className="mr-1" />}
                      {Math.abs(change).toFixed(1)}%
                    </p>
                  )}
                </div>
              );
            })}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Monthly Approved Bookings</h2>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={trendData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="_id" />
                    <YAxis />
                    <Tooltip />
                    <Line type="monotone" dataKey="approved" stroke="#4ade80" strokeWidth={3} name="Approved" />
                  </LineChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No trend data available.</p>
              )}
            </div>

            
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Most Booked Packages</h2>
              {mostBooked.length > 0 ? (
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={mostBooked}
                      dataKey="value"
                      nameKey="name"
                      outerRadius={100}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    >
                      {mostBooked.map((entry, index) => (
                        <Cell key={index} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${value} bookings`} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">No package data available.</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingReport;
