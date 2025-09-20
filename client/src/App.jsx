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
import CustomerFeedback from './pages/CustomerFeedback'
import CustomerQuestion from './pages/CustomerQuestion'
import AdminFeedback from './admin/AdminFeedbackHandler'
import AdminQuestion from './admin/AdminQuestionHandler'


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
        <Route path='/customer-feedback' element={<CustomerFeedback/>}/>
        <Route path='/customer-questions' element={<CustomerQuestion/>}/>

        {/* admin */}

        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path='/admin/admin-feedback' element={<AdminFeedback/>}/>
        <Route path='/admin/admin-question' element={<AdminQuestion/>}/>

      </Routes>
    </div>
  )
}

export default App
