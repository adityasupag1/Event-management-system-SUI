import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';

// Common
import Index from './pages/Index';
import Chart from './pages/Chart';

// Auth
import AdminLogin from './pages/AdminLogin';
import VendorLogin from './pages/VendorLogin';
import VendorSignUp from './pages/VendorSignUp';
import UserLogin from './pages/UserLogin';
import UserSignUp from './pages/UserSignUp';

// Vendor
import VendorHome from './pages/VendorHome';
import YourItem from './pages/YourItem';
import AddNewItem from './pages/AddNewItem';
import ProductStatus from './pages/ProductStatus';
import RequestItem from './pages/RequestItem';
import ViewProduct from './pages/ViewProduct';
import UpdateStatus from './pages/UpdateStatus';
import VendorTransaction from './pages/VendorTransaction';

// User
import UserHome from './pages/UserHome';
import VendorList from './pages/VendorList';
import VendorProducts from './pages/VendorProducts';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import GuestList from './pages/GuestList';
import OrderStatus from './pages/OrderStatus';

// Admin
import AdminHome from './pages/AdminHome';
import AdminMaintenance from './pages/AdminMaintenance';
import MaintainUser from './pages/MaintainUser';
import MaintainVendor from './pages/MaintainVendor';
import MembershipManage from './pages/MembershipManage';

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/" element={<Index />} />
      <Route path="/chart" element={<Chart />} />

      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/vendor/login" element={<VendorLogin />} />
      <Route path="/vendor/signup" element={<VendorSignUp />} />
      <Route path="/user/login" element={<UserLogin />} />
      <Route path="/user/signup" element={<UserSignUp />} />

      {/* Vendor protected */}
      <Route path="/vendor/home" element={<ProtectedRoute role="vendor"><VendorHome /></ProtectedRoute>} />
      <Route path="/vendor/your-item" element={<ProtectedRoute role="vendor"><YourItem /></ProtectedRoute>} />
      <Route path="/vendor/add-item" element={<ProtectedRoute role="vendor"><AddNewItem /></ProtectedRoute>} />
      <Route path="/vendor/product-status" element={<ProtectedRoute role="vendor"><ProductStatus /></ProtectedRoute>} />
      <Route path="/vendor/request-item" element={<ProtectedRoute role="vendor"><RequestItem /></ProtectedRoute>} />
      <Route path="/vendor/view-product" element={<ProtectedRoute role="vendor"><ViewProduct /></ProtectedRoute>} />
      <Route path="/vendor/update-status/:id" element={<ProtectedRoute role="vendor"><UpdateStatus /></ProtectedRoute>} />
      <Route path="/vendor/transaction" element={<ProtectedRoute role="vendor"><VendorTransaction /></ProtectedRoute>} />

      {/* User protected */}
      <Route path="/user/home" element={<ProtectedRoute role="user"><UserHome /></ProtectedRoute>} />
      <Route path="/user/vendor-list/:category" element={<ProtectedRoute role="user"><VendorList /></ProtectedRoute>} />
      <Route path="/user/vendor-products/:vendorId" element={<ProtectedRoute role="user"><VendorProducts /></ProtectedRoute>} />
      <Route path="/user/cart" element={<ProtectedRoute role="user"><Cart /></ProtectedRoute>} />
      <Route path="/user/checkout" element={<ProtectedRoute role="user"><Checkout /></ProtectedRoute>} />
      <Route path="/user/guest-list" element={<ProtectedRoute role="user"><GuestList /></ProtectedRoute>} />
      <Route path="/user/order-status" element={<ProtectedRoute role="user"><OrderStatus /></ProtectedRoute>} />

      {/* Admin protected */}
      <Route path="/admin/home" element={<ProtectedRoute role="admin"><AdminHome /></ProtectedRoute>} />
      <Route path="/admin/maintenance" element={<ProtectedRoute role="admin"><AdminMaintenance /></ProtectedRoute>} />
      <Route path="/admin/maintain-user" element={<ProtectedRoute role="admin"><MaintainUser /></ProtectedRoute>} />
      <Route path="/admin/maintain-vendor" element={<ProtectedRoute role="admin"><MaintainVendor /></ProtectedRoute>} />
      <Route path="/admin/membership" element={<ProtectedRoute role="admin"><MembershipManage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;
