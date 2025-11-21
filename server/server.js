const dotenv = require('dotenv');
dotenv.config(); // ✅ Load environment variables first

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// app.use('/uploads', express.static('uploads'));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/uploads/rentals', express.static(path.join(__dirname, 'uploads', 'rentals')));


// Routes
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/contacts', require('./routes/contacts'));
app.use('/api/gallery', require('./routes/gallery'));
app.use('/api/testimonials', require('./routes/testimonials'));
app.use('/api/admin', require('./routes/admin'));
app.use('/api/team', require('./routes/teamRoutes'));
app.use('/api/services', require('./routes/services'));
app.use('/api/rentals', require('./routes/rentals'));
app.use('/api/rental-bookings', require('./routes/rentalBookings'));


// app.use('/uploads', express.static('uploads'));


// MongoDB connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/mb_weddings', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB connected successfully'))
.catch((err) => console.error('❌ MongoDB connection error:', err));

// Basic route
app.get('/', (req, res) => {
  res.json({ message: 'MB_WEDDINGS API is running!' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: 'Something went wrong!', error: err.message });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server is running on http://localhost:${PORT}`);
});
