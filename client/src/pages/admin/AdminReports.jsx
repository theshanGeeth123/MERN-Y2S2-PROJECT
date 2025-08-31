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

      setSalesData(sales.data.data || []);
      setTopProducts(top.data.data || []);
      setOrderStatus(status.data.data || []);
      setRevenueByCategory(category.data.data || []);
    } catch (err) {
      console.error("Error fetching reports:", err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, [timeRange]);

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFont("helvetica");
    doc.setFontSize(18);
    doc.text("WS-STUDIO Admin Report for Products Sales", 14, 20);

    doc.setFontSize(11);
    doc.setTextColor(100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    let currentY = 40;

    if (salesData.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Period", "Total Sales", "Orders"]],
        body: salesData.map((s) => [s._id, `$${s.totalSales.toFixed(2)}`, s.count]),
        theme: "grid",
        headStyles: { fillColor: [22, 160, 133] },
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    if (topProducts.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Product", "Quantity Sold"]],
        body: topProducts.map((p) => [p.name, p.totalSold]),
        theme: "grid",
        headStyles: { fillColor: [52, 152, 219] },
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    if (orderStatus.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Order Status", "Total Orders"]],
        body: orderStatus.map((s) => [s._id, s.count]),
        theme: "grid",
        headStyles: { fillColor: [155, 89, 182] },
      });
      currentY = doc.lastAutoTable.finalY + 10;
    }

    if (revenueByCategory.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Category", "Revenue"]],
        body: revenueByCategory.map((r) => [r._id, `$${r.revenue.toFixed(2)}`]),
        theme: "grid",
        headStyles: { fillColor: [241, 196, 15] },
      });
    }

    doc.save("Admin_Report.pdf");
  };

  const isReadyToDownload =
    !loading &&
    salesData.length > 0 &&
    topProducts.length > 0 &&
    orderStatus.length > 0 &&
    revenueByCategory.length > 0;

  // Calculate summary statistics
  const totalRevenue = salesData.reduce((sum, item) => sum + item.totalSales, 0);
  const totalOrders = salesData.reduce((sum, item) => sum + item.count, 0);
  const avgOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

  return (
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
          
          {/* Time Range Selector */}
          <div className="mt-6 flex space-x-2">
            <button
              onClick={() => setTimeRange("weekly")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${timeRange === "weekly" ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Weekly
            </button>
            <button
              onClick={() => setTimeRange("monthly")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${timeRange === "monthly" ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Monthly
            </button>
            <button
              onClick={() => setTimeRange("quarterly")}
              className={`px-4 py-2 text-sm font-medium rounded-md ${timeRange === "quarterly" ? 'bg-indigo-100 text-indigo-700' : 'text-gray-600 hover:bg-gray-100'}`}
            >
              Quarterly
            </button>
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
  );
};

export default AdminReports;