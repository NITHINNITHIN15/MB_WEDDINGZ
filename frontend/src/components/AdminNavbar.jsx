import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import './AdminNavbar.css';

const AdminNavbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [menuOpen, setMenuOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/login');
  };

  const links = [
    { path: '/admin/dashboard', label: 'Dashboard' },
    { path: '/admin/bookings', label: 'Service Booking' },
    { path: '/admin/rental-bookings', label: 'Rental Booking' },
    { path: '/admin/services', label: 'Add Services' },
    { path: '/admin/addteams', label: 'Add Team' },
    { path: '/admin/rentals', label: 'Add Rental' },
    { path: '/admin/gallery', label: 'Gallery' },
    { path: '/admin/contacts', label: 'Contacts' },
    { path: '/admin/testimonials', label: 'Testimonials' },
  ];

  return (
    <nav className="admin-navbar">
      <div className="navbar-left">
        <img src="/MB[1].png" alt="logo" className="navbar-logo" />
        <span className="navbar-title">MB_WEDDINGS</span>
      </div>

      {/* Hamburger Button */}
      <div className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
        <div className={menuOpen ? "bar bar1open" : "bar"}></div>
        <div className={menuOpen ? "bar bar2open" : "bar"}></div>
        <div className={menuOpen ? "bar bar3open" : "bar"}></div>
      </div>

      {/* CENTER LINKS */}
      <div className={`navbar-center ${menuOpen ? "open" : ""}`}>
        {links.map((link) => (
          <Link
            key={link.path}
            to={link.path}
            className={location.pathname === link.path ? 'active' : ''}
            onClick={() => setMenuOpen(false)} // auto-close on mobile
          >
            {link.label}
          </Link>
        ))}

        {/* Logout button visible in mobile menu */}
        <button className="mobile-logout" onClick={handleLogout}>Logout</button>
      </div>

      {/* RIGHT LOGOUT BUTTON (desktop only) */}
      <div className="navbar-right">
        <button onClick={handleLogout}>Logout</button>
      </div>
    </nav>
  );
};

export default AdminNavbar;
