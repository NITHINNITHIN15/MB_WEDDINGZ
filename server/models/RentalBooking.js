const mongoose = require('mongoose');

const rentalBookingSchema = new mongoose.Schema({
  item: { type: mongoose.Schema.Types.ObjectId, ref: 'RentalItem', required: true },
  name: String,
  email: String,
  phone: String,
  rentalStart: Date,
  rentalEnd: Date,
  totalPrice: Number,
  status: { type: String, default: 'Pending' },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('RentalBooking', rentalBookingSchema);
