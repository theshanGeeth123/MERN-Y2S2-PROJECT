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

import Notifications from './admin/T_Notifications/Notifications.jsx'
import NotificationDetail from './admin/T_Notifications/NotificationDetail.jsx'
import NotificationEdit from './admin/T_Notifications/NotificationEdit.jsx'
import NotificationCreate from './admin/T_Notifications/NotificationCreate.jsx'

function App() {
  return (
    <div>
      <ToastContainer/>
      <Routes>
        <Route path='/' element={<Notifications/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/email-verify' element={<EmailVerify/>}/>
        <Route path='/reset-password' element={<ResetPassword/>}/>
        <Route path='/my-profile' element={<MyProfile/>}/>
        <Route path='/customer-home' element={<CustomerHome/>}/>
        

        {/* admin */}

        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path="/admin/user-reports" element={<UsersReport />} />


        {/* Notifications  */}
        <Route path="/admin/notifications" element={<Notifications />} />
<Route path="/admin/notifications/create" element={<NotificationCreate />} />
<Route path="/admin/notifications/:id" element={<NotificationDetail />} />
<Route path="/admin/notifications/:id/edit" element={<NotificationEdit />} />

      </Routes>
    </div>
  )
}

export default App
