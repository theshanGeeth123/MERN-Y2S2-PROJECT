import React, { useMemo, useRef } from "react";
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

const mRentalDepositChart = ({ chartData = [], loading, error }) => {
  const chartRef = useRef();

  // last 30 days data 
  const finalChartData = useMemo(() => {
    const today = new Date();
    const last30Days = [];

    for (let i = 29; i >= 0; i--) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      const dateStr = d.toISOString().split("T")[0];
      last30Days.push({ date: dateStr, amount: 0 });
    }

    const dailySums = chartData.reduce((acc, item) => {
      if (!item.date) return acc;
      const dateStr = new Date(item.date).toISOString().split("T")[0];
      if (!acc[dateStr]) acc[dateStr] = 0;
      acc[dateStr] += item.amount;
      return acc;
    }, {});

    return last30Days.map((d) => ({
      date: d.date,
      amount: dailySums[d.date] || 0,
    }));
  }, [chartData]);

  // Generate PDF for admin
  const handleDownloadPDF = async () => {
    if (!finalChartData || finalChartData.length === 0) return;

    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    let y = 40;

    // Report title
    pdf.setFontSize(20);
    pdf.setTextColor("#0036aa");
    const title = "Rental Deposit Income Report (Last 30 Days)";
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, y);
    y += 30;

    // Calculations 
    const totalIncome = finalChartData.reduce((sum, d) => sum + d.amount, 0);
    const dailyAvg = totalIncome / finalChartData.length;

    // Weekly totals
    const weeklyTotals = [];
    for (let i = 0; i < finalChartData.length; i += 7) {
      const weekData = finalChartData.slice(i, i + 7);
      const weekTotal = weekData.reduce((sum, d) => sum + d.amount, 0);
      weeklyTotals.push(weekTotal);
    }

    // Summary Section 
    pdf.setFontSize(14);
    pdf.setTextColor("#000");
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
    y += 20;

    // Daily Income Table
    pdf.setFontSize(14);
    pdf.setTextColor("#0036aa");
    pdf.text("Daily Income (Last 30 Days)", 40, y);
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

    // Row coloring based on amount range
    finalChartData.forEach((d) => {
      let color = "#000000"; // default

      if (d.amount <= 1000) {
        color = "#ff0000"; 
      } else if (d.amount > 1000 && d.amount <= 5000) {
        color = "#0000ff"; 
      } else if (d.amount > 5000) {
        color = "#008000"; 
      }

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

    // Add generated PDF timestamp
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

    // Save the PDF
    pdf.save("RentalDepositReport.pdf");
  };

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <h2 className="text-lg font-semibold text-slate-800 mb-4">
        Rental Deposit Chart (Last 30 Days)
      </h2>

      {loading ? (
        <p>Loading chart...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : finalChartData.length === 0 ? (
        <p>No accepted rental deposits in the last 30 days.</p>
      ) : (
        <>
          {/* Chart display */}
          <div ref={chartRef} className="w-full h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={finalChartData}>
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

          {/* Download button */}
          <div className="mt-4 text-center">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-900 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Download Admin Report
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default mRentalDepositChart;
