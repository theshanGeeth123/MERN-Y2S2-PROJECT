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
import CustomerHome from './pages/customer/CustomerHome'
import ProductList from './pages/product/ProductList'
import CartPage from "./pages/cart/CartPage";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import OrderSummary from "./pages/cart/OrderSummary";
import Checkout from "./pages/cart/Checkout";
import PaymentSuccess from "./pages/cart/PaymentSuccess";

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
       
        

        {/* admin */}

        <Route path='/admin/login' element={<AdminLogin/>}/>
        <Route path='/admin/home' element={<AdminHome/>}/>



        <Route path="/customer" element={<CustomerHome />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        
        <Route path="/admin/add-product" element={<AddProduct />} />  
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/order-summary" element={<OrderSummary />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />


      </Routes>
    </div>
  )
}

export default App
