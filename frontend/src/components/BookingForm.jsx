import React, { useState } from 'react';
import API from '../api/axios';
import './BookingForm.css';

export default function BookingForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    eventDate: '',
    eventType: '',
    location: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    try {
      setLoading(true);
      await API.post('/bookings', {
        ...formData,
        eventType: formData.eventType.toLowerCase()
      });
      setSuccess('Booking submitted successfully!');
      setFormData({
        name: '',
        email: '',
        phone: '',
        eventDate: '',
        eventType: '',
        location: '',
        message: '',
      });
    } catch (err) {
      setError('Submission failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="booking-container">
      <h2>Book Your Session</h2>
      <p className="subtext">
        Ready to capture your special day? Fill out the form below to request a booking.
        We'll get back to you within 24–48 hours to discuss your needs.
      </p>
      <br />
      <form className="booking-grid" onSubmit={handleSubmit}>
        <div className="form-field">
          <label>Full Name</label>
          <input
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Your name"
            required
          />
        </div>

        <div className="form-field">
          <label>Email Address</label>
          <input
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="your.email@example.com"
            required
          />
        </div>

        <div className="form-field">
          <label>Phone Number</label>
          <input
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            placeholder="Your contact number"
            required
          />
        </div>

        <div className="form-field">
          <label>Service Date</label>
          <input
            name="eventDate"
            type="date"
            value={formData.eventDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-field">
          <label>Service Type</label>
          <select name="eventType" value={formData.eventType} onChange={handleChange} required>
            <option value="">Select ceremony type</option>
            <option value="Christian">Christian</option>
            <option value="Hindu">Hindu</option>
            <option value="Muslim">Muslim</option>
            <option value="Other">Other</option>
          </select>
        </div>

        <div className="form-field">
          <label>Service Location</label>
          <input
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="Your Location"
            required
          />
        </div>

        <div className="form-field full">
          <label>Additional Details</label>
          <textarea
            name="message"
            value={formData.message}
            onChange={handleChange}
            placeholder="Tell us more about your special day and any specific requirements..."
            required
          />
        </div>

        {error && <p className="error">{error}</p>}
        {success && <p className="success">{success}</p>}

        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? 'Submitting...' : 'Submit Booking Request'}
        </button>
      </form>
    </section>
  );
}
