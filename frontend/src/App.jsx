import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

// Context
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

// Auth pages
import Login from "./pages/Auth/Login";
import AdminLogin from "./pages/Auth/AdminLogin";
import Signup from "./pages/Auth/Signup";
import OTP from "./pages/Auth/OTP";
import ForgotPassword from "./pages/Auth/ForgotPassword";
import ResetPassword from "./pages/Auth/ResetPassword";

// User pages
import Home from "./pages/Home/Home";
import Reports from "./pages/Home/Reports";
import ReportDetails from "./pages/Home/ReportDetails";

// Admin pages
import AdminLayout from "./pages/Admin/AdminLayout";
import AdminDashboard from "./pages/Admin/Dashboard";
import ManageReport from "./pages/Admin/ManageReport";
import ViewReport from "./pages/Admin/ViewReport";
import Categories from "./pages/Admin/Categories";
import CategoryDetails from "./pages/Admin/CategoryDetails";
import Users from "./pages/Admin/Users";
import UserDetails from "./pages/Admin/UserDetails";

// Other
import NotFound from "./pages/NotFound";

const App = () => {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Root → login */}
          <Route path="/" element={<Navigate to="/login" replace />} />

          {/* Public auth routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/otp" element={<OTP />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />

          {/* Protected user routes */}
          <Route path="/home" element={
            <ProtectedRoute requiredRole="user">
              <Home />
            </ProtectedRoute>
          } />
          <Route path="/reports" element={
            <ProtectedRoute requiredRole="user">
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/report-details" element={
            <ProtectedRoute requiredRole="user">
              <ReportDetails />
            </ProtectedRoute>
          } />

          {/* Protected admin routes */}
          <Route path="/admin" element={
            <ProtectedRoute requiredRole="admin">
              <AdminLayout />
            </ProtectedRoute>
          }>
            <Route index element={<AdminDashboard />} />
            <Route path="reports" element={<ManageReport />} />
            <Route path="view-report" element={<ViewReport />} />
            <Route path="categories" element={<Categories />} />
            <Route path="category-details" element={<CategoryDetails />} />
            <Route path="users" element={<Users />} />
            <Route path="user-details" element={<UserDetails />} />
          </Route>

          <Route path="*" element={<NotFound />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
};

export default App;
