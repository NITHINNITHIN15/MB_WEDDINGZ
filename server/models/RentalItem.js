const mongoose = require('mongoose');

const rentalItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  type: { type: String, enum: ['Camera', 'Lens', 'Accessory'], required: true },
  description: { type: String },
  imageUrl: { type: String },
  pricePerDay: { type: Number, required: true },
  availability: { type: Boolean, default: true },
});

module.exports = mongoose.model('RentalItem', rentalItemSchema);
