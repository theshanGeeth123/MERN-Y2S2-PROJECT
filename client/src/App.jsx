// src/App.jsx
import React from "react";
import { Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// Public pages
import Home from "./pages/Home";
import Login from "./pages/Login";
import EmailVerify from "./pages/EmailVerify";
import ResetPassword from "./pages/ResetPassword";
import MyProfile from "./pages/MyProfile";
import CustomerHome from "./pages/customer/CustomerHome";
import ProductList from "./pages/product/ProductList";
import CartPage from "./pages/cart/CartPage";
import Checkout from "./pages/cart/Checkout";
import PaymentSuccess from "./pages/cart/PaymentSuccess";
import MyOrders from "./pages/order/MyOrders";
import ManageCards from "./pages/payments/ManageCards";

// Admin pages
import AdminLogin from "./admin/AdminLogin";
import AdminHome from "./admin/AdminHome";
import AdminOrders from "./pages/admin/AdminOrders";
import AdminReports from "./pages/admin/AdminReports";
import AddProduct from "./pages/admin/AddProduct";
import ManageProducts from "./pages/admin/ManageProducts";
import UsersReport from "./pages/admin/UsersReport.jsx";
import CustomerManagement from "./admin/T_Customer/CustomerManage.jsx";

// Admin Notifications
import Notifications from "./admin/T_Notifications/Notifications";
import NotificationDetail from "./admin/T_Notifications/NotificationDetail";
import NotificationCreate from "./admin/T_Notifications/NotificationCreate";

// Customer Notifications
import CustomerNotifications from "./T_Customer/T_Cus_notifications/CustomerNotifications";


// Staff Management

import StaffList from "./admin/members/StaffList.jsx";
import StaffCreate from "./admin/members/StaffCreate";
import StaffDetail from "./admin/members/StaffDetail";

import StaffHome from "./staff/staffHome.jsx";
import StaffLogin from "./staff/StaffLogin.jsx";


import StaffProfile from "./staff/StaffProfile";
import StaffReport from './admin/members/StaffReport.jsx';

import Packages from './admin/Packages'; 
import PackageDetail from './admin/PackageDetail';

import UserPackages from './pages/UserPackages';
import BookingForm from './pages/BookingForm';

import UserBookings from './pages/UserBookings'
import Bookings from './pages/Bookings';




function App() {
  return (
    <div>
      <ToastContainer />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/main-home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/email-verify" element={<EmailVerify />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/my-profile" element={<MyProfile />} />
        <Route path="/customer-home" element={<CustomerHome />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/my-orders" element={<MyOrders />} />
        <Route path="/cards" element={<ManageCards />} />
        <Route path="/notifications" element={<CustomerNotifications />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin/home" element={<AdminHome />} />
        <Route path="/admin/orders" element={<AdminOrders />} />
        <Route path="/admin/reports" element={<AdminReports />} />
        <Route path="/admin/add-product" element={<AddProduct />} />
        <Route path="/admin/products" element={<ManageProducts />} />
        <Route path="/admin/user-reports" element={<UsersReport />} />
        <Route path="/customerManagement" element={<CustomerManagement />} />

        {/* Admin Notifications */}
        <Route path="/admin/notifications" element={<Notifications />} />
        <Route
          path="/admin/notifications/create"
          element={<NotificationCreate />}
        />
        <Route
          path="/admin/notifications/:id"
          element={<NotificationDetail />}
        />

        {/* Staff Management */}

        <Route path="/staff/login" element={<StaffLogin />} />
        <Route path="/staff/home" element={<StaffHome />} />

        <Route path="/admin/staff" element={<StaffList />} />
        <Route path="/admin/staff/create" element={<StaffCreate />} />
        <Route path="/admin/staff/:id" element={<StaffDetail />} />

        <Route path="/staff/profile" element={<StaffProfile />} />
        <Route path="/admin/staff/report" element={<StaffReport />} />


        <Route path="/admin/packages" element={<Packages />} />
        <Route path="/packageDetail/:id" element={<PackageDetail />} />

         <Route path="/userpackages" element={<UserPackages />} />
         <Route path="/booking-request" element={<BookingForm />} />
          <Route path="/my-bookings" element={<UserBookings />} />
          <Route path="/admin/bookings" element={<Bookings />} />

      </Routes>
    </div>
  );
}

export default App;
