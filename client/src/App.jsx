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
import CustomerFeedbackEdit from './pages/CustomerFeedbackEdit'
import CustomerQuestionsAnswers from './pages/CustomerQuestionsAnswers'

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
        <Route path='/customer-feedback/edit' element={<CustomerFeedbackEdit/>}/>
        <Route path='/customer-questions-answers' element={<CustomerQuestionsAnswers/>}/>

        {/* admin */}

        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>

      </Routes>
    </div>
  )
}

export default App
