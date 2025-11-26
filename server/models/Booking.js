const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true,
    lowercase: true,
  },
  phone: { type: String, required: true, trim: true },
  eventDate: { type: Date, required: true },
  eventType: {
    type: String,
    required: true,
    enum: [
      "WeddingPhotography",
      "PreWeddingShoots",
      "CulturalCeremonies",
      "FamilyPortraits",
      "MaternityInfantShoots",
      "EventCoverage",
      "CouplePortraitShoots",
      "CommercialShoots"
    ]
  },
  location: { type: String, required: true, trim: true },
  message: { type: String, required: true, trim: true },
  status: {
    type: String,
    default: "pending",
    enum: ["pending", "confirmed", "cancelled", "completed"],
  },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("Booking", bookingSchema);
