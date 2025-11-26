// import React from "react";
// import { Navigate } from "react-router-dom";

// export default function ProtectedAdminRoute({ children }) {
//   const token = localStorage.getItem("userToken");
//   const role = localStorage.getItem("userRole");

//   if (!token) return <Navigate to="/login" />;

//   if (role !== "admin") return <Navigate to="/login" />;

//   return children;
// }

import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";

export default function ProtectedAdminRoute({ children }) {
  const token = localStorage.getItem("userToken");
  const role = localStorage.getItem("userRole");

  useEffect(() => {
    console.log("🔐 ProtectedAdminRoute Check:", {
      token: token ? "exists" : "missing",
      role: role,
      hasToken: !!token,
      isAdmin: role === "admin"
    });
  }, [token, role]);

  if (!token) {
    console.log("❌ No token found, redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  if (role !== "admin") {
    console.log("❌ Not an admin (role:", role, "), redirecting to /login");
    return <Navigate to="/login" replace />;
  }

  console.log("✅ Admin access granted");
  return children;
}


