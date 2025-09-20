// components/mRentalDepositChart.jsx
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
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const mRentalDepositChart = ({ chartData = [], loading, error }) => {
  const chartRef = useRef();

  // Prepare last 30 days data with 0 for missing days
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

  // Download chart as A4 PDF
  const handleDownloadPDF = async () => {
    if (!chartRef.current) return;

    const canvas = await html2canvas(chartRef.current, { scale: 2 });
    const imgData = canvas.toDataURL("image/png");

    const pdf = new jsPDF({
      orientation: "landscape",
      unit: "px",
      format: "a4",
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    // PDF title
    const title = "Rental Deposit Revenue";
    pdf.setFontSize(24);
    pdf.setTextColor("#2563eb");
    const titleWidth = pdf.getTextWidth(title);
    pdf.text(title, (pageWidth - titleWidth) / 2, 40);

    // Scale chart to fit below title
    const ratio = Math.min(pageWidth / canvas.width, (pageHeight - 80) / canvas.height);
    const x = (pageWidth - canvas.width * ratio) / 2;
    const y = 60;

    pdf.addImage(imgData, "PNG", x, y, canvas.width * ratio, canvas.height * ratio);
    pdf.save("RentalDepositChart.pdf");
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
                  stroke="#2563eb"
                  strokeWidth={2}
                  dot={{ r: 4 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-4 text-center">
            <button
              onClick={handleDownloadPDF}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
            >
              Download PDF
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default mRentalDepositChart;
