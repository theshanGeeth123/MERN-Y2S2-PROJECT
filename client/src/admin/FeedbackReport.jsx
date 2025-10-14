// src/pages/admin/AdminFeedbackReport.jsx
import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";
import NavbarAdmin from '../components/NavbarAdmin';
import MainLogo from "../assets/Main_Logo.png";

const FEEDBACK_API = "http://localhost:4000/api/user/feedback";
const PIE_COLORS = ["#4045e8ff", "#f19eacff", "#d8a449ff", "#65cf8cff", "#7ad5e5ff", "#6d5d9aff"];

function FeedbackReport() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(FEEDBACK_API);
        setFeedbacks(Array.isArray(data?.data) ? data.data : []);
      } catch (e) {
        console.error("Failed to fetch feedbacks:", e);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  // Derived data 
  const summary = useMemo(() => {
    const s = { total: 0, excellent: 0, good: 0, average: 0, poor: 0 };
    for (const fb of feedbacks) {
      const r = Number(fb.rate) || 0;
      s.total++;
      if (r >= 4) s.excellent++;
      else if (r === 3) s.good++;
      else if (r === 2) s.average++;
      else s.poor++;
    }
    return s;
  }, [feedbacks]);

  const monthlyTrend = useMemo(() => {
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      excellent: 0, good: 0, average: 0, poor: 0,
    }));
    feedbacks.forEach((fb) => {
      const m = new Date(fb.createdAt).getMonth();
      const r = Number(fb.rate) || 0;
      if (r >= 4) months[m].excellent++;
      else if (r === 3) months[m].good++;
      else if (r === 2) months[m].average++;
      else months[m].poor++;
    });
    return months;
  }, [feedbacks]);

  const topPhotographers = useMemo(() => {
    const counts = {};
    feedbacks.forEach((fb) => {
      const name = fb.selectedPhotographer || "(Unknown)";
      counts[name] = (counts[name] || 0) + 1;
    });
    const sorted = Object.entries(counts)
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value);
    const top5 = sorted.slice(0, 5);
    const rest = sorted.slice(5).reduce((n, x) => n + x.value, 0);
    if (rest > 0) top5.push({ name: "Others", value: rest });
    return top5;
  }, [feedbacks]);

  // ---------- PDF Export ----------
  const handleDownloadPDF = () => {
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const margin = 36;
    let y = margin;
    const pageWidth  = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();

    // border
    doc.setDrawColor(0, 0, 0); // Black color
    doc.setLineWidth(1.2); // Border thickness
    doc.rect(20, 20, pageWidth - 40, pageHeight - 40, "S");

    // logo
    const logoWidth = 120;
    const logoHeight = 120;
    const logoX = (pageWidth - logoWidth) / 2;
    doc.addImage(MainLogo, "PNG", logoX, y, logoWidth, logoHeight);
    y += 120;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(24);
    doc.text("JW-Studio Report for Feedback", margin, y);
    y += 20;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, y);
    y += 20;
    doc.text(
      `Total: ${summary.total}   •   Excellent: ${summary.excellent}   •   Good: ${summary.good}   •   Average: ${summary.average}   •   Poor: ${summary.poor}`,
      margin,
      y
    );
    y += 30;

    const section = (title) => { // Helper to add a section heading band
      autoTable(doc, {
        startY: y, head: [[title]], body: [],
        theme: "plain", styles: { fontSize: 10 },
        headStyles: {
          fillColor: [230, 233, 238],
          textColor: 20,
          fontStyle: "bold",
          halign: "left",
          cellPadding: 6,
        },
        margin: { left: margin, right: margin },
        didDrawPage: (d) => (y = d.cursor.y + 25),
      });
    };

    const byDate = feedbacks.reduce((acc, fb) => { // Table: Feedbacks by Date
      const d = new Date(fb.createdAt);
      const day = isNaN(d) ? "-" : d.toISOString().slice(0, 10);
      acc[day] = (acc[day] || 0) + 1;
      return acc;
    }, {});
    const dateRows = Object.entries(byDate)
      .sort((a, b) => (a[0] > b[0] ? 1 : -1))
      .map(([d, c]) => [d, c]);
    try {
      doc.addImage(LOGO_PATH, "PNG", 36, 30, 80, 40); // (x, y, width, height)
    } catch (err) {}

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Total Feedbacks per day", margin, y);
    y += 8;

    autoTable(doc, {
      startY: y,
      head: [["Date (YYYY-MM-DD)", "Feedbacks"]],
      body: dateRows,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [70, 74, 84], textColor: 255 },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "center" } },
      margin: { left: margin, right: margin },
      didDrawPage: (d) => (y = d.cursor.y + 25),
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Rating Breakdown", margin, y);
    y += 8;

    autoTable(doc, { // Table: Rating breakdown
      startY: y+12,
      head: [["Rating", "Count"]],
      body: [
        ["Excellent (4–5)", summary.excellent],
        ["Good (3)", summary.good],
        ["Average (2)", summary.average],
        ["Poor (1)", summary.poor],
      ],
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [70, 74, 84], textColor: 255 },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "center" } },
      margin: { left: margin, right: margin },
      didDrawPage: (d) => (y = d.cursor.y + 25),
    });

    doc.setFont("helvetica", "normal");
    doc.setFontSize(16);
    doc.text("Photographers Analysis based on Ratings", margin, y);
    y += 8;

    // Table: Photographers
    const totalTop = topPhotographers.reduce((s, p) => s + (p.value || 0), 0);
    const tpRows = topPhotographers.map((p, idx) => {
      const ratePercentage = totalTop ? ((p.value / totalTop) * 100).toFixed(0) + "%" : "—";
      return [p.name, ratePercentage];
    });

    autoTable(doc, {
      startY: y + 12,
      head: [["Photographer", "Rating Percentage"]],
      body: tpRows,
      theme: "grid",
      styles: { fontSize: 9 },
      headStyles: { fillColor: [70, 74, 84], textColor: 255 },
      columnStyles: { 0: { halign: "left" }, 1: { halign: "center" } },
      margin: { left: margin, right: margin },
      didDrawPage: (d) => (y = d.cursor.y + 25),
    });

    // Footer
    doc.setFontSize(8);
    doc.setTextColor(110);
    doc.text(
      "© 2025 JW-Studio — Feedback Management Report",
      doc.internal.pageSize.getWidth() / 2,
      doc.internal.pageSize.getHeight() - 12,
      { align: "center" }
    );

    doc.save(`jwstudio-feedback-report-${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8 flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">Feedback Management</h2>
              <p className="text-gray-600 mt-2">  View and manage all customer feedback & export detailed reports. </p>
            </div>
            <button
              onClick={handleDownloadPDF} className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
              Download PDF Report
            </button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500" />
              <span className="ml-4 text-gray-600">Loading feedback…</span>
            </div>
          ) : (
            <>
              {/* Summary cards */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
                {[
                  { label: "Total", value: summary.total, bg: "bg-gray-100", text: "text-gray-900" },
                  { label: "Excellent", value: summary.excellent, bg: "bg-emerald-50", text: "text-emerald-700" },
                  { label: "Good", value: summary.good, bg: "bg-blue-50", text: "text-blue-700" },
                  { label: "Average", value: summary.average, bg: "bg-amber-50", text: "text-amber-700" },
                  { label: "Poor", value: summary.poor, bg: "bg-rose-50", text: "text-rose-700" },
                ].map((c) => (
                  <div key={c.label} className={`rounded-xl p-4 shadow-sm ${c.bg}`}>
                    <div className="text-sm font-medium text-gray-500">{c.label}</div>
                    <div className={`mt-1 text-2xl font-bold ${c.text}`}>{c.value}</div>
                  </div>
                ))}
              </div>

              {/* Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Ratings</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyTrend} margin={{ top: 10, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis dataKey="month" tick={{ fill: "#6b7280", fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fill: "#6b7280", fontSize: 12 }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="excellent" name="Excellent" fill="#22c55e" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="good" name="Good" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="average" name="Average" fill="#f59e0b" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="poor" name="Poor" fill="#ef4444" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Photographers</h3>
                  <div className="h-80">
                    <ResponsiveContainer width="80%" height="80%">
                      <PieChart>
                        <Pie data={topPhotographers} dataKey="value" nameKey="name" outerRadius={100}
                          label={({ name, percent, x, y }) => ( <text  x={x} y={y} textAnchor="middle"
                          dominantBaseline="central" fontSize={12} fontWeight={500} >
                          {`${name} ${(percent * 100).toFixed(0)}%`} </text> )} labelLine={false} >
                            {topPhotographers.map((_, i) => ( <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />))}
                        </Pie>
                        <Tooltip wrapperStyle={{ zIndex: 1000 }} contentStyle={{fontSize: "10px", maxWidth: "200px",  borderRadius: "8px", whiteSpace: "normal", border: "1px solid #ddd"}}
                          labelStyle={{ fontWeight: "600", marginBottom: "4px", whiteSpace: "normal",}}/>
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>

              {/* Table  view */}
              <div className="mt-8 bg-white rounded-lg shadow overflow-auto">
                <table className="min-w-full">
                  <thead className="bg-gray-200 text-left text-xxs font-semibold uppercase tracking-wider text-gray-600">
                    <tr>
                      <th className="px-5 py-3 w-1/15">#</th>
                      <th className="px-5 py-3 w-3/15">Created Date</th>
                      <th className="px-5 py-3 w-3/15">Username</th>
                      <th className="px-5 py-3 w-1/15">Rating</th>
                      <th className="px-5 py-3 w-4/15">Comment</th>
                      <th className="px-5 py-3 w-3/15">Photographer</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-400">
                    {feedbacks.map((fb, i) => (
                      <tr key={fb._id} className="hover:bg-gray-50">
                        <td className="px-5 py-3 text-gray-400">{i + 1}</td>
                        <td className="px-5 py-3 text-gray-700">  {new Date(fb.createdAt).toISOString().slice(0, 10)} </td>
                        <td className="px-5 py-3 text-gray-800">{fb.username || "-"}</td>
                        <td className="px-5 py-3 text-gray-800">{fb.rate ?? "-"}</td>
                        <td className="px-5 py-3 text-gray-700">{fb.comment || "-"}</td>
                        <td className="px-5 py-3 text-gray-700">{fb.selectedPhotographer || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
}

export default FeedbackReport;
