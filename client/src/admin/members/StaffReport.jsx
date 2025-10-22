import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import {
  PieChart,
  Pie,
  Cell,
  Legend,
  ResponsiveContainer,
  Tooltip,
} from "recharts";
import NavbarAdmin from "../../components/NavbarAdmin";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/staff`
  : "http://localhost:4000/api/staff";

const COLORS = ["#f7c062", "#083b4a", "#ee706a", "#16a34a"];

const SummaryCard = ({ title, count, type }) => {
  let bgColor = "",
    textColor = "";
  if (type === "total") {
    bgColor = "bg-blue-100";
    textColor = "text-blue-700";
  } else if (type === "active") {
    bgColor = "bg-green-100";
    textColor = "text-green-700";
  } else if (type === "inactive") {
    bgColor = "bg-red-100";
    textColor = "text-red-700";
  }

  return (
    <div
      className={`${bgColor} border-l-4 p-6 rounded-lg shadow-md text-center`}
      style={{
        borderColor: textColor.replace("text", "").replace("-700", ""),
      }}
    >
      <p className="text-black font-medium">{title}</p>
      <p className={`text-3xl font-bold ${textColor} mt-2`}>{count}</p>
    </div>
  );
};


const StatusBadge = ({ isActive }) => (
  <span
    className={`px-3 py-1 rounded-full text-xs font-semibold ${
      isActive
        ? "bg-green-100 text-green-800"
        : "bg-red-100 text-red-800"
    }`}
  >
    {isActive ? "Active" : "Inactive"}
  </span>
);

export default function StaffReport() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get(API_BASE, { withCredentials: true });
        setStaff(data.staff || []);
      } catch {
        toast.error("Failed to load staff data.");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const today = new Date().toISOString().split("T")[0];

  const filteredStaff = useMemo(() => {
    if (!startDate || !endDate) return staff;
    return staff.filter((s) => {
      const created = new Date(s.createdAt);
      return created >= new Date(startDate) && created <= new Date(endDate);
    });
  }, [staff, startDate, endDate]);

  const totalCount = filteredStaff.length;
  const activeCount = filteredStaff.filter((s) => s.isActive).length;
  const inactiveCount = totalCount - activeCount;

  const roleData = useMemo(() => {
    const roles = {};
    filteredStaff.forEach(
      (s) => (roles[s.role] = (roles[s.role] || 0) + 1)
    );
    return Object.entries(roles).map(([name, value]) => ({ name, value }));
  }, [filteredStaff]);

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

  const exportPDF = async () => {
    if (!filteredStaff.length)
      return toast.error("No staff records found for selected dates.");

    try {
      const doc = new jsPDF("p", "pt", "a4");
      const width = doc.internal.pageSize.getWidth();
      const height = doc.internal.pageSize.getHeight();

      doc.setLineWidth(1.5);
      doc.rect(15, 15, width - 30, height - 30);

      let currentY = 30;

      // logo
      const logoUrl =
        "https://i.postimg.cc/sDyqHGKy/Whats-App-Image-2025-10-10-at-21-37-32.jpg";
      const logoBase64 = await getBase64ImageFromUrl(logoUrl);
      const logoWidth = 80,
        logoHeight = 80;
      doc.addImage(
        logoBase64,
        "JPEG",
        (width - logoWidth) / 2,
        currentY,
        logoWidth,
        logoHeight
      );
      currentY += logoHeight + 25;

      // Title
      doc.setFont("helvetica", "bold");
      doc.setFontSize(20);
      doc.text("JW Photography Studio", width / 2, currentY, {
        align: "center",
      });
      currentY += 30;

      doc.setFont("helvetica", "normal");
      doc.setFontSize(18);
      doc.text("Staff Report", width / 2, currentY, {
        align: "center",
      });
      currentY += 25;

      currentY += 10;

      // Date range & generated info 
      doc.setFontSize(12);
      doc.text(`Date Range: ${startDate} to ${endDate}`, 40, currentY);
      currentY += 18;
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 40, currentY);
      currentY += 25;

      // Summary
      doc.setFontSize(14);
      doc.text("Summary", 40, currentY);
      currentY += 20;
      doc.setFontSize(11);
      doc.text(`Total Staff: ${totalCount}`, 40, currentY);
      currentY += 15;
      doc.text(`Active Staff: ${activeCount}`, 40, currentY);
      currentY += 15;
      doc.text(`Inactive Staff: ${inactiveCount}`, 40, currentY);
      currentY += 25;

      // Role breakdown
      if (roleData.length > 0) {
        doc.setFontSize(12);
        doc.text("Role Breakdown:", 40, currentY);
        roleData.forEach((r) => {
          currentY += 15;
          doc.text(`• ${r.name}: ${r.value}`, 60, currentY);
        });
        currentY += 25;
      }

      // Table
      autoTable(doc, {
        startY: currentY,
        head: [["Name", "Email", "Phone", "Role", "Status", "Joined Date"]],
        body: filteredStaff.map((s) => [
          `${s.firstName} ${s.lastName}`,
          s.email,
          s.phone || "-",
          s.role,
          s.isActive ? "Active" : "Inactive", // Status
          new Date(s.createdAt).toLocaleDateString(),
        ]),
        theme: "grid",
        headStyles: {
          fillColor: [0, 0, 0],
          textColor: [255, 255, 255],
          halign: "center",
        },
        bodyStyles: {
          halign: "center",
          fontSize: 10,
          cellPadding: 10,
          textColor: [0, 0, 0], // default color
        },
        alternateRowStyles: { fillColor: [245, 245, 245] },
        margin: { left: 40, right: 40 },

        // Change Status text color dynamically
        didParseCell: (data) => {
          if (data.column.index === 4) { // Status column
            if (data.cell.text[0] === "Active") {
              data.cell.styles.textColor = [0, 128, 0]; // Green
            } else if (data.cell.text[0] === "Inactive") {
              data.cell.styles.textColor = [255, 0, 0]; // Red
            }
          }
        },
      });

      // Footer
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(50, 50, 50);
      doc.text(
        "© JW Photography Studio — All Rights Reserved",
        width / 2,
        height - 30,
        { align: "center" }
      );

      doc.save(`Staff_Report_${startDate}_to_${endDate}.pdf`);
    } catch (err) {
      console.error("PDF error:", err);
      toast.error("Failed to generate PDF");
    }
  };

  return (
    <>
      <NavbarAdmin />
      <div className="min-h-screen bg-gray-100 p-8 flex justify-center 2xl:min-w-[180px] 2xl:mx-20 xl:mx-15">
        <div className="w-full max-w-6xl bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <h1 className="text-4xl font-extrabold text-black mb-4 md:mb-0">
              Staff Report
            </h1>
            <div className="flex gap-3 items-center">
              <input
                type="date"
                value={startDate}
                max={today}
                onChange={(e) => setStartDate(e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="date"
                value={endDate}
                max={today}
                onChange={(e) => setEndDate(e.target.value)}
                className="border p-2 rounded"
              />
              <button
                onClick={exportPDF}
                className="bg-blue-800 hover:bg-blue-600 transition text-white px-5 py-2 rounded-lg shadow-md font-medium"
              >
                📄 Generate Report
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            <SummaryCard title="Total Staff" count={totalCount} type="total" />
            <SummaryCard title="Active Staff" count={activeCount} type="active" />
            <SummaryCard title="Inactive Staff" count={inactiveCount} type="inactive" />
          </div>

          {/* Chart */}
          <div className="flex justify-center mb-10">
            <div className="bg-gray-50 p-4 rounded-lg shadow-sm w-full md:w-1/2">
              <h3 className="text-lg font-semibold mb-3 text-gray-800 text-center">
                Role Distribution
              </h3>
              <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                  <Pie
                    data={roleData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={100}
                    label
                  >
                    {roleData.map((entry, index) => (
                      <Cell key={index} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend verticalAlign="bottom" />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="w-full md:w-11/12 mx-auto bg-white text-sm rounded-lg shadow-md overflow-hidden">
              <thead className="bg-black text-white">
                <tr>
                  {["Name", "Email", "Phone", "Role", "Status", "Joined Date"].map(
                    (col) => (
                      <th key={col} className="py-3 px-5">
                        {col}
                      </th>
                    )
                  )}
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-gray-500">
                      Loading...
                    </td>
                  </tr>
                ) : filteredStaff.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-5 text-gray-500">
                      No staff found in this date range
                    </td>
                  </tr>
                ) : (
                  filteredStaff.map((s, i) => (
                    <tr key={s._id} className={i % 2 === 0 ? "bg-gray-50" : "bg-white"}>
                      <td className="py-3 px-5 font-medium">
                        {s.firstName} {s.lastName}
                      </td>
                      <td className="py-3 px-5">{s.email}</td>
                      <td className="py-3 px-5">{s.phone || "-"}</td>
                      <td className="py-3 px-5 capitalize">{s.role}</td>
                      <td className="py-3 px-5">
                        <StatusBadge isActive={s.isActive} />
                      </td>
                      <td className="py-3 px-5">
                        {new Date(s.createdAt).toLocaleDateString()}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </>
  );
}
