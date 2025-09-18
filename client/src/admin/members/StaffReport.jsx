import React, { useEffect, useState, useMemo } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable"; 
import { PieChart, Pie, Cell, Legend, ResponsiveContainer } from "recharts";

const API_BASE = import.meta.env.VITE_BACKEND_URL
  ? `${import.meta.env.VITE_BACKEND_URL}/api/staff`
  : "http://localhost:4000/api/staff";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50"];

export default function StaffReport() {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const { data } = await axios.get(API_BASE, { withCredentials: true });
        setStaff(data.staff || []);
      } catch {
        toast.error("Failed to load staff report");
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  const roleData = useMemo(() => {
    const roles = {};
    staff.forEach(s => roles[s.role] = (roles[s.role] || 0) + 1);
    return Object.entries(roles).map(([name, value]) => ({ name, value }));
  }, [staff]);

  const statusData = useMemo(() => {
    const active = staff.filter(s => s.isActive).length;
    const inactive = staff.length - active;
    return [
      { name: "Active", value: active },
      { name: "Inactive", value: inactive },
    ];
  }, [staff]);

  const exportPDF = () => {
    if (!staff.length) {
      toast.error("No staff data to export");
      return;
    }

    const doc = new jsPDF("p", "pt", "a4");

    doc.setFontSize(18);
    doc.text(
      "JW Photography Studio Staff Report",
      doc.internal.pageSize.getWidth() / 2,
      30,
      { align: "center" }
    );

    const now = new Date();
    const formattedDateTime = `${now.toLocaleDateString()} ${now.toLocaleTimeString()}`;
    doc.setFontSize(12);
    doc.text(
      `Generated on: ${formattedDateTime}`,
      doc.internal.pageSize.getWidth() / 2,
      60, 
      { align: "center" }
    );

    const tableColumn = ["Name", "Email", "Phone", "Role", "Status"];
    const tableRows = staff.map(s => [
      `${s.firstName} ${s.lastName}`,
      s.email,
      s.phone || "-",
      s.role,
      s.isActive ? "Active" : "Inactive",
    ]);

    autoTable(doc, {
      startY: 90, 
      head: [tableColumn],
      body: tableRows,
      theme: "grid",
      headStyles: {
        fillColor: [0, 51, 102],
        textColor: [255, 255, 255],
        halign: "center",
        fontSize: 12,
      },
      bodyStyles: {
        halign: "center",
        fontSize: 11,
        cellPadding: 15,
        lineHeight: 2,
      },
      alternateRowStyles: { fillColor: [245, 245, 245] },
      margin: { left: 20, right: 20 },
      didDrawPage: (data) => {
        const pageCount = doc.internal.getNumberOfPages();
        doc.setFontSize(10);
        doc.text(
          `Page ${pageCount}`,
          doc.internal.pageSize.getWidth() - 50,
          doc.internal.pageSize.getHeight() - 10
        );
      },
    });

    doc.save("Staff_Report.pdf");
  };

  return (
    <div className="min-h-screen p-8 bg-gray-50 flex flex-col items-center">
      <div className="w-full max-w-6xl bg-white p-6 rounded-xl shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 text-center">
          Staff Report
        </h1>

        <div className="flex justify-center mb-6">
          <button
            onClick={exportPDF}
            className="bg-blue-700 text-white px-6 py-2 rounded-lg hover:bg-blue-900 shadow transition"
          >
            📄 Download PDF Report
          </button>
        </div>

        {loading ? (
          <p className="text-center">Loading...</p>
        ) : (
          <>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div className="bg-gray-100 p-4 rounded shadow text-center">
                <h2 className="text-xl font-semibold mb-2">Role Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={roleData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {roleData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-gray-100 p-4 rounded shadow text-center">
                <h2 className="text-xl font-semibold mb-2">Status Distribution</h2>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusData}
                      dataKey="value"
                      nameKey="name"
                      cx="50%"
                      cy="50%"
                      outerRadius={80}
                      label
                    >
                      {statusData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Legend verticalAlign="bottom" height={36} />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            
            <div className="overflow-x-auto">
              <table className="w-full max-w-[1000px] mx-auto bg-white rounded-lg shadow-lg border border-gray-300">
                <thead className="bg-blue-900 text-white text-center">
                  <tr>
                    <th className="py-3 px-6">Name</th>
                    <th className="py-3 px-6">Email</th>
                    <th className="py-3 px-6">Phone</th>
                    <th className="py-3 px-6">Role</th>
                    <th className="py-3 px-6">Status</th>
                  </tr>
                </thead>
                <tbody className="text-center">
                  {staff.map((s, index) => (
                    <tr
                      key={s._id}
                      className={`border-b transition hover:bg-gray-100 ${
                        index % 2 === 0 ? "bg-gray-50" : "bg-white"
                      }`}
                    >
                      <td className="py-3 px-6 font-medium">{s.firstName} {s.lastName}</td>
                      <td className="py-3 px-6">{s.email}</td>
                      <td className="py-3 px-6">{s.phone || "-"}</td>
                      <td className="py-3 px-6 capitalize">{s.role}</td>
                      <td className="py-3 px-6">
                        {s.isActive ? (
                          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-sm font-semibold text-green-800">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-800">
                            Inactive
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
