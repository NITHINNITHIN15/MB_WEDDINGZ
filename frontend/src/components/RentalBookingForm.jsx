import React, { useState, useEffect } from 'react';
import axios from '../api/axios';
import './RentalBookingForm.css';

export default function RentalBookingForm({ item, onClose }) {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    rentalStart: '',
    rentalEnd: ''
  });
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (form.rentalStart && form.rentalEnd) {
      const start = new Date(form.rentalStart);
      const end = new Date(form.rentalEnd);
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (days > 0) {
        setTotal(days * item.pricePerDay);
      } else {
        setTotal(0);
      }
    }
  }, [form.rentalStart, form.rentalEnd, item.pricePerDay]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/rental-bookings', {
        ...form,
        item: item._id,
        totalPrice: total
      });
      alert('Booking successful!');
      onClose();
    } catch (err) {
      console.error(err);
      alert(err?.response?.data?.error || 'Booking failed.');
    }
  };

  return (
    <div className="booking-form-overlay">
      <div className="booking-form-container">
        <h3>Book: {item.name}</h3>
        <form onSubmit={handleSubmit}>
          <input name="name" placeholder="Your Name" required onChange={handleChange} />
          <input name="email" placeholder="Email" type="email" required onChange={handleChange} />
          <input name="phone" placeholder="Phone Number" required onChange={handleChange} />
          <label>Rental Start Date:</label>
          <input type="date" name="rentalStart" required onChange={handleChange} />
          <label>Rental End Date:</label>
          <input type="date" name="rentalEnd" required onChange={handleChange} />
          <p><strong>Total Price:</strong> ₹{total}</p>
          <div className="booking-actions">
            <button type="submit">Confirm Booking</button>
            <button type="button" className="cancel" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}
