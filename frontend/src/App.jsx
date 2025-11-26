
// import React from "react";
// import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// import AdminNavbar from "./components/AdminNavbar";
// import AdminDashboard from "./pages/AdminDashboard";
// import AdminBookings from "./pages/AdminBookings";
// import AdminContacts from "./pages/AdminContacts";
// import AdminGallery from "./pages/AdminGallery";
// import AdminTestimonials from "./pages/AdminTestimonials";
// import AdminAddTeam from "./pages/AdminAddTeam";
// import AdminServices from "./pages/AdminServices";
// import AdminRental from "./pages/AdminRental";
// import AdminRentalBookings from "./pages/AdminRentalBooking";

// import Home from "./components/Home";
// import RentalPage from "./components/RentalPage";

// import Login from "./pages/Login";
// import Signup from "./pages/Signup";

// import ProtectedUserRoute from "./components/ProtectedUserRoute";
// import ProtectedAdminRoute from "./pages/ProtectedAdminRoute";

// function Layout() {
//   const location = useLocation();

//   const isAdminRoute = location.pathname.startsWith("/admin");

//   return (
//     <>
//       {isAdminRoute && <AdminNavbar />}
//       <Routes>
//         {/* PUBLIC */}
//         <Route path="/login" element={<Login />} />
//         <Route path="/signup" element={<Signup />} />

//         {/* USER ROUTES */}
//         <Route path="/" element={<ProtectedUserRoute><Home /></ProtectedUserRoute>} />
//         <Route path="/rental" element={<ProtectedUserRoute><RentalPage /></ProtectedUserRoute>} />

//         {/* ADMIN ROUTES */}
//         <Route path="/admin/dashboard" element={<ProtectedAdminRoute><AdminDashboard /></ProtectedAdminRoute>} />
//         <Route path="/admin/gallery" element={<ProtectedAdminRoute><AdminGallery /></ProtectedAdminRoute>} />
//         <Route path="/admin/services" element={<ProtectedAdminRoute><AdminServices /></ProtectedAdminRoute>} />
//         <Route path="/admin/bookings" element={<ProtectedAdminRoute><AdminBookings /></ProtectedAdminRoute>} />
//         <Route path="/admin/rentals" element={<ProtectedAdminRoute><AdminRental /></ProtectedAdminRoute>} />
//         <Route path="/admin/rental-bookings" element={<ProtectedAdminRoute><AdminRentalBookings /></ProtectedAdminRoute>} />
//         <Route path="/admin/addteams" element={<ProtectedAdminRoute><AdminAddTeam /></ProtectedAdminRoute>} />
//         <Route path="/admin/testimonials" element={<ProtectedAdminRoute><AdminTestimonials /></ProtectedAdminRoute>} />
//         <Route path="/admin/contacts" element={<ProtectedAdminRoute><AdminContacts /></ProtectedAdminRoute>} />

//         {/* FALLBACK */}
//         <Route path="*" element={<Navigate to="/login" />} />
//       </Routes>
//     </>
//   );
// }

// export default function App() {
//   return (
//     <Router>
//       <Layout />
//     </Router>
//   );
// }



import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from "react-router-dom";

// Pages & Components
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Home from "./components/Home";
import RentalPage from "./components/RentalPage";

import AdminDashboard from "./pages/AdminDashboard";
import AdminBookings from "./pages/AdminBookings";
import AdminContacts from "./pages/AdminContacts";
import AdminGallery from "./pages/AdminGallery";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminServices from "./pages/AdminServices";
import AdminRental from "./pages/AdminRental";
import AdminRentalBookings from "./pages/AdminRentalBooking";
import AdminAddTeam from "./pages/AdminAddTeam";
import AdminNavbar from "./components/AdminNavbar";

// Protected Routes
import ProtectedUserRoute from "./components/ProtectedUserRoute";
import ProtectedAdminRoute from "./pages/ProtectedAdminRoute";

// Layout wrapper to show AdminNavbar for admin routes
function Layout() {
  const location = useLocation();

  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminRoute =
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/login";

  return (
    <>
      {isAdminRoute && <AdminNavbar />}

      <Routes>
        {/* ---------- PUBLIC ROUTES ---------- */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />

        {/* ---------- USER PROTECTED ROUTES ---------- */}
        <Route
          path="/user/dashboard"
          element={
            <ProtectedUserRoute>
              <Home />
            </ProtectedUserRoute>
          }
        />
        <Route
          path="/user/rental"
          element={
            <ProtectedUserRoute>
              <RentalPage />
            </ProtectedUserRoute>
          }
        />

        {/* ---------- ADMIN ROUTES ---------- */}
        <Route
          path="/admin/dashboard"
          element={
            <ProtectedAdminRoute>
              <AdminDashboard />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <ProtectedAdminRoute>
              <AdminBookings />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <ProtectedAdminRoute>
              <AdminContacts />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <ProtectedAdminRoute>
              <AdminGallery />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <ProtectedAdminRoute>
              <AdminTestimonials />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <ProtectedAdminRoute>
              <AdminServices />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/rentals"
          element={
            <ProtectedAdminRoute>
              <AdminRental />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/rental-bookings"
          element={
            <ProtectedAdminRoute>
              <AdminRentalBookings />
            </ProtectedAdminRoute>
          }
        />
        <Route
          path="/admin/addteams"
          element={
            <ProtectedAdminRoute>
              <AdminAddTeam />
            </ProtectedAdminRoute>
          }
        />

        {/* Fallback */}
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </>
  );
}

// Main App Wrapper
export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
