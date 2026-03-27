import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * ProtectedRoute
 * @param {string} requiredRole - "user" | "admin" | undefined (any authenticated user)
 */
const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useAuth();
  const location = useLocation();

  // Not logged in at all
  if (!user) {
    const redirectTo = requiredRole === "admin" ? "/admin/login" : "/login";
    return <Navigate to={redirectTo} state={{ from: location }} replace />;
  }

  // Logged in but wrong role
  if (requiredRole && user.role !== requiredRole) {
    // A regular user trying to access admin → send to their home
    if (user.role === "user") return <Navigate to="/home" replace />;
    // An admin trying to access user routes → send to admin dashboard
    if (user.role === "admin") return <Navigate to="/admin" replace />;
  }

  return children;
};

export default ProtectedRoute;
