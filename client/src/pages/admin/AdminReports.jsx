// src/pages/admin/AdminReports.jsx

import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  LineChart, Line,
  BarChart, Bar,
  PieChart, Pie, Cell,
  XAxis, YAxis, Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend
} from "recharts";
import NavbarAdmin from "../../components/NavbarAdmin";

import logo from "./Main_Logo.png";

const COLORS = ["#4f46e5", "#10b981", "#f59e0b", "#ef4444", "#8b5cf6"];

const AdminReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("monthly");

  const fetchReports = async () => {
    try {
      const [sales, top, status, category] = await Promise.all([
        axios.get(`http://localhost:4000/api/reports/sales?range=${timeRange}`),
        axios.get("http://localhost:4000/api/reports/top-products"),
        axios.get("http://localhost:4000/api/reports/status"),
        axios.get("http://localhost:4000/api/reports/category")
      ]);

      setSalesData(Array.isArray(sales.data?.data) ? sales.data.data : []);
      setTopProducts(Array.isArray(top.data?.data) ? top.data.data : []);
      setOrderStatus(Array.isArray(status.data?.data) ? status.data.data : []);
      setRevenueByCategory(Array.isArray(category.data?.data) ? category.data.data : []);
    } catch (err) {
      console.error("Error fetching reports:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timeRange]);

const handleDownloadPDF = () => {
  const doc = new jsPDF({ unit: "pt", format: "a4" });

  const pageWidth  = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  const marginX = 60;          // left/right content margin
  const frameMargin = 30;      // distance from page edge to frame
  const bottomReserve = frameMargin + 24; // space for footer inside frame

  // helpers
  const drawFrame = () => {
    doc.setDrawColor(0);
    doc.setLineWidth(1.2);
    doc.rect(
      frameMargin,
      frameMargin,
      pageWidth  - frameMargin * 2,
      pageHeight - frameMargin * 2
    );
  };
  const drawFooter = () => {
    const footerY = pageHeight - frameMargin - 8;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.text(
      "© 2025 JW Studio — Product Sales Report",
      pageWidth / 2,
      footerY,
      { align: "center" }
    );
  };

  // common style for all tables (monochrome + consistent header)
  const commonTableStyle = {
    theme: "grid",
    headStyles: {
      fillColor: [80, 80, 80],
      textColor: [255, 255, 255],
      fontStyle: "bold",
    },
    styles: {
      halign: "left",
      fontSize: 11,
      cellPadding: 6,
    },
    margin: { left: marginX, right: marginX, bottom: bottomReserve },
    didDrawPage: () => { drawFrame(); drawFooter(); },
  };

  // pick best & worst by totalSold (defensive)
  const pickExtremes = (arr) => {
    if (!Array.isArray(arr) || arr.length === 0) return { best: null, worst: null };
    let best = arr[0], worst = arr[0];
    for (const p of arr) {
      const sBest = Number(best?.totalSold ?? 0);
      const sWorst = Number(worst?.totalSold ?? 0);
      const sCur  = Number(p?.totalSold ?? 0);
      if (sCur > sBest) best = p;
      if (sCur < sWorst) worst = p;
    }
    return { best, worst };
  };

  // Flexible date parser: tries item.date, then item._id
  const parseDateFlexible = (val) => {
    if (!val) return null;
    const d = new Date(val);
    if (!isNaN(d.getTime())) return d;
    // try YYYY-MM (treat as first of that month)
    if (/^\d{4}-\d{2}$/.test(String(val))) {
      const [y, m] = String(val).split("-").map(Number);
      const d2 = new Date(y, (m - 1), 1);
      return isNaN(d2.getTime()) ? null : d2;
    }
    // try YYYY (Jan 1)
    if (/^\d{4}$/.test(String(val))) {
      const d3 = new Date(Number(val), 0, 1);
      return isNaN(d3.getTime()) ? null : d3;
    }
    return null;
  };

  const getEarliestSalesDate = (arr) => {
    let min = null;
    for (const s of arr || []) {
      const candidate = parseDateFlexible(s?.date ?? s?._id);
      if (candidate) {
        if (!min || candidate < min) min = candidate;
      }
    }
    return min;
  };

  // render after logo is ready (or skip if it fails)
  const render = (img) => {
    drawFrame();

    // ---------- Logo (centered) ----------
    const maxLogoWidth = 160;
    let y = frameMargin + 10;
    if (img) {
      const ratio = (img.width && img.height) ? img.width / img.height : 4; // fallback aspect
      const logoW = Math.min(maxLogoWidth, pageWidth - marginX * 2);
      const logoH = logoW / ratio;
      const logoX = (pageWidth - logoW) / 2;
      doc.addImage(img, "PNG", logoX, y, logoW, logoH, undefined, "FAST", 0);
      y += logoH + 30;
    } else {
      y += 30;
    }

    // ---------- Title & meta ----------
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.text("JW-Studio Report for Products Sales", marginX, y);
    y += 22;

    doc.setFont("helvetica", "normal");
    doc.setFontSize(11);
    doc.setTextColor(0);
    const now = new Date();
    doc.text(`Generated on: ${now.toLocaleString()}`, marginX, y);
    y += 16;

    // quick summary line (Total revenue / orders / AOV)
    const totalRevenue = salesData.reduce((s, i) => s + Number(i?.totalSales ?? 0), 0);
    const totalOrders  = salesData.reduce((s, i) => s + Number(i?.count ?? 0), 0);
    const aov = totalOrders ? totalRevenue / totalOrders : 0;

    doc.setFontSize(12);
    doc.text(
      `Revenue: $${totalRevenue.toFixed(2)}   •   Orders: ${totalOrders}   •   AOV: $${aov.toFixed(2)}`,
      marginX, y
    );
    y += 38;

    // ---------- Average Revenue Per Day (from Start Order Date) ----------
    if (salesData.length) {
      const startDate = getEarliestSalesDate(salesData) || now;
      const msPerDay = 24 * 60 * 60 * 1000;
      // ceil() counts any partial day; minimum 1 day
      const dayCount = Math.max(1, Math.ceil((now - startDate) / msPerDay));
      const avgPerDay = totalRevenue / dayCount;

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      y += 10;
      doc.text("Average Revenue Per Day (from Start Order Date)", marginX, y);
      y += 8;

      autoTable(doc, {
        ...commonTableStyle,
        startY: y,
        head: [["Start Date", "Today", "Day Count", "Total Revenue", "Avg / Day"]],
        body: [[
          startDate.toLocaleDateString(),
          now.toLocaleDateString(),
          String(dayCount),
          `$${totalRevenue.toFixed(2)}`,
          `$${avgPerDay.toFixed(2)}`
        ]],
      });
      y = doc.lastAutoTable.finalY;
    }

    // ---------- Best & Worst Selling Products ----------
    if (topProducts.length) {
      const { best, worst } = pickExtremes(topProducts);

      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      y += 25; // Consistent vertical gap
      doc.text("Best & Worst Selling Products", marginX, y);
      y += 8;

      autoTable(doc, {
        ...commonTableStyle,
        startY: y,
        head: [["Metric", "Product", "Units Sold"]],
        body: [
          ["Best-selling", best?.name ?? "-", String(best?.totalSold ?? 0)],
          ["Lowest-selling", worst?.name ?? "-", String(worst?.totalSold ?? 0)],
        ],
      });
      y = doc.lastAutoTable.finalY;
    }

    // ---------- Sales (by selected range) ----------
    if (salesData.length) {
      y += 25; // Consistent vertical gap
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text(`Sales Performance (${timeRange})`, marginX, y);
      y += 8;

      autoTable(doc, {
        ...commonTableStyle,
        startY: y,
        head: [["Period", "Total Sales", "Orders"]],
        body: salesData.map(s => [
          String(s?._id ?? ""),
          `$${Number(s?.totalSales ?? 0).toFixed(2)}`,
          String(Number(s?.count ?? 0)),
        ]),
      });
      y = doc.lastAutoTable.finalY;
    }

    // ---------- Top Products ----------
    if (topProducts.length) {
      y += 25; // Consistent vertical gap
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Top Selling Products by Quantity", marginX, y);
      y += 8;

      autoTable(doc, {
        ...commonTableStyle,
        startY: y,
        head: [["Product", "Quantity Sold"]],
        body: topProducts.map(p => [String(p?.name ?? ""), String(Number(p?.totalSold ?? 0))]),
      });
      y = doc.lastAutoTable.finalY;
    }

    // ---------- Orders by Status ----------
    if (orderStatus.length) {
      y += 25; // Consistent vertical gap
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Order Status Distribution", marginX, y);
      y += 8;

      autoTable(doc, {
        ...commonTableStyle,
        startY: y,
        head: [["Order Status", "Total Orders"]],
        body: orderStatus.map(s => [String(s?._id ?? ""), String(Number(s?.count ?? 0))]),
      });
      y = doc.lastAutoTable.finalY;
    }

    // ---------- Revenue by Category ----------
    if (revenueByCategory.length) {
      y += 25; // Consistent vertical gap
      doc.setFont("helvetica", "bold");
      doc.setFontSize(14);
      doc.text("Revenue by Product Category", marginX, y);
      y += 8;

      autoTable(doc, {
        ...commonTableStyle,
        startY: y,
        head: [["Category", "Revenue"]],
        body: revenueByCategory.map(r => [
          String(r?._id ?? ""),
          `$${Number(r?.revenue ?? 0).toFixed(2)}`
        ]),
      });
    }

    // final footer (in case no new page was created by tables)
    drawFooter();

    doc.save("JW-Studio_Product_Sales_Report.pdf");
  };

  // load logo image (already imported at top)
  const img = new Image();
  img.crossOrigin = "anonymous";
  img.src = logo || "";
  img.onload  = () => render(img);
  img.onerror = () => render(null);
};

  const isReadyToDownload =
    !loading &&
    salesData.length > 0 &&
    topProducts.length > 0 &&
    orderStatus.length > 0 &&
    revenueByCategory.length > 0;

  // Calculate summary statistics for UI
  const totalRevenue = salesData.reduce((sum, item) => sum + Number(item?.totalSales ?? 0), 0);
  const totalOrders = salesData.reduce((sum, item) => sum + Number(item?.count ?? 0), 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
    <>
      <NavbarAdmin/>
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          {/* Header Section */}
          <div className="mb-8">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h2>
                <p className="text-gray-600 mt-2">Comprehensive overview of your business performance</p>
              </div>
              {isReadyToDownload && (
                <button
                  onClick={handleDownloadPDF}
                  className="mt-4 sm:mt-0 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  <svg className="-ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 10.586V3a1 1 0 112 0v7.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                  Download PDF Report
                </button>
              )}
            </div>

            {/* Time Range Selector (optional UI) */}
            <div className="mt-6 flex space-x-2">
              {/* e.g., buttons to set timeRange */}
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span className="ml-4 text-gray-600">Loading report data...</span>
            </div>
          ) : (
            <>
              {/* Summary Cards */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="rounded-md bg-indigo-100 p-3">
                          <svg className="h-6 w-6 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                          <dd className="text-lg font-medium text-gray-900">${totalRevenue.toFixed(2)}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="rounded-md bg-green-100 p-3">
                          <svg className="h-6 w-6 text-green-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Total Orders</dt>
                          <dd className="text-lg font-medium text-gray-900">{totalOrders}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white overflow-hidden shadow rounded-lg">
                  <div className="p-5">
                    <div className="flex items-center">
                      <div className="flex-shrink-0">
                        <div className="rounded-md bg-amber-100 p-3">
                          <svg className="h-6 w-6 text-amber-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                          </svg>
                        </div>
                      </div>
                      <div className="ml-5 w-0 flex-1">
                        <dl>
                          <dt className="text-sm font-medium text-gray-500 truncate">Avg. Order Value</dt>
                          <dd className="text-lg font-medium text-gray-900">${avgOrderValue.toFixed(2)}</dd>
                        </dl>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Charts Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Sales Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className="bg-indigo-100 text-indigo-800 p-2 rounded-md mr-2">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                      </svg>
                    </span>
                    Sales Over Time
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={salesData} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                          dataKey="_id" 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '6px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="totalSales" 
                          stroke="#4f46e5" 
                          strokeWidth={2}
                          dot={{ r: 4, fill: '#4f46e5' }}
                          activeDot={{ r: 6, fill: '#4f46e5' }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Top Products Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className="bg-green-100 text-green-800 p-2 rounded-md mr-2">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                      </svg>
                    </span>
                    Top Products
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={topProducts} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                          dataKey="name" 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '6px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Bar 
                          dataKey="totalSold" 
                          fill="#10b981" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Order Status Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className="bg-purple-100 text-purple-800 p-2 rounded-md mr-2">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                    </span>
                    Orders by Status
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={orderStatus}
                          dataKey="count"
                          nameKey="_id"
                          outerRadius={100}
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          labelLine={false}
                        >
                          {orderStatus.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={COLORS[index % COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '6px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Legend 
                          layout="vertical" 
                          verticalAlign="middle" 
                          align="right"
                          wrapperStyle={{ fontSize: '12px' }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>

                {/* Revenue by Category Chart */}
                <div className="bg-white p-6 rounded-lg shadow">
                  <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                    <span className="bg-amber-100 text-amber-800 p-2 rounded-md mr-2">
                      <svg className="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                      </svg>
                    </span>
                    Revenue by Category
                  </h3>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueByCategory} margin={{ top: 5, right: 20, bottom: 20, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#eee" />
                        <XAxis 
                          dataKey="_id" 
                          tick={{ fill: '#6b7280', fontSize: 12 }}
                          angle={-45}
                          textAnchor="end"
                          height={60}
                        />
                        <YAxis tick={{ fill: '#6b7280', fontSize: 12 }} />
                        <Tooltip 
                          formatter={(value) => [`$${value}`, 'Revenue']}
                          contentStyle={{ 
                            backgroundColor: 'white', 
                            borderRadius: '6px', 
                            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                            border: 'none'
                          }}
                        />
                        <Bar 
                          dataKey="revenue" 
                          fill="#f59e0b" 
                          radius={[4, 4, 0, 0]}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

export default AdminReports;
