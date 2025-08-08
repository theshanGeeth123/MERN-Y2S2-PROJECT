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

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042", "#8dd1e1"];

const AdminReports = () => {
  const [salesData, setSalesData] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [orderStatus, setOrderStatus] = useState([]);
  const [revenueByCategory, setRevenueByCategory] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReports = async () => {
    try {
      const [sales, top, status, category] = await Promise.all([
        axios.get("http://localhost:4000/api/reports/sales"),
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
  }, []);

const handleDownloadPDF = () => {
  const doc = new jsPDF();

  doc.setFont("helvetica"); // ✅ Set a clean, supported font
  doc.setFontSize(18);
  doc.text("WS-STUDIO Admin Report for Products Sales", 14, 20);  // 🛠️ Removed emoji from title

  doc.setFontSize(11);
  doc.setTextColor(100);
  doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

    let currentY = 40;

    if (salesData.length > 0) {
      autoTable(doc, {
        startY: currentY,
        head: [["Month", "Total Sales", "Orders"]],
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

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold text-gray-800">📊 Admin Reports</h2>
        {isReadyToDownload && (
          <button
            onClick={handleDownloadPDF}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
          >
            📄 Download PDF Report
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-center mt-10 text-gray-500">Loading report data...</p>
      ) : (
        <div className="space-y-12">
          {/* Sales Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">📈 Sales Over Time</h3>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={salesData}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="5 5" />
                <Line type="monotone" dataKey="totalSales" stroke="#8884d8" />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Top Products Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">🏆 Top Products</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={topProducts}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="totalSold" fill="#82ca9d" />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Order Status Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">📦 Orders by Status</h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={orderStatus}
                  dataKey="count"
                  nameKey="_id"
                  outerRadius={120}
                  label
                >
                  {orderStatus.map((entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={COLORS[index % COLORS.length]}
                    />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Revenue by Category Chart */}
          <div className="bg-white p-6 rounded shadow">
            <h3 className="text-xl font-semibold mb-4">💰 Revenue by Category</h3>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueByCategory}>
                <XAxis dataKey="_id" />
                <YAxis />
                <Tooltip />
                <CartesianGrid strokeDasharray="3 3" />
                <Bar dataKey="revenue" fill="#ff8042" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;
