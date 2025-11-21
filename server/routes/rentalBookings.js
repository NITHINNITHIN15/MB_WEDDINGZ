const express = require('express');
const RentalBooking = require('../models/RentalBooking');
const router = express.Router();

router.post('/', async (req, res) => {
  try {
    const { item, rentalStart, rentalEnd } = req.body;

    // Check for overlapping bookings
    const overlapping = await RentalBooking.findOne({
      item: item,
      rentalStart: { $lt: new Date(rentalEnd) },
      rentalEnd: { $gt: new Date(rentalStart) },
    });

    if (overlapping) {
      return res.status(400).json({ error: 'Item is already booked for the selected dates.' });
    }

    // If no overlap, create the booking
    const booking = new RentalBooking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (err) {
    res.status(400).json({ error: 'Booking failed', message: err.message });
  }
});


router.get('/', async (req, res) => {
  try {
    const bookings = await RentalBooking.find().populate('item');
    res.json(bookings);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch bookings' });
  }
});

// PUT to update status
router.put("/:id", async (req, res) => {
  try {
    const booking = await RentalBooking.findByIdAndUpdate(req.params.id, {
      status: req.body.status,
    }, { new: true });

    if (!booking) return res.status(404).json({ error: "Booking not found" });

    res.json(booking);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// DELETE booking
router.delete("/:id", async (req, res) => {
  try {
    const booking = await RentalBooking.findByIdAndDelete(req.params.id);
    if (!booking) return res.status(404).json({ error: "Booking not found" });
    res.json({ message: "Booking deleted" });
  } catch (err) {
    res.status(500).json({ error: "Delete failed" });
  }
});

module.exports = router;
