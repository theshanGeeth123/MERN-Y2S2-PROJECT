import React, { useEffect, useRef } from "react";
import AdminNavbar from "../components/NavbarAdmin";
import { useRequestStore } from "../mstore/mRequestStore";
import TodayProcessedRequests from "../components/mProReqToday";
import RentalDepositChart from "../components/mRentalDepositChart";
import ProcessedRequests from "../components/mProReqTable";



function AdminHome() {
 const { chartData = [], fetchAcceptedChartData, loading, error } = useRequestStore();

  const topStatsRef = useRef();
  const chartRef = useRef();
  const recentTableRef = useRef();

  useEffect(() => {
    fetchAcceptedChartData();
  }, [fetchAcceptedChartData]);


  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
    <div className="p-6 space-y-6">


          {/* Chart */}
        <div ref={chartRef}>
          <RentalDepositChart chartData={chartData} loading={loading} error={error} />
        </div>

        <div>
          <TodayProcessedRequests/>
        </div>
        {/* Recent Activity */}
        <ProcessedRequests limit={5} refProp={recentTableRef} />
    </div>  

        

          
    </div>
  );
}

export default AdminHome;
