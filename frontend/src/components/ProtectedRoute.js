import React from "react";
import { Navigate, useLocation } from "react-router-dom";

// ProtectedRoute now only checks for authentication. Roles have been removed.
export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const userInfo = localStorage.getItem("userInfo") ? JSON.parse(localStorage.getItem("userInfo")) : null;

  if (!userInfo?.access) {
    // Redirect to login but remember where user came from
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}


