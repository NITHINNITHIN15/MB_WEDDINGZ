import React, { useEffect, useState } from 'react';
import API from '../api/axios';
import AdminNavbar from '../components/AdminNavbar';
import './AdminBooking.css';

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState('');

  const token = localStorage.getItem('adminToken');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const res = await API.get('/bookings', { headers });
      setBookings(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to fetch bookings');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this booking?')) return;
    try {
      await API.delete(`/bookings/${id}`, { headers });
      setBookings(bookings.filter((b) => b._id !== id));
    } catch (err) {
      alert('Delete failed');
    }
  };

  const handleStatusUpdate = async (id, newStatus) => {
    try {
      const res = await API.put(`/bookings/${id}`, { status: newStatus }, { headers });
      setBookings(
        bookings.map((b) => (b._id === id ? { ...b, status: res.data.booking.status } : b))
      );
    } catch (err) {
      alert('Status update failed');
    }
  };

  return (
  <>
    <div className="admin-bookings-container">
      {/* <h2>Bookings Management</h2> */}
      {error && <p className="error-text">{error}</p>}
      {bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Event</th>
              <th>Location</th>
              <th>Status</th>
              <th>Update</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {bookings.map((booking) => (
              <tr key={booking._id}>
                <td>{booking.name}</td>
                <td>{booking.email}</td>
                <td>{booking.phone}</td>
                <td>
                  {booking.eventType} <br />
                  {new Date(booking.eventDate).toLocaleDateString()}
                </td>
                <td>{booking.location}</td>
                <td>{booking.status}</td>
                <td>
                  <select
                    value={booking.status}
                    onChange={(e) => handleStatusUpdate(booking._id, e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="completed">Completed</option>
                  </select>
                </td>
                <td>
                  <button onClick={() => handleDelete(booking._id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  </>
);
}