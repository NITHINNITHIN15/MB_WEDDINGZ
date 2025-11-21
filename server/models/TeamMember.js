const mongoose = require('mongoose');

const teamMemberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  role: String,
  bio: String,
  imageUrl: String,
  socials: {
    instagram: String,
    facebook: String,
  }
}, { timestamps: true });

module.exports = mongoose.model('TeamMember', teamMemberSchema);
