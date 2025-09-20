import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const BOOKING_API = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/bookings`
  : "http://localhost:4000/api/bookings";

const PIE_COLORS = ["#a78bfa", "#f472b6", "#facc15", "#60a5fa", "#4ade80"];

function BookingReport() {
  const [trendData, setTrendData] = useState([]);
  const [summary, setSummary] = useState({
    total: 0,
    approved: 0,
    pending: 0,
    cancelled: 0,
  });
  const [mostBooked, setMostBooked] = useState([]);
  const [loading, setLoading] = useState(true);

  const getMonthlyApproved = (bookings) => {
    const monthlyCounts = Array.from({ length: 12 }, () => 0);

    bookings.forEach((b) => {
      if (b.status && b.status.toLowerCase() === "approved" && b.date) {
        const date = new Date(b.date);
        const month = date.getMonth();
        monthlyCounts[month] += 1;
      }
    });

    return monthlyCounts.map((count, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      approved: count,
    }));
  };

  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const allRes = await axios.get(BOOKING_API, { withCredentials: true });
        const bookings = Array.isArray(allRes.data.bookings)
          ? allRes.data.bookings
          : [];

        const summaryData = bookings.reduce(
          (acc, b) => {
            acc.total += 1;
            if (b.status && b.status.toLowerCase() === "approved")
              acc.approved += 1;
            if (b.status && b.status.toLowerCase() === "pending")
              acc.pending += 1;
            if (b.status && b.status.toLowerCase() === "cancelled")
              acc.cancelled += 1;
            return acc;
          },
          { total: 0, approved: 0, pending: 0, cancelled: 0 }
        );
        setSummary(summaryData);

        const packageCounts = {};
        bookings.forEach((b) => {
          if (b.packageName)
            packageCounts[b.packageName] =
              (packageCounts[b.packageName] || 0) + 1;
        });
        const sortedPackages = Object.entries(packageCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        const top5 = sortedPackages.slice(0, 5);
        const othersCount = sortedPackages
          .slice(5)
          .reduce((sum, pkg) => sum + pkg.value, 0);
        if (othersCount > 0)
          top5.push({ name: "Others", value: othersCount });
        setMostBooked(top5);

        const monthlyTrend = getMonthlyApproved(bookings);
        setTrendData(monthlyTrend);
      } catch (err) {
        console.error("Failed to fetch booking report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  return (
    <div className="p-8 min-h-screen bg-black">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">
        Booking Report
      </h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading report...</p>
      ) : (
        <>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              {
                title: "Total Bookings",
                value: summary.total,
                color: "bg-gray-100",
                key: "total",
              },
              {
                title: "Approved",
                value: summary.approved,
                color: "bg-green-100 text-green-800",
                key: "approved",
              },
              {
                title: "Pending",
                value: summary.pending,
                color: "bg-yellow-100 text-yellow-800",
                key: "pending",
              },
              {
                title: "Cancelled",
                value: summary.cancelled,
                color: "bg-red-100 text-red-800",
                key: "cancelled",
              },
            ].map((card) => (
              <div
                key={card.key}
                className={`${card.color} p-6 rounded-2xl shadow hover:shadow-lg transition text-center`}
              >
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Monthly Approved Bookings
              </h2>
              {trendData.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart
                    data={trendData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
                  >
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 4" />
                    <XAxis
                      dataKey="month"
                      tick={{ fontSize: 12, fill: "#4b5563" }}
                      axisLine={{ stroke: "#9ca3af" }}
                      tickLine={{ stroke: "#d1d5db" }}
                      label={{
                        value: "Month",
                        position: "insideBottom",
                        offset: -5,
                        fill: "#374151",
                        fontSize: 14,
                      }}
                    />
                    <YAxis
                      tick={{ fontSize: 12, fill: "#4b5563" }}
                      axisLine={{ stroke: "#9ca3af" }}
                      tickLine={{ stroke: "#d1d5db" }}
                      allowDecimals={false}
                      label={{
                        value: "Bookings",
                        angle: -90,
                        position: "insideLeft",
                        fill: "#374151",
                        fontSize: 14,
                      }}
                    />
                    <Tooltip
                      wrapperStyle={{ fontSize: 13 }}
                      contentStyle={{
                        borderRadius: 8,
                        border: "1px solid #d1d5db",
                      }}
                    />
                    <Bar
                      dataKey="approved"
                      fill="#4ade80"
                      radius={[4, 4, 0, 0]}
                      label={{ position: "top", fill: "#000", fontSize: 12 }}
                    />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p className="text-center text-gray-500">
                  No approved bookings available.
                </p>
              )}
            </div>

            
            <div className="bg-white p-6 rounded-2xl shadow flex flex-col">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">
                Most Booked Packages
              </h2>
              {mostBooked.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={mostBooked}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label={({ value, x, y }) => {
                          const total = mostBooked.reduce(
                            (sum, entry) => sum + entry.value,
                            0
                          );
                          const percent = ((value / total) * 100).toFixed(0);
                          return (
                            <text
                              x={x}
                              y={y}
                              textAnchor="middle"
                              dominantBaseline="central"
                              fill="black"
                              fontSize={12}
                              fontWeight="bold"
                            >
                              {percent}%
                            </text>
                          );
                        }}
                      >
                        {mostBooked.map((entry, index) => (
                          <Cell
                            key={index}
                            fill={PIE_COLORS[index % PIE_COLORS.length]}
                          />
                        ))}
                      </Pie>
                      
                      <Tooltip
                        content={({ payload }) => {
                          if (payload && payload.length) {
                            return (
                              <div
                                style={{
                                  background: "white",
                                  border: "1px solid #ccc",
                                  padding: "5px",
                                }}
                              >
                                {payload[0].value} Bookings
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                 
                  <div className="mt-4 overflow-y-auto max-h-32">
                    {mostBooked.map((pkg, index) => (
                      <div key={index} className="flex items-center mb-1">
                        <span
                          className="w-4 h-4 rounded-sm mr-2"
                          style={{
                            backgroundColor:
                              PIE_COLORS[index % PIE_COLORS.length],
                          }}
                        ></span>
                        <p className="text-gray-700 text-sm">{pkg.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p className="text-center text-gray-500">
                  No package data available.
                </p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingReport;
