import React, { useMemo, useRef, useState } from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts";
import jsPDF from "jspdf";
import logo from "./Main_Logo.png";

const mRentalDepositChart = ({ chartData = [], loading, error }) => {
  const chartRef = useRef();
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  // Filter and prepare chart data
  const filteredChartData = useMemo(() => {
    if (!startDate || !endDate) return [];

    const start = new Date(startDate);
    const end = new Date(endDate);
    end.setHours(0, 0, 0, 0);

    const rangeDays = [];
    for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split("T")[0];
      rangeDays.push({ date: dateStr, amount: 0 });
    }

    const dailySums = chartData.reduce((acc, item) => {
      if (!item.date) return acc;
      const dateStr = new Date(item.date).toISOString().split("T")[0];
      if (dateStr >= startDate && dateStr <= endDate) {
        if (!acc[dateStr]) acc[dateStr] = 0;
        acc[dateStr] += item.amount;
      }
      return acc;
    }, {});

    return rangeDays.map((d) => ({
      date: d.date,
      amount: dailySums[d.date] || 0,
    }));
  }, [chartData, startDate, endDate]);

  // Generate PDF
  const handleDownloadPDF = async () => {
    if (!filteredChartData || filteredChartData.length === 0) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 20; 

    // Logo 
    const imgWidth = 55;
    const imgHeight = 55;
    const imgX = (pageWidth - imgWidth) / 2;
    pdf.addImage(logo, "PNG", imgX, y, imgWidth, imgHeight);

    // Title
    y += imgHeight + 18;
    pdf.setFontSize(20);
    pdf.setTextColor("#0036aa");
    pdf.setFont("helvetica", "bold");
    const title = `Rental Deposit Report (${startDate} to ${endDate})`;
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, y);

    // Header line
    y += 15;
    pdf.setDrawColor(150);
    pdf.line(40, y, pageWidth - 40, y);
    y += 20;

    // Color Meaning Legend
    pdf.setFontSize(13);
    pdf.setFont("helvetica", "normal");
    pdf.setTextColor("#000000");
    pdf.text("Color Legend:", 40, y);
    y += 15;
    pdf.setFontSize(12);

    // Red = low, Blue = medium, Green = high
    const legendX = 60;
    const boxSize = 8;
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    // Low Income
    pdf.setFillColor(255, 0, 0);
    pdf.rect(legendX, y - 6, boxSize, boxSize, "F");
    pdf.setTextColor("#000000");
    pdf.text("Low Income (< Rs. 1001)", legendX + 15, y);
    y += 15;

    // Moderate Income
    pdf.setFillColor(0, 0, 255);
    pdf.rect(legendX, y - 6, boxSize, boxSize, "F");
    pdf.setTextColor("#000000");
    pdf.text("Moderate Income (Rs. 1001 - 5000)", legendX + 15, y);
    y += 15;

    // High Income
    pdf.setFillColor(0, 128, 0);
    pdf.rect(legendX, y - 6, boxSize, boxSize, "F");
    pdf.setTextColor("#000000");
    pdf.text("High Income (> Rs. 5000)", legendX + 15, y);
    y += 25;

    // Summary calculations
    const totalIncome = filteredChartData.reduce((sum, d) => sum + d.amount, 0);
    const dailyAvg = totalIncome / filteredChartData.length;

    // Weekly totals
    const weeklyTotals = [];
    for (let i = 0; i < filteredChartData.length; i += 7) {
      const weekData = filteredChartData.slice(i, i + 7);
      const weekTotal = weekData.reduce((sum, d) => sum + d.amount, 0);
      weeklyTotals.push(weekTotal);
    }

    // Summary section
    pdf.setTextColor("#000");
    pdf.setFontSize(14);
    pdf.text(`Total Income: Rs. ${totalIncome.toFixed(2)}`, 40, y);
    y += 20;
    pdf.text(`Daily Average: Rs. ${dailyAvg.toFixed(2)}`, 40, y);
    y += 20;
    pdf.text("Weekly Totals (Rs):", 40, y);
    y += 20;

    weeklyTotals.forEach((w, i) => {
      pdf.text(`Week ${i + 1}: Rs. ${w.toFixed(2)}`, 60, y);
      y += 18;
    });
    y += 25;

    // Daily income table
    pdf.setFontSize(14);
    pdf.setTextColor("#0036aa");
    pdf.text("Daily Income", 40, y);
    y += 15;

    const cellX = 40;
    const cellWidth = 150;
    const amountX = cellX + cellWidth + 10;

    pdf.setFontSize(12);
    pdf.setTextColor("#000");
    pdf.text("Date", cellX, y);
    pdf.text("Income (Rs)", amountX, y);
    y += 10;
    pdf.setDrawColor(0);
    pdf.line(cellX, y, pageWidth - 40, y);
    y += 10;

    // Table rows (color-coded)
    filteredChartData.forEach((d) => {
      let color = "#000000";
      if (d.amount <= 1000) color = "#ff0000";
      else if (d.amount > 1000 && d.amount <= 5000) color = "#0000ff";
      else if (d.amount > 5000) color = "#008000";

      pdf.setTextColor("#000");
      pdf.text(d.date, cellX, y);
      pdf.setTextColor(color);
      pdf.text(`Rs. ${d.amount.toFixed(2)}`, amountX, y);

      y += 15;
      if (y > pdf.internal.pageSize.getHeight() - 60) {
        pdf.addPage();
        y = 40;
      }
    });

    // Timestamp
    const generatedAt = new Date();
    const formattedTime = generatedAt.toLocaleString("en-LK", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });

    pdf.setFontSize(11);
    pdf.setTextColor("#666");
    pdf.text(
      `PDF generated on: ${formattedTime}`,
      40,
      pdf.internal.pageSize.getHeight() - 20
    );

    pdf.save(`RentalDepositReport_${startDate}_to_${endDate}.pdf`);
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Rental Deposit Chart (Custom Date Range)
      </h2>

      {/* Date Range Inputs */}
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div>
          <label className="block text-sm text-gray-700 mb-1">Start Date:</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            max={new Date().toISOString().split("T")[0]}
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-700 mb-1">End Date:</label>
          <input
            type="date"
            className="border px-3 py-2 rounded w-full"
            min={startDate}
            max={new Date().toISOString().split("T")[0]} // prevent future
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
          />
        </div>
      </div>

      {/* Chart Section */}
      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : !startDate || !endDate ? (
        <p>Please select a start and end date to generate the report.</p>
      ) : filteredChartData.length === 0 ? (
        <p>No rental deposit data found in the selected range.</p>
      ) : (
        <>
          <div ref={chartRef} className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={filteredChartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  dataKey="date"
                  tickFormatter={(dateStr) => {
                    const d = new Date(dateStr);
                    return `${d.getDate()}/${d.getMonth() + 1}`;
                  }}
                />
                <YAxis />
                <Tooltip
                  labelFormatter={(dateStr) => {
                    const d = new Date(dateStr);
                    return d.toDateString();
                  }}
                />
                <Line
                  type="linear"
                  dataKey="amount"
                  stroke="#0036aaff"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Download PDF */}
          <div className="mt-4 text-center">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Download Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default mRentalDepositChart;
