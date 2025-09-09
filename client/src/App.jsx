import React from 'react'

import {Routes,Route} from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import EmailVerify from './pages/EmailVerify'
import ResetPassword from './pages/ResetPassword'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin section

import AdminLogin from './admin/AdminLogin'
import AdminHome from './admin/AdminHome'
import MyProfile from './pages/MyProfile'
import CustomerHome from './pages/CustomerHome'
import UsersReport from "./pages/admin/UsersReport.jsx";


// Admin Notifications pages
import Notifications from './admin/T_Notifications/Notifications';
import NotificationDetail from './admin/T_Notifications/NotificationDetail';
import NotificationCreate from './admin/T_Notifications/NotificationCreate';

import CustomerNotifications from "./T_Customer/T_Cus_notifications/CustomerNotifications";

import CustomerManagement from './admin/T_Customer/CustomerManage.jsx';


function App() {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/customer-home' element={<CustomerHome/>}/>
        

        {/* admin */}

        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path="/admin/user-reports" element={<UsersReport />} />


         {/*Admin Notifications routes */}
        <Route path='/admin/notifications' element={<Notifications />} />
        <Route path='/admin/notifications/create' element={<NotificationCreate />} />
        <Route path='/admin/notifications/:id' element={<NotificationDetail />} />

        <Route path="/notifications" element={<CustomerNotifications />} />


        {/*Admin Cusomer Management routes */}


         <Route path="/customerManagement" element={<CustomerManagement />} />


  

      </Routes>
    </div>
  )
}

export default App
