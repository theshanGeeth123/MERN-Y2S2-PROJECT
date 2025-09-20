// pages/AdminHome.jsx
import React, { useEffect, useRef } from "react";
import AdminNavbar from "../components/AdminNavbar";
import { useRequestStore } from "../mstore/mRequestStore";
import TodayProcessedRequests from "../components/mProReqToday";


function AdminHome() {

  return (
    <div className="min-h-screen bg-gray-100">
      <AdminNavbar />
      
        <div>
          <TodayProcessedRequests/>
        </div>
        
    </div>
  );
}

export default AdminHome;
