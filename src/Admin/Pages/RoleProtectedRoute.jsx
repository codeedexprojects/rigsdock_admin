import React, { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router-dom";

// Role-based protected route component
export const RoleProtectedRoute = ({ children, allowedRoles }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for authentication token
    const accessToken = localStorage.getItem("rigsdock_accessToken");
    const isAdmin = localStorage.getItem("rigsdock_admin");
    const isVendor = localStorage.getItem("rigsdock_vendor");
    
    if (!accessToken) {
      setIsAuthenticated(false);
      setLoading(false);
      return;
    }
    
    setIsAuthenticated(true);
    
    // Check role permissions
    if (allowedRoles.includes('admin') && isAdmin) {
      setHasPermission(true);
    } else if (allowedRoles.includes('vendor') && isVendor) {
      setHasPermission(true);
    } else if (allowedRoles.includes('all')) {
      setHasPermission(true);
    } else {
      setHasPermission(false);
    }
    
    setLoading(false);
  }, [allowedRoles]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!isAuthenticated) {
    // Redirect to login page if not authenticated
    return <Navigate to="/" replace />;
  }

  if (!hasPermission) {
    // Redirect to appropriate dashboard based on role
    if (localStorage.getItem("rigsdock_admin")) {
      return <Navigate to="/home" replace />;
    } else if (localStorage.getItem("rigsdock_vendor")) {
      return <Navigate to="/vendor-dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children || <Outlet />;
};