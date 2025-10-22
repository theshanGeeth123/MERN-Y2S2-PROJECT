/*
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
*/

import React, { useEffect, useState, useRef, useMemo } from "react";
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
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const barChartRef = useRef();
  const pieChartRef = useRef();

  // Monthly approved bookings calculation
  const getMonthlyApproved = (bookings) => {
    const monthlyCounts = Array.from({ length: 12 }, () => 0);
    bookings.forEach((b) => {
      if (b.status && b.status.toLowerCase() === "approved" && b.date) {
        const date = new Date(b.date);
        monthlyCounts[date.getMonth()] += 1;
      }
    });
    return monthlyCounts.map((count, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      approved: count,
    }));
  };

  // Fetch bookings
  useEffect(() => {
    const fetchReport = async () => {
      setLoading(true);
      try {
        const res = await axios.get(BOOKING_API, { withCredentials: true });
        const bookings = Array.isArray(res.data.bookings) ? res.data.bookings : [];

        // Summary
        const summaryData = bookings.reduce(
          (acc, b) => {
            acc.total += 1;
            if (b.status?.toLowerCase() === "approved") acc.approved += 1;
            if (b.status?.toLowerCase() === "pending") acc.pending += 1;
            if (b.status?.toLowerCase() === "cancelled") acc.cancelled += 1;
            return acc;
          },
          { total: 0, approved: 0, pending: 0, cancelled: 0 }
        );
        setSummary(summaryData);

        // Most booked packages
        const packageCounts = {};
        bookings.forEach((b) => {
          if (b.packageName) packageCounts[b.packageName] = (packageCounts[b.packageName] || 0) + 1;
        });
        const sortedPackages = Object.entries(packageCounts)
          .map(([name, value]) => ({ name, value }))
          .sort((a, b) => b.value - a.value);
        const top5 = sortedPackages.slice(0, 5);
        const othersCount = sortedPackages.slice(5).reduce((sum, pkg) => sum + pkg.value, 0);
        if (othersCount > 0) top5.push({ name: "Others", value: othersCount });
        setMostBooked(top5);

        // Trend data
        setTrendData(getMonthlyApproved(bookings));
      } catch (err) {
        console.error("Failed to fetch booking report:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReport();
  }, []);

  const filteredBookings = useMemo(() => {
    if (!startDate || !endDate) return { summary, mostBooked, trendData };
    const bookingsInRange = [];
    // Filter by booking date range
    for (let i = 0; i < trendData.length; i++) {
      const month = trendData[i].month;
      bookingsInRange.push(trendData[i]);
    }
    return { summary, mostBooked, trendData }; 
  }, [startDate, endDate, summary, mostBooked, trendData]);

  // PDF generation
  const generatePDF = async () => {
    if (!trendData.length && !mostBooked.length) return alert("No booking data available to generate PDF.");

    try {
      const doc = new jsPDF("p", "pt", "a4");
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();
      let currentY = 30;

      // Add Logo
      const logoUrl = "https://i.postimg.cc/sDyqHGKy/Whats-App-Image-2025-10-10-at-21-37-32.jpg"; 
      const getBase64ImageFromUrl = async (imageUrl) => {
        const res = await fetch(imageUrl);
        const blob = await res.blob();
        return new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve(reader.result);
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        });
      };
      const logoBase64 = await getBase64ImageFromUrl(logoUrl);
      const logoWidth = 80, logoHeight = 80;
      doc.addImage(logoBase64, "JPEG", (width - logoWidth) / 2, currentY, logoWidth, logoHeight);
      currentY += logoHeight + 20;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("JW-Studio Booking Report", width / 2, currentY, { align: "center" });
      currentY += 25;

      // Date & Generated info
      doc.setFont("helvetica", "normal");
      doc.setFontSize(12);
      const now = new Date().toLocaleString();
      doc.text(`Generated on: ${now}`, 40, currentY);
      currentY += 20;

      // Summary Table with color-coded status
      const approvalRate = summary.total > 0 ? ((summary.approved / summary.total) * 100).toFixed(1) : 0;
      const cancellationRate = summary.total > 0 ? ((summary.cancelled / summary.total) * 100).toFixed(1) : 0;

      autoTable(doc, {
        startY: currentY,
        head: [["Metric", "Count / %"]],
        body: [
          ["Total Bookings", summary.total],
          ["Approved", summary.approved],
          ["Pending", summary.pending],
          ["Cancelled", summary.cancelled],
          ["Approval Rate", `${approvalRate}%`],
          ["Cancellation Rate", `${cancellationRate}%`],
        ],
        headStyles: { fillColor: [30, 64, 175], halign: "center" },
        styles: { halign: "center" },
        didParseCell: (data) => {
          if (data.column.index === 1) {
            const metric = data.row.cells[0].text[0];
            if (metric === "Approved") data.cell.styles.textColor = [0, 128, 0]; // green
            if (metric === "Pending") data.cell.styles.textColor = [255, 165, 0]; // orange
            if (metric === "Cancelled") data.cell.styles.textColor = [255, 0, 0]; // red
          }
        },
      });
      currentY = doc.lastAutoTable.finalY + 20;

      // Most Booked Packages Table
      if (mostBooked.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [["Package", "Bookings"]],
          body: mostBooked.map((p) => [p.name, p.value]),
          theme: "grid",
          headStyles: { fillColor: [16, 185, 129], textColor: [255, 255, 255], halign: "center" },
          bodyStyles: { halign: "center", fontSize: 10, cellPadding: 8 },
          margin: { left: 40, right: 40 },
        });
        currentY = doc.lastAutoTable.finalY + 20;
      }

      // Monthly Approved Bookings Table
      if (trendData.length > 0) {
        autoTable(doc, {
          startY: currentY,
          head: [["Month", "Approved Bookings"]],
          body: trendData.map((t) => [t.month, t.approved]),
          theme: "grid",
          headStyles: { fillColor: [59, 130, 246], textColor: [255, 255, 255], halign: "center" },
          bodyStyles: { halign: "center", fontSize: 10, cellPadding: 8 },
          margin: { left: 40, right: 40 },
        });
        currentY = doc.lastAutoTable.finalY + 20;
      }

      // Insights
      const busiestMonth = trendData.reduce((max, cur) => (cur.approved > max.approved ? cur : max), { approved: 0, month: "N/A" });
      doc.setFontSize(12);
      doc.text("Insights:", 40, currentY);
      currentY += 15;
      doc.setFontSize(11);
      doc.text(`• Approval Rate: ${approvalRate}%`, 60, currentY);
      currentY += 12;
      doc.text(`• Most Booked Package: ${mostBooked[0]?.name || "N/A"}`, 60, currentY);
      currentY += 12;
      doc.text(`• Busiest Month: ${busiestMonth.month}`, 60, currentY);
      currentY += 12;
      doc.text(`• Cancellation Rate: ${cancellationRate}%`, 60, currentY);
      currentY += 25;

      // Footer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text("© JW Photography Studio — All Rights Reserved", width / 2, height - 30, { align: "center" });

      doc.save(`Booking_Report_${now.replace(/[/,: ]/g, "_")}.pdf`);
    } catch (err) {
      console.error("PDF generation error:", err);
      alert("Failed to generate PDF");
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-8 min-h-screen bg-black">
      <h1 className="text-4xl font-bold text-white mb-8 text-center">Booking Report</h1>

      {loading ? (
        <p className="text-center text-gray-500 text-lg">Loading report...</p>
      ) : (
        <>
          
          <div className="flex justify-center gap-3 mb-6">
            <input type="date" value={startDate} max={today} onChange={(e) => setStartDate(e.target.value)} className="p-2 rounded bg-white" />
            <input type="date" value={endDate} max={today} onChange={(e) => setEndDate(e.target.value)} className="p-2 rounded bg-white" />
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-10">
            {[
              { title: "Total Bookings", value: summary.total, color: "bg-gray-100" },
              { title: "Approved", value: summary.approved, color: "bg-green-100 text-green-800" },
              { title: "Pending", value: summary.pending, color: "bg-yellow-100 text-yellow-800" },
              { title: "Cancelled", value: summary.cancelled, color: "bg-red-100 text-red-800" },
            ].map((card, i) => (
              <div key={i} className={`${card.color} p-6 rounded-2xl shadow text-center`}>
                <h2 className="text-lg font-semibold">{card.title}</h2>
                <p className="text-3xl font-bold mt-2">{card.value}</p>
              </div>
            ))}
          </div>

          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div ref={barChartRef} className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Monthly Approved Bookings</h2>
              <ResponsiveContainer width="100%" height={350}>
                <BarChart data={trendData} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                  <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 4" />
                  <XAxis dataKey="month" />
                  <YAxis allowDecimals={false} />
                  <Tooltip />
                  <Bar dataKey="approved" fill="#4ade80" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div ref={pieChartRef} className="bg-white p-6 rounded-2xl shadow">
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Most Booked Packages</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie data={mostBooked} dataKey="value" nameKey="name" outerRadius={80}>
                    {mostBooked.map((entry, index) => (
                      <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 overflow-y-auto max-h-32">
                {mostBooked.map((pkg, i) => (
                  <div key={i} className="flex items-center mb-1">
                    <span className="w-4 h-4 rounded-sm mr-2" style={{ backgroundColor: PIE_COLORS[i % PIE_COLORS.length] }} />
                    <p className="text-gray-700 text-sm">{pkg.name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <div className="mt-8 text-center">
            <button
              onClick={generatePDF}
              className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
}

export default BookingReport;
