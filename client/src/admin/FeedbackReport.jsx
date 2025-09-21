import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

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

const FEEDBACK_API = "http://localhost:4000/api/user/feedback";
const PIE_COLORS = ["#a78bfa", "#f472b6", "#facc15", "#60a5fa", "#4ade80"];

function FeedbackReport() {
  const [feedbacks, setFeedbacks] = useState([]);
  const [summary, setSummary] = useState({
    total: 0, excellent: 0, good: 0, average: 0, poor: 0,
  });
  const [monthlyTrend, setMonthlyTrend] = useState([]);
  const [topPhotographers, setTopPhotographers] = useState([]);
  const [loading, setLoading] = useState(true);
  const reportRef = useRef(null);

  const getMonthlyRatings = (feedbacks) => { //get monthly count for ratings >= 3
    const months = Array.from({ length: 12 }, (_, i) => ({
      month: new Date(0, i).toLocaleString("default", { month: "short" }),
      excellent: 0,
      good: 0,
      average: 0,
      poor: 0,
    }));

    feedbacks.forEach( (fb) => {
      const date = new Date(fb.createdAt);
      const monthIndex = date.getMonth();
      if (fb.rate >= 4) 
        months[monthIndex].excellent += 1;
      else if (fb.rate === 3) 
        months[monthIndex].good += 1;
      else if (fb.rate === 2) 
        months[monthIndex].average += 1;
      else 
        months[monthIndex].poor += 1;
    });
    return months;
  };

  useEffect(() => {
    const fetchFeedbacks = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(FEEDBACK_API);
        const fbList = Array.isArray(data.data) ? data.data : [];
        setFeedbacks(fbList);

        const summaryCounts = { total: fbList.length, excellent: 0, good: 0, average: 0, poor: 0 };
        fbList.forEach((fb) => {
          const rating = parseInt(fb.rate, 10);
          if ( rating >= 4 ) 
            summaryCounts.excellent += 1;
          else if (rating === 3) 
            summaryCounts.good += 1;
          else if (rating === 2) 
            summaryCounts.average += 1;
          else 
            summaryCounts.poor += 1;
        });
        setSummary(summaryCounts);  
        const monthlyData = getMonthlyRatings(fbList); // Monthly trend
        setMonthlyTrend(monthlyData);

        const photographerCounts = {}; // top 5 photographers
        fbList.forEach((fb) => {
          if (fb.selectedPhotographer) {
            photographerCounts[fb.selectedPhotographer] = (photographerCounts[fb.selectedPhotographer] || 0) + 1;
          }
        });
        const sorted = Object.entries(photographerCounts).map(([name, count]) => ({ name, value: count }))
                .sort((a, b) => b.value - a.value);
        const top5 = sorted.slice(0, 5);
        const othersCount = sorted.slice(5).reduce((sum, p) => sum + p.value, 0);
        if (othersCount > 0) top5.push({ name: "Others", value: othersCount });
        setTopPhotographers(top5);
      } catch (err) {
        console.error("Failed to fetch feedbacks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchFeedbacks();
  }, []);

  const exportPDF = async () => { 
    const element = reportRef.current;
    if (!element) return;

    const canvas = await html2canvas(element, { scale: 6 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF("p", "mm", "a4");
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("processed_requests.pdf");
  };

  return (
    <div style={{ padding: "2rem", minHeight: "100vh", backgroundColor: "#f3f4f6" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "2rem" }}>
        <h1 style={{ fontSize: "2.5rem", fontWeight: "bold", color: "#111827", textAlign: "center", flex: 1 }}>Feedback Report</h1>
        <button onClick={exportPDF} style={{ padding: "0.5rem 1rem", backgroundColor: "#2563eb", color: "#ffffff", borderRadius: "0.5rem",
            fontWeight: 500, fontSize: "1rem", cursor: "pointer", }}>Export as PDF </button>
      </div>

      {loading ? (
        <p style={{ textAlign: "center", color: "#374151", fontSize: "1.125rem" }}>Loading report...</p>
      ) : (
        <div  ref={reportRef}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1.5rem", marginBottom: "2.5rem" }}>
            {[
              { title: "Total Feedbacks", value: summary.total, color: { backgroundColor: "#f3f4f6", color: "#111827" }, key: "total" },
              { title: "Excellent", value: summary.excellent, color: { backgroundColor: "#d1fae5", color: "#065f46" }, key: "excellent" },
              { title: "Good", value: summary.good, color: { backgroundColor: "#bfdbfe", color: "#1e40af" }, key: "good" },
              { title: "Average", value: summary.average, color: { backgroundColor: "#fef3c7", color: "#78350f" }, key: "average" },
              { title: "Poor", value: summary.poor, color: { backgroundColor: "#fecaca", color: "#991b1b" }, key: "poor" },
            ].map((card) => (
              <div key={card.key} style={{ ...card.color, padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center" }}>
                <h2 style={{ fontSize: "1.125rem", fontWeight: "600" }}>{card.title}</h2>
                <p style={{ fontSize: "2rem", fontWeight: "700", marginTop: "0.5rem" }}>{card.value}</p>
              </div>
            ))}
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
            <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem", color: "#111827" }}>Monthly Ratings</h2>
              {monthlyTrend.length > 0 ? (
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={monthlyTrend} margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                    <CartesianGrid stroke="#e0e0e0" strokeDasharray="4 4" />
                    <XAxis dataKey="month" tick={{ fontSize: 12, fill: "#4b5563" }} />
                    <YAxis tick={{ fontSize: 12, fill: "#4b5563" }} allowDecimals={false} />
                    <Tooltip wrapperStyle={{ fontSize: 13 }} contentStyle={{ borderRadius: 8, border: "1px solid #d1d5db" }} />
                    <Bar dataKey="excellent" fill="#4ade80" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="good" fill="#60a5fa" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="average" fill="#facc15" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="poor" fill="#f87171" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <p style={{ textAlign: "center", color: "#6b7280" }}>No feedbacks available.</p>
              )}
            </div>

            <div style={{ backgroundColor: "#ffffff", padding: "1.5rem", borderRadius: "1rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", display: "flex", flexDirection: "column" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: "700", marginBottom: "1rem", color: "#111827" }}>Top Photographers</h2>
              {topPhotographers.length > 0 ? (
                <>
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={topPhotographers}
                        dataKey="value"
                        nameKey="name"
                        outerRadius={80}
                        label={({ value, x, y }) => {
                          const total = topPhotographers.reduce((sum, entry) => sum + entry.value, 0);
                          const percent = ((value / total) * 100).toFixed(0);
                          return (
                            <text x={x} y={y} textAnchor="middle" dominantBaseline="central" fill="black" fontSize={12} fontWeight="bold">
                              {percent}%
                            </text>
                          );
                        }}
                      >
                        {topPhotographers.map((entry, index) => (
                          <Cell key={index} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip
                        content={({ payload }) => {
                          if (payload && payload.length) {
                            return (
                              <div style={{ background: "white", border: "1px solid #ccc", padding: "5px" }}>
                                {payload[0].name}: {payload[0].value} feedbacks
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>

                  <div style={{ marginTop: "1rem", overflowY: "auto", maxHeight: "8rem" }}>
                    {topPhotographers.map((p, index) => (
                      <div key={index} style={{ display: "flex", alignItems: "center", marginBottom: "0.25rem" }}>
                        <span style={{ width: "1rem", height: "1rem", borderRadius: "0.125rem", marginRight: "0.5rem", backgroundColor: PIE_COLORS[index % PIE_COLORS.length] }}></span>
                        <p style={{ fontSize: "0.875rem", color: "#1f2937" }}>{p.name}</p>
                      </div>
                    ))}
                  </div>
                </>
              ) : (
                <p style={{ textAlign: "center", color: "#374151" }}>No photographer data available.</p>
              )}
            </div>
          </div>
          <div className="bg-white p-4 rounded-lg shadow overflow-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr style={{ backgroundColor: "#e5e7eb", textAlign: "center" }}>
                  <th style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>#</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>Email</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>Rating</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>Comment</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>Photographer</th>
                  <th style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>Date</th>
                </tr>
              </thead>
              <tbody>
                {feedbacks.map((fb, index) => (
                  <tr
                    key={fb._id}
                    style={{
                      backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                      textAlign: "center",
                    }}
                  >
                    <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>{index + 1}</td>
                    <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>{fb.email}</td>
                    <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>{fb.rate}</td>
                    <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>{fb.comment || "-"}</td>
                    <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>{fb.selectedPhotographer || "-"}</td>
                    <td style={{ border: "1px solid #d1d5db", padding: "0.5rem" }}>
                      {new Date(fb.createdAt).toLocaleString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

export default FeedbackReport;
