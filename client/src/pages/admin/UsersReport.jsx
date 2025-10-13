import React, { useEffect, useMemo, useState } from "react";
import axios from "axios";
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell, Legend
} from "recharts";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import NavbarAdmin from "../../components/NavbarAdmin";

import logo from "./Main_Logo.png";

const API = "http://localhost:4000/api/user-reports";
const PIE_COLORS = ["#10B981", "#EF4444"]; // verified, unverified

const Card = ({ title, value, className = "" }) => (
  <div className={`bg-white rounded-2xl shadow-lg p-6 border border-gray-100 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${className}`}>
    <div className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2">{title}</div>
    <div className="text-3xl font-bold text-gray-900">{value}</div>
  </div>
);

export default function UsersReport() {
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState({ totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 });
  const [byPeriod, setByPeriod] = useState([]);          // [{ _id:"YYYY-MM-DD" | "YYYY-MM", registrations }]
  const [ageDist, setAgeDist] = useState([]);            // [{ range:"18-24", count }]
  const [domains, setDomains] = useState([]);            // [{ domain, count }]
  const [verifiedSplit, setVerifiedSplit] = useState({ verified: 0, unverified: 0 });
  const [date, setDate] = useState({ start: "", end: "" });
  const [groupBy, setGroupBy] = useState("day");         // "day" | "month"

  const fetchAll = async () => {
    setLoading(true);
    try {
      const qs = new URLSearchParams();
      if (date.start) qs.append("start", date.start);
      if (date.end) qs.append("end", date.end);
      const query = qs.toString() ? `?${qs.toString()}` : "";
      const byEndpoint = groupBy === "day" ? "by-day" : "by-month";

      const [s, m, a, d, v] = await Promise.all([
        axios.get(`${API}/summary${query}`),
        axios.get(`${API}/${byEndpoint}${query}`),
        axios.get(`${API}/age-distribution${query}`),
        axios.get(`${API}/email-domains?limit=8${query ? `&${qs.toString()}` : ""}`),
        axios.get(`${API}/verified-split${query}`),
      ]);

      if (s.data?.success) setSummary(s.data.data ?? { totalUsers: 0, verifiedUsers: 0, unverifiedUsers: 0 });
      if (m.data?.success) setByPeriod(m.data.data ?? []);
      if (a.data?.success) setAgeDist(a.data.data ?? []);
      if (d.data?.success) setDomains(d.data.data ?? []);
      if (v.data?.success) {
        const vs = v.data.data ?? { verified: 0, unverified: 0 };
        setVerifiedSplit({
          verified: Number(vs.verified) || 0,
          unverified: Number(vs.unverified) || 0,
        });
      }
    } catch (e) {
      console.error("Report fetch error:", e.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAll();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [groupBy]); // refetch when switching day/month

  const pieData = useMemo(
    () => [
      { name: "Verified", value: verifiedSplit.verified || 0 },
      { name: "Unverified", value: verifiedSplit.unverified || 0 },
    ],
    [verifiedSplit]
  );

  // ---------- PDF Download ----------
const handleDownloadPDF = () => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  // ----- Page metrics -----
  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const frameMargin = 40;                 // decorative border margin
  const marginX = 64;                     // left/right content margin
  const contentWidth = pageWidth - marginX * 2;

  // Footer and spacing
  const FOOTER_Y = pageHeight - frameMargin - 10;  // footer sits inside frame
  const TOP_PADDING = frameMargin + 26;            // top content offset inside frame
  const bottomReserve = 80;                        // keep tables clear of footer

  // Palette
  const HEADER_GRAY = [70, 70, 70];
  const HEADER_TEXT = [255, 255, 255];

  // ---------- Draw helpers ----------
  const drawFrame = () => {
    doc.setDrawColor(0);
    doc.setLineWidth(1.1);
    doc.rect(
      frameMargin,
      frameMargin,
      pageWidth  - frameMargin * 2,
      pageHeight - frameMargin * 2
    );
  };

  const drawFooter = () => {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text("© 2025 JW Studio — User Analytics Report", pageWidth / 2, FOOTER_Y, { align: "center" });
  };

  // Base config for tables — ensures frame + footer are drawn on every page
  const tableBase = {
    margin: { left: marginX, right: marginX, bottom: bottomReserve },
    styles: { font: "helvetica", fontSize: 10, cellPadding: 7, lineColor: [225, 225, 225] },
    headStyles: { fillColor: HEADER_GRAY, textColor: HEADER_TEXT },
    tableWidth: contentWidth,
    didDrawPage: () => { drawFrame(); drawFooter(); }
  };

  // ---------- Utilities ----------
  const addSectionTitle = (text, y) => {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(14);
    doc.text(text, marginX, y);
    return y + 16;
  };

  // Ensure there’s room; otherwise start a new page and reset y
  const ensureSpace = (y, required = 150) => {
    const usableBottom = pageHeight - frameMargin - bottomReserve; // bottom limit for content
    const remaining = usableBottom - y;
    if (remaining < required) {
      doc.addPage();
      // frame/footer will be drawn by the first table on this page via didDrawPage,
      // but we also draw them now so titles before a table look correct immediately.
      drawFrame();
      drawFooter();
      return TOP_PADDING;
    }
    return y;
  };

  const fmtInt  = (n) => Number(n || 0).toLocaleString();
  const safeNum = (v) => (typeof v === "number" && isFinite(v) ? v : 0);
  const percent = (num, den) => (Number(den) ? `${((Number(num||0) / Number(den)) * 100).toFixed(1)}%` : "0%");

  const extractVU = (row) => {
    if (!row) return { ver: null, unv: null };
    if (typeof row.verified === "number" || typeof row.unverified === "number")
      return { ver: row.verified ?? null, unv: row.unverified ?? null };
    if (row.breakdown)
      return { ver: row.breakdown.verified ?? null, unv: row.breakdown.unverified ?? null };
    return { ver: null, unv: null };
  };

  const parseIdDate = (id) => {
    if (!id) return null;
    const s = /^\d{4}-\d{2}$/.test(id) ? `${id}-01` : String(id);
    const d = new Date(s);
    return Number.isNaN(d.getTime()) ? null : d;
  };

  const toMonthKey = (d) => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
  const monthLabel = (ym) => {
    const [y, m] = ym.split("-");
    const d = new Date(Number(y), Number(m) - 1, 1);
    return d.toLocaleString(undefined, { month: "short", year: "numeric" });
  };

  const getEarliestDate = (rows) => {
    let earliest = null;
    rows.forEach((r) => {
      const d = parseIdDate(r?._id);
      if (d && (!earliest || d < earliest)) earliest = d;
    });
    return earliest;
  };

  const aggregateYTDByMonth = (rows, now = new Date()) => {
    const curYear = now.getFullYear();
    const out = new Map();
    let hasSplit = false;

    const add = (ym, all, ver = null, unv = null) => {
      if (!out.has(ym)) out.set(ym, { all: 0, ver: 0, unv: 0 });
      const rec = out.get(ym);
      rec.all += Number(all || 0);
      if (ver != null || unv != null) {
        hasSplit = true;
        rec.ver += Number(ver || 0);
        rec.unv += Number(unv || 0);
      }
    };

    rows.forEach((r) => {
      const d = parseIdDate(r?._id);
      if (!d || d.getFullYear() !== curYear) return;
      const ym = toMonthKey(d);
      const { ver, unv } = extractVU(r);
      add(ym, Number(r?.registrations || 0), ver, unv);
    });

    const rowsOut = Array.from(out.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([ym, v]) => ({ ym, ...v }));
    return { rows: rowsOut, hasSplit };
  };

  const findMinMax = (rows, key) => {
    if (!rows.length) return null;
    let min = rows[0], max = rows[0];
    rows.forEach((r) => {
      if (r[key] < min[key]) min = r;
      if (r[key] > max[key]) max = r;
    });
    return { min, max };
  };

  const averagePerDay = (total, start, end = new Date()) => {
    if (!start) return null;
    const days = Math.max(1, Math.floor((end - start) / 86400000) + 1);
    return Number(total || 0) / days;
  };

  // ---------- Render ----------
  const render = (img) => {
    // draw border/footer for first page immediately
    drawFrame();
    drawFooter();

    let y = TOP_PADDING;

    // Logo
    if (img) {
      const maxW = 140;
      const ratio = img.width && img.height ? img.width / img.height : 3.8;
      const w = Math.min(maxW, contentWidth);
      const h = w / ratio;
      const x = (pageWidth - w) / 2;
      doc.addImage(img, "PNG", x, y, w, h, undefined, "FAST");
      y += h + 26;
    } else {
      y += 20;
    }

    // Title
    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("JW-Studio Report for User Analytics", marginX, y);
    y += 26;

    // Meta
    const now = new Date();
    const range = (date?.start || date?.end) ? ` | Range: ${date.start || "—"} to ${date.end || "—"}` : "";
    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.text(`Generated on: ${now.toLocaleString()}${range}`, marginX, y);
    y += 18;

    // Summary
    const total = Number(summary?.totalUsers || 0);
    const verified = Number(summary?.verifiedUsers || 0);
    const unverified = Number(summary?.unverifiedUsers || 0);

    doc.setFontSize(12);
    doc.text(
      `Total: ${fmtInt(total)}   •   Verified: ${fmtInt(verified)} (${percent(verified, total)})   •   Unverified: ${fmtInt(unverified)} (${percent(unverified, total)})`,
      marginX,
      y
    );
    y += 22;

    // Verified split
    autoTable(doc, {
      ...tableBase,
      startY: y,
      head: [["Segment", "Users", "Share"]],
      body: [
        ["Verified", fmtInt(verified), percent(verified, total)],
        ["Unverified", fmtInt(unverified), percent(unverified, total)],
      ],
    });
    y = (doc.lastAutoTable.finalY || y) + 26;

    // Registrations by period
    const byList = Array.isArray(byPeriod) ? byPeriod : [];
    if (byList.length) {
      y = addSectionTitle(`Registrations by ${groupBy === "month" ? "Month" : "Day"}`, y);

      autoTable(doc, {
        ...tableBase,
        startY: y,
        head: [[groupBy === "month" ? "Month" : "Date", "Registrations"]],
        body: byList.map(r => [String(r?._id ?? "—"), Number(r?.registrations ?? 0)]),
      });
      y = (doc.lastAutoTable.finalY || y) + 24;
    }

    // Min/Max YTD
    const { rows: ytdRows } = aggregateYTDByMonth(byList, now);
    if (ytdRows.length) {
      y = addSectionTitle(`Min / Max Month (YTD ${now.getFullYear()}) — All Users`, y);
      const mm = findMinMax(ytdRows, "all");
      if (mm) {
        autoTable(doc, {
          ...tableBase,
          startY: y,
          head: [["Type", "Month", "Registrations"]],
          body: [
            ["Minimum", monthLabel(mm.min.ym), fmtInt(mm.min.all)],
            ["Maximum", monthLabel(mm.max.ym), fmtInt(mm.max.all)],
          ],
        });
        y = (doc.lastAutoTable.finalY || y) + 20;
      }
    }

    // >>>>> FORCE THIS WHOLE SECTION TO NEXT PAGE WHEN NEEDED <<<<<
    // We estimate ~220pt for the section (title + two small tables).
    y = ensureSpace(y, 220);

    // Average Registrations Per Day (from first registration to now)
    const earliest = getEarliestDate(byList);
    const avgAll = averagePerDay(total, earliest, now);
    const avgVer = averagePerDay(verified, earliest, now);
    const avgUnv = averagePerDay(unverified, earliest, now);

    y = addSectionTitle("Average Registrations Per Day (from first registration to now)", y);

    autoTable(doc, {
      ...tableBase,
      startY: y,
      head: [["Range Start", "Range End", "Days (inclusive)", "Avg / Day"]],
      body: [[
        earliest ? earliest.toLocaleDateString() : "—",
        now.toLocaleDateString(),
        earliest ? (Math.floor((now - earliest) / 86400000) + 1).toLocaleString() : "—",
        avgAll != null ? avgAll.toFixed(2) : "—",
      ]],
    });
    y = (doc.lastAutoTable.finalY || y) + 18;

    autoTable(doc, {
      ...tableBase,
      startY: y,
      head: [["Segment", "Avg / Day"]],
      body: [
        ["Verified",  avgVer != null ? avgVer.toFixed(2)  : "—"],
        ["Unverified",avgUnv != null ? avgUnv.toFixed(2) : "—"],
      ],
    });
    y = (doc.lastAutoTable.finalY || y) + 26;

    // Age distribution
    const ages = Array.isArray(ageDist) ? ageDist : [];
    if (ages.length) {
      y = ensureSpace(y, 160);
      y = addSectionTitle("Age Distribution", y);
      autoTable(doc, {
        ...tableBase,
        startY: y,
        head: [["Age Range", "Users"]],
        body: ages.map(r => [String(r?.range ?? "—"), Number(r?.count ?? 0)]),
      });
      y = (doc.lastAutoTable.finalY || y) + 20;
    }

    // Domains (basic)
    const doms = Array.isArray(domains) ? domains : [];
    if (doms.length) {
      y = ensureSpace(y, 200);
      y = addSectionTitle("Top Email Domains — Share & Split", y);
      const shaped = doms.map(r => ({
        domain: String(r?.domain ?? r?._id ?? "—"),
        users: Number(r?.count ?? r?.users ?? 0),
      }));
      const totalUsersAll = shaped.reduce((s, r) => s + safeNum(r.users), 0);
      autoTable(doc, {
        ...tableBase,
        startY: y,
        head: [["Domain", "Users", "Share"]],
        body: shaped.map(r => [r.domain, fmtInt(r.users), percent(r.users, totalUsersAll)]),
      });
      // y update not needed further
    }

    const safeStart = (date?.start || "all").replaceAll(/[:/\\]/g, "-");
    const safeEnd = (date?.end || "all").replaceAll(/[:/\\]/g, "-");
    doc.save(`User_Analytics_Report_${safeStart}_to_${safeEnd}.pdf`);
  };

  // Load logo (optional)
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = logo || "";
  img.onload = () => render(img);
  img.onerror = () => render(null);
};










  return (

    <><NavbarAdmin/>

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
      {/* Header + Filters */}
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">User Analytics Dashboard</h1>
          <p className="text-gray-600 mt-2">Comprehensive insights into user registrations and demographics</p>
        </div>

        <div className="bg-white rounded-2xl shadow-md p-5 border border-gray-200 flex flex-col md:flex-row gap-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Group by</label>
            <select
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
              value={groupBy}
              onChange={(e) => setGroupBy(e.target.value)}
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">Start Date</label>
            <input
              type="date"
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
              value={date.start}
              onChange={(e) => setDate((p) => ({ ...p, start: e.target.value }))}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm font-medium text-gray-700">End Date</label>
            <input
              type="date"
              className="border border-gray-200 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 bg-gray-50"
              value={date.end}
              onChange={(e) => setDate((p) => ({ ...p, end: e.target.value }))}
            />
          </div>
          <div className="flex flex-col justify-end gap-2">
            <div className="flex gap-2">
              <button
                onClick={fetchAll}
                className="bg-gradient-to-r from-blue-600 to-blue-700 text-white px-4 py-2.5 rounded-xl hover:from-blue-700 hover:to-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 font-medium shadow-md hover:shadow-lg"
              >
                Apply Filters
              </button>
              <button
                onClick={handleDownloadPDF}
                className="bg-gradient-to-r from-emerald-600 to-emerald-700 text-white px-4 py-2.5 rounded-xl hover:from-emerald-700 hover:to-emerald-800 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-all duration-200 font-medium flex items-center gap-1 shadow-md hover:shadow-lg"
                title="Download PDF"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                Export PDF
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card 
          title="Total Users" 
          value={summary.totalUsers.toLocaleString()} 
          className="border-l-4 border-l-blue-500" 
        />
        <Card 
          title="Verified Users" 
          value={summary.verifiedUsers.toLocaleString()} 
          className="border-l-4 border-l-green-500" 
        />
        <Card 
          title="Unverified Users" 
          value={summary.unverifiedUsers.toLocaleString()} 
          className="border-l-4 border-l-amber-500" 
        />
      </div>

      {loading ? (
        <div className="bg-white rounded-2xl shadow-md p-8 text-center border border-gray-200">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="mt-4 text-gray-600 font-medium">Loading user analytics...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* Registrations by Day/Month */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-blue-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-blue-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                  </svg>
                </div>
                Registrations by {groupBy === "day" ? "Day" : "Month"}
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                {byPeriod.length} {groupBy === "day" ? "days" : "months"}
              </span>
            </div>
            {byPeriod.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-3 font-medium">No registration data for the selected range.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <LineChart data={byPeriod}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="_id" stroke="#6b7280" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px'
                    }} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="registrations" 
                    stroke="#6366F1" 
                    strokeWidth={3} 
                    dot={{ fill: '#6366F1', strokeWidth: 2, r: 4 }} 
                    activeDot={{ r: 7, fill: '#4F46E5' }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Age Distribution */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-green-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                  </svg>
                </div>
                Age Distribution
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                {ageDist.length} ranges
              </span>
            </div>
            {ageDist.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-3 font-medium">No age data available for the selected range.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={ageDist}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="range" stroke="#6b7280" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px'
                    }} 
                  />
                  <Bar dataKey="count" fill="#10B981" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>

          {/* Verified Split */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-purple-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-purple-600" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                </div>
                Verified vs Unverified Users
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                {verifiedSplit.verified + verifiedSplit.unverified} total
              </span>
            </div>
            <div className="flex items-center justify-center">
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie 
                    data={pieData} 
                    dataKey="value" 
                    nameKey="name" 
                    outerRadius={120} 
                    innerRadius={70}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    labelLine={false}
                  >
                    {pieData.map((_, i) => (
                      <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="#fff" strokeWidth={2} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value} users`, 'Count']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px'
                    }} 
                  />
                  <Legend 
                    iconType="circle"
                    iconSize={12}
                    layout="vertical"
                    verticalAlign="middle"
                    align="right"
                    wrapperStyle={{ paddingLeft: '30px' }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Email Domains */}
          <div className="bg-white rounded-2xl shadow-md p-6 border border-gray-200">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900 flex items-center gap-3">
                <div className="p-2 bg-amber-100 rounded-xl">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-amber-600" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" />
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" />
                  </svg>
                </div>
                Top Email Domains
              </h2>
              <span className="text-sm text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg font-medium">
                Top {domains.length}
              </span>
            </div>
            {domains.length === 0 ? (
              <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-14 w-14 mx-auto text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="mt-3 font-medium">No domain data for the selected range.</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <BarChart data={domains}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="domain" stroke="#6b7280" fontSize={12} />
                  <YAxis allowDecimals={false} stroke="#6b7280" fontSize={12} />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      borderRadius: '8px', 
                      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
                      border: '1px solid #e5e7eb',
                      fontSize: '14px'
                    }} 
                  />
                  <Bar dataKey="count" fill="#F59E0B" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>
      )}
    </div>
    </>
  );
}