const express = require('express');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');
const router = express.Router();
dotenv.config();

// Hardcoded admin credentials (for now, can move to DB later)
const ADMIN_EMAIL = 'admin@example.com';
const ADMIN_PASSWORD = 'admin123';

// Models
const Booking = require('../models/Booking');
const Contact = require('../models/Contact');
const Gallery = require('../models/Gallery');
const Testimonial = require('../models/Testimonial');

// Auth middleware
const auth = require('../middleware/auth');

// Admin Login Route
router.post('/login', (req, res) => {
  console.log("Incoming login request:", req.body); // ✅ log body
  const { email, password } = req.body;
  console.log("Email:", email, "Password:", password); // ✅ debug
  if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ email }, process.env.JWT_SECRET, { expiresIn: '2h' });
    res.json({ token });
  } else {
    res.status(401).json({ message: 'Invalid credentials' });
  }
});


// Dashboard Stats Route (Protected)
router.get('/stats', auth, async (req, res) => {
  try {
    const [bookings, contacts, gallery, testimonials] = await Promise.all([
      Booking.countDocuments(),
      Contact.countDocuments(),
      Gallery.countDocuments(),
      Testimonial.countDocuments()
    ]);
    res.json({ bookings, contacts, gallery, testimonials });
  } catch (err) {
    console.error('Error fetching stats:', err);
    res.status(500).json({ message: 'Failed to fetch stats' });
  }
});

module.exports = router;
