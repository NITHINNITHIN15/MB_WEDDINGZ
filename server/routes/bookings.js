const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');
const Booking = require('../models/Booking');

// ✅ Create a new booking
router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email is required'),
    body('phone').notEmpty().withMessage('Phone number is required'),
    body('eventDate')
      .isISO8601().toDate().withMessage('Valid event date is required')
      .custom((date) => {
        if (new Date(date) < new Date()) {
          throw new Error('Event date cannot be in the past');
        }
        return true;
      }),
    body('eventType')
      .isIn([
        "WeddingPhotography",
        "PreWeddingShoots",
        "CulturalCeremonies",
        "FamilyPortraits",
        "MaternityInfantShoots",
        "EventCoverage",
        "CouplePortraitShoots",
        "CommercialShoots"
      ])
      .withMessage('Event type must be valid'),
    body('location').notEmpty().withMessage('Location is required'),
    body('message').notEmpty().withMessage('Message is required')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const { name, email, phone, eventDate, eventType, location, message } = req.body;

      const booking = new Booking({
        name: name.trim(),
        email: email.trim().toLowerCase(),
        phone: phone.trim(),
        eventDate,
        eventType,
        location: location.trim(),
        message: message.trim(),
      });

      const saved = await booking.save();
      res.status(201).json({ message: 'Booking submitted successfully!', booking: saved });
    } catch (error) {
      if (error.code === 11000 && error.keyPattern && error.keyPattern.email) {
        return res.status(409).json({ message: 'Email already exists in booking list' });
      }
      console.error('Error creating booking:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// ✅ Get all bookings
router.get('/', async (req, res) => {
  try {
    const { status, eventType } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (eventType) filter.eventType = eventType.toLowerCase();

    const bookings = await Booking.find(filter).sort({ createdAt: -1 });
    res.status(200).json(bookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ✅ Update booking status
router.put(
  '/:id',
  [
    body('status')
      .isIn(['pending', 'confirmed', 'cancelled', 'completed'])
      .withMessage('Invalid status')
  ],
  async (req, res) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });

      const updated = await Booking.findByIdAndUpdate(
        req.params.id,
        { status: req.body.status },
        { new: true }
      );

      if (!updated) {
        return res.status(404).json({ message: 'Booking not found' });
      }

      res.json({ message: 'Booking status updated', booking: updated });
    } catch (error) {
      console.error('Error updating booking:', error);
      res.status(500).json({ message: 'Server error', error: error.message });
    }
  }
);

// ✅ Delete a booking
router.delete('/:id', async (req, res) => {
  try {
    const booking = await Booking.findByIdAndDelete(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    res.json({ message: 'Booking deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});


module.exports = router;
