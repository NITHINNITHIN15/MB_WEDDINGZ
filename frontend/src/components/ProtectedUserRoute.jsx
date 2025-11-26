// import React from 'react';
// import { Navigate } from 'react-router-dom';

// const ProtectedRoute = ({ children }) => {
//   const token = localStorage.getItem('adminToken');
//   return token ? children : <Navigate to="/admin/login" />;
// };

// export default ProtectedRoute;


import React from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedUserRoute({ children }) {
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  if (!token || role === "admin") {
    // Admin should not access user routes
    return <Navigate to="/admin/dashboard" replace />;
  }

  return children;
}




