import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const AdminNavbar = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin/login');
  };

  return (
    <nav style={{ padding: '1rem', background: '#222', color: '#fff', display: 'flex', gap: '1rem' }}>
      <Link to="/admin/dashboard" style={{ color: 'white', textDecoration: 'none' }}>Dashboard</Link>
      <Link to="/admin/bookings" style={{ color: 'white', textDecoration: 'none' }}>Service Booking</Link>
      <Link to="/admin/services" style={{ color: 'white', textDecoration: 'none' }}>Add Services</Link>
      <Link to="/admin/addteams" style={{ color: 'white', textDecoration: 'none' }}>Add Team</Link>
      <Link to="/admin/rentals" style={{ color: 'white', textDecoration: 'none' }}>Add Rental</Link>
      <Link to="/admin/rental-bookings" style={{ color: 'white', textDecoration: 'none' }}>Rental Booking</Link>
      <Link to="/admin/gallery" style={{ color: 'white', textDecoration: 'none' }}>Gallery</Link>
      <Link to="/admin/contacts" style={{ color: 'white', textDecoration: 'none' }}>Contacts</Link>
      <Link to="/admin/testimonials" style={{ color: 'white', textDecoration: 'none' }}>Testimonials</Link>
      <button onClick={handleLogout} style={{ marginLeft: 'auto', color: 'white', background: 'red', border: 'none', padding: '0.5rem 1rem', cursor: 'pointer' }}>
        Logout
      </button>
    </nav>
  );
};

export default AdminNavbar;
