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

import StaffList from "./admin/members/StaffList";
import StaffCreate from "./admin/members/StaffCreate";
import StaffDetail from "./admin/members/StaffDetail";

import StaffHome from "./staff/staffHome.jsx";
import StaffLogin from "./staff/StaffLogin.jsx";


import StaffProfile from "./staff/StaffProfile";

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

        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/home" element={<StaffHome />} />

        <Route path="/admin/staff" element={<StaffList />} />
        <Route path="/admin/staff/create" element={<StaffCreate />} />
        <Route path="/admin/staff/:id" element={<StaffDetail />} />

        <Route path="/staff/profile" element={<StaffProfile />} />

      </Routes>
    </div>
  )
}

export default App
