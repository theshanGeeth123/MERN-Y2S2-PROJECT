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
import MRental from './pages/MRental'
import MRentPage from "./pages/MRentPage";
import MRentalCus from "./pages/MRentalsCus";
import MRentalCart from "./pages/MRentalCart";
import MPaymentPage from "./pages/MRentalPayment";
import MItemCardCus from "./components/MItemCardCus";
import MPayment from "./pages/MPayment";
import MSuccess from "./pages/mPaySuccess";


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

        <Route path='/all-rentals' element={<MRentalCus/>}/>
        <Route path="/item" element={<MItemCardCus />} />
        <Route path="/cart" element={<MRentalCart />} />
        <Route path="/payment" element={<MPaymentPage />} />
        <Route path="/payment/create-payment-intent" element={<MPayment />} />
        <Route path="/payment/success" element={<MSuccess />} />

        

        {/* admin */}
        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>
        <Route path='/rental' element={<MRental/>}/>
        <Route path="/admin/all-rentals" element={<MRentPage />} />

      </Routes>
    </div>
  )
}

export default App
