const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  showtime: { type: mongoose.Schema.Types.ObjectId, ref: 'Showtime', required: true },
  selectedSeats: [{ type: String, required: true }],
  totalAmount: { type: Number, required: true },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' },
  bookingDate: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Booking', bookingSchema);
