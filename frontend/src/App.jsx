import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";

import AdminNavbar from "./components/AdminNavbar";
import AdminBookings from "./pages/AdminBookings";
import AdminContacts from "./pages/AdminContacts";
import AdminGallery from "./pages/AdminGallery";
import AdminTestimonials from "./pages/AdminTestimonials";
import AdminDashboard from "./pages/AdminDashboard";
import AdminLogin from "./pages/AdminLogin";
import AdminAddTeam from "./pages/AdminAddTeam";
import Home from "./components/Home";
import AdminServices from "./pages/AdminServices";
import AdminRental from "./pages/AdminRental";
import AdminRentalBookings from "./pages/AdminRentalBooking";
import RentalPage from "./components/RentalPage";

// Private route wrapper
function PrivateRoute({ children }) {
  const token = localStorage.getItem("adminToken");
  return token ? children : <Navigate to="/admin/login" />;
}

// Wrapper component for admin and public routes
function Layout() {
  const location = useLocation();

  // Scroll to top on route change
  React.useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  const isAdminRoute =
    location.pathname.startsWith("/admin") &&
    location.pathname !== "/admin/login";

  return (
    <>
      {isAdminRoute && <AdminNavbar />}
      <Routes>
        {/* Public SPA Route */}
        <Route path="/" element={<Home />} />
        <Route path="/rental" element={<RentalPage />} />


        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin/dashboard"
          element={
            <PrivateRoute>
              <AdminDashboard />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/gallery"
          element={
            <PrivateRoute>
              <AdminGallery />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/services"
          element={
            <PrivateRoute>
              <AdminServices />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <PrivateRoute>
              <AdminBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/rentals"
          element={
            <PrivateRoute>
              <AdminRental />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/rental-bookings"
          element={
            <PrivateRoute>
              <AdminRentalBookings />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/addteams"
          element={
            <PrivateRoute>
              <AdminAddTeam />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/testimonials"
          element={
            <PrivateRoute>
              <AdminTestimonials />
            </PrivateRoute>
          }
        />
        <Route
          path="/admin/contacts"
          element={
            <PrivateRoute>
              <AdminContacts />
            </PrivateRoute>
          }
        />
      </Routes>
    </>
  );
}

// Main App wrapper
export default function App() {
  return (
    <Router>
      <Layout />
    </Router>
  );
}
