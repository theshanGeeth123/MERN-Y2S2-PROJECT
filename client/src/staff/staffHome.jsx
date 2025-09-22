import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useStaffAuth } from "./StaffAuthContext";

const StaffHome = () => {
  const { logoutStaff, staff } = useStaffAuth();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");

  const handleLogout = () => {
    logoutStaff();
    navigate("/staff/login");
  };

  
  const statsData = [
    { title: "Pending Tasks", value: 12, trend: "down", change: 2 },
    { title: "Appointments", value: 8, trend: "up", change: 3 },
    { title: "Reports", value: 5, trend: "stable", change: 0 },
    { title: "Messages", value: 3, trend: "up", change: 1 }
  ];

  const recentActivities = [
    { action: "Approved appointment for User123", time: "2 hours ago", icon: "✔" },
    { action: "Generated monthly report", time: "4 hours ago", icon: "📊" },
    { action: "Processed payment successfully", time: "Yesterday", icon: "💳" },
    { action: "Responded to customer inquiry", time: "Yesterday", icon: "✉️" }
  ];

  return (
    <div className="flex h-screen bg-gray-50">
      
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-40 z-20 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      
      <div
        className={`fixed inset-y-0 left-0 z-30 w-64 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0 md:static`}
      >
        
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-800">
          <h2 className="text-xl font-bold text-white">Staff Portal</h2>
          
          <button
            className="md:hidden text-gray-400 hover:text-white text-xl"
            onClick={() => setSidebarOpen(false)}
          >
            ✕
          </button>
        </div>

        
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-lg">
              {/* {staff?.name ? staff.name.charAt(0).toUpperCase() : 'U'} */}
              {staff?.firstName ? staff.firstName.charAt(0).toUpperCase() : 'S'}
            </div>

           
            <div className="ml-4">
              <h3 className="text-white font-medium">{staff.firstName}</h3>
              <p className="text-gray-400 text-sm">{staff?.role || "Staff Member"}</p>
            </div>
          </div>
        </div>

        
        <nav className="px-4 py-6 space-y-1">
          <button
            onClick={() => {
              setActiveTab("dashboard");
              setSidebarOpen(false);
            }}
            className={`flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200 ${activeTab === "dashboard" ? "bg-gray-800 text-white" : ""}`}
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
            </svg>
            Dashboard
          </button>


          <button
            onClick={() => {
              navigate("/staff/profile");
              setSidebarOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
            </svg>
            Profile
          </button>

         {  staff.role === 'photographer' && <button
            onClick={() => {
              navigate("/staff/packages");
              setSidebarOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Packages
          </button>}

            {  staff.role === 'manager' && 
             <button
            onClick={() => {
              navigate("/staff/customerManage");
              setSidebarOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Customer Details
          </button>}

          {/* <button
            onClick={() => {
              navigate("/staff/settings");
              setSidebarOpen(false);
            }}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-gray-300 hover:bg-gray-800 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path>
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
            </svg>
            Settings
          </button> */}



          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-red-400 hover:bg-red-900 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logout
          </button>
{/* 
          { staff.role === 'photographer' &&
          <button
            onClick={handleLogout}
            className="flex items-center w-full text-left px-4 py-3 rounded-md text-red-400 hover:bg-red-900 hover:text-white transition-colors duration-200"
          >
            <svg className="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
            Logouttt
          </button>} */}
        </nav>
      </div>

      
      <div className="flex flex-col flex-1 overflow-hidden">
        
      

        
        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-800">Welcome back, {staff?.name || "Staff Member"}!</h2>
            <p className="text-gray-600">Here's what's happening with your account today.</p>
          </div>

          
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4 mb-8">
            {statsData.map((stat, index) => (
              <div key={index} className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 hover:shadow-md transition-shadow duration-200">
                <h3 className="text-sm font-medium text-gray-500 mb-2">{stat.title}</h3>
                <div className="flex items-baseline justify-between">
                  <p className="text-3xl font-bold text-gray-800">{stat.value}</p>
                  <span className={`flex items-center text-sm font-medium ${stat.trend === "up" ? "text-green-600" : stat.trend === "down" ? "text-red-600" : "text-gray-600"}`}>
                    {stat.trend === "up" ? (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
                      </svg>
                    ) : stat.trend === "down" ? (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"></path>
                      </svg>
                    ) : null}
                    {stat.change !== 0 ? `${stat.change}%` : 'No change'}
                  </span>
                </div>
              </div>
            ))}
          </div>

          
          <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-semibold text-gray-800">Recent Activity</h3>
              <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all</button>
            </div>
            
            <ul className="space-y-4">
              {recentActivities.map((activity, index) => (
                <li key={index} className="flex items-start">
                  <div className="flex-shrink-0 mt-1 mr-3 text-blue-600">{activity.icon}</div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-800">{activity.action}</p>
                    <p className="text-sm text-gray-500">{activity.time}</p>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </main>
      </div>
    </div>
  );
};

export default StaffHome;