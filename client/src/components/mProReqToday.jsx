// components/MProReqToday.jsx
import React, { useEffect, useRef } from "react";
import { useRequestStore } from "../mstore/mRequestStore";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";

const MProReqToday = () => {
  const { processedRequests = [], fetchAllProcessedRequests, loading, error } =
    useRequestStore();
  const containerRef = useRef();

  useEffect(() => {
    fetchAllProcessedRequests("all");
  }, [fetchAllProcessedRequests]);

  const handleDownloadTodayPDF = async () => {
    if (!containerRef.current) return;

    const pdf = new jsPDF({ orientation: "portrait", unit: "px", format: "a4" });
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 20;

    const tableRows = Array.from(containerRef.current.querySelectorAll("tr"));
    let positionY = margin;

    for (let i = 0; i < tableRows.length; i++) {
      const row = tableRows[i];
      const canvas = await html2canvas(row, { scale: 2 });
      const imgData = canvas.toDataURL("image/png");
      const imgProps = pdf.getImageProperties(imgData);
      const imgWidth = pageWidth - margin * 2;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      if (positionY + imgHeight > pageHeight - margin) {
        pdf.addPage();
        positionY = margin;
      }

      pdf.addImage(imgData, "PNG", margin, positionY, imgWidth, imgHeight);
      positionY += imgHeight;
    }

    pdf.save("TodayProcessedRequests.pdf");
  };

  if (loading) return <p>Loading processed requests...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  const todayStr = new Date().toISOString().split("T")[0];
  const todayRequests = processedRequests.filter((r) => {
    if (!r.processedAt) return false;
    return new Date(r.processedAt).toISOString().split("T")[0] === todayStr;
  });

  return (
    <div className="bg-white shadow-md rounded-xl p-6 w-full">
      <h1 className="text-2xl font-semibold text-slate-800 mb-15 text-center">
        Processed Requests of Today
      </h1>


      <div ref={containerRef} className="overflow-x-auto">
        <table className="min-w-full text-left text-sm border">
          <thead className="bg-gray-100">
            <tr>
              <th className="py-2 px-4 border">Items</th>
              <th className="py-2 px-4 border">Amount</th>
              <th className="py-2 px-4 border">Email</th>
              <th className="py-2 px-4 border">Status</th>
              <th className="py-2 px-4 border">Processed At</th>
            </tr>
          </thead>
          <tbody>
            {todayRequests.length === 0 ? (
              <tr>
                <td className="py-2 px-4 border" colSpan={5}>
                  No processed requests today.
                </td>
              </tr>
            ) : (
              todayRequests.map((req) => (
                <tr key={req._id}>
                  <td className="py-2 px-4 border">
                    {Array.isArray(req.items)
                      ? req.items.map((i) => i.name).join(", ")
                      : req.items}
                  </td>
                  <td className="py-2 px-4 border">{req.amount ?? "-"}</td>
                  <td className="py-2 px-4 border">{req.email ?? "-"}</td>
                  <td className="py-2 px-4 border">{req.status ?? "-"}</td>
                  <td className="py-2 px-4 border">
                    {req.processedAt
                      ? new Date(req.processedAt).toLocaleString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      {todayRequests.length > 0 && (
        <div className="mb-4 text-center mt-5">
          <button
            onClick={handleDownloadTodayPDF}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700"
          >
            Download PDF
          </button>
        </div>
      )}

    </div>
  );
};

export default MProReqToday;
