// pages/AdminHome.jsx
import React, { useEffect, useRef } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useRequestStore } from "../mstore/mRequestStore";
import RentalDepositChart from "../components/mRentalDepositChart";
import ProcessedRequests from "../components/mProReqTable";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

function AdminHome() {
  const { chartData = [], fetchAcceptedChartData, loading, error } = useRequestStore();

  const topStatsRef = useRef();
  const chartRef = useRef();
  const recentTableRef = useRef();

  useEffect(() => {
    fetchAcceptedChartData();
  }, [fetchAcceptedChartData]);

  const handleDownloadPDF = async () => {
    const pdf = new jsPDF({ orientation: "landscape", unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    let yOffset = 20;

    const title = "Rental Deposit Revenue Report";
    pdf.setFontSize(24);
    pdf.setTextColor("#2563eb");
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, yOffset);
    yOffset += 40;

    const sections = [
      { ref: topStatsRef },
      { ref: chartRef },
      { ref: recentTableRef },
    ];

    for (let section of sections) {
      if (!section.ref.current) continue;
      const canvas = await html2canvas(section.ref.current, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const ratio = Math.min(
        pageWidth / canvas.width,
        (pdf.internal.pageSize.getHeight() - yOffset) / canvas.height
      );
      const x = (pageWidth - canvas.width * ratio) / 2;
      pdf.addImage(imgData, "PNG", x, yOffset, canvas.width * ratio, canvas.height * ratio);
      yOffset += canvas.height * ratio + 10;
    }

    pdf.save("RentalDepositReport.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      <div className="p-6 space-y-6">

        {/* Top Stats */}
        <div ref={topStatsRef} className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Total Users</h2>
            <p className="text-2xl font-bold text-slate-800 mt-2">1,240</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Active Rentals</h2>
            <p className="text-2xl font-bold text-slate-800 mt-2">320</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Payments</h2>
            <p className="text-2xl font-bold text-slate-800 mt-2">Rs. 56,000</p>
          </div>
          <div className="bg-white shadow-md rounded-xl p-5">
            <h2 className="text-gray-500 text-sm">Revenue</h2>
            <p className="text-2xl font-bold text-green-600 mt-2">Rs. 1.2M</p>
          </div>
        </div>

        {/* Chart */}
        <div ref={chartRef}>
          <RentalDepositChart chartData={chartData} loading={loading} error={error} />
        </div>

        {/* Recent Activity Table */}
        <ProcessedRequests limit={5} refProp={recentTableRef} />


      </div>
    </div>
  );
}

export default AdminHome;
