import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import EmailVerify from './pages/EmailVerify';
import ResetPassword from './pages/ResetPassword';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

// Admin section
import AdminLogin from './admin/AdminLogin';
import AdminHome from './admin/AdminHome';
import MyProfile from './pages/MyProfile';

// Merge both versions:
import CustomerHome from './pages/customer/CustomerHome'; // keep consistent with folder structure from aloka-test-branch
import UsersReport from './pages/admin/UsersReport';
import ProductList from './pages/product/ProductList';
import CartPage from './pages/cart/CartPage';
import AddProduct from './pages/admin/AddProduct';
import ManageProducts from './pages/admin/ManageProducts';
import OrderSummary from './pages/cart/OrderSummary';
import Checkout from './pages/cart/Checkout';
import PaymentSuccess from './pages/cart/PaymentSuccess';
import MyOrders from './pages/order/MyOrders';
import AdminOrders from './pages/admin/AdminOrders';
import AdminReports from './pages/admin/AdminReports';
import ManageCards from './pages/payments/ManageCards';

function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/email-verify' element={<EmailVerify />} />
        <Route path='/reset-password' element={<ResetPassword />} />
        <Route path='/my-profile' element={<MyProfile />} />

        {/* admin */}
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/home' element={<AdminHome />} />
        <Route path='/admin/user-reports' element={<UsersReport />} />

        {/* customer and products */}
        <Route path='/customer' element={<CustomerHome />} />
        <Route path='/products' element={<ProductList />} />
        <Route path='/cart' element={<CartPage />} />

        {/* admin products */}
        <Route path='/admin/add-product' element={<AddProduct />} />  
        <Route path='/admin/products' element={<ManageProducts />} />

        {/* orders and checkout */}
        <Route path='/order-summary' element={<OrderSummary />} />
        <Route path='/checkout' element={<Checkout />} />
        <Route path='/payment-success' element={<PaymentSuccess />} />
        <Route path='/my-orders' element={<MyOrders />} />
        <Route path='/admin/orders' element={<AdminOrders />} />
        <Route path='/admin/reports' element={<AdminReports />} />
        <Route path='/cards' element={<ManageCards />} />
      </Routes>
    </div>
  );
}

export default App;
