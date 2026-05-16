const mongoose = require('mongoose');

const showtimeSchema = new mongoose.Schema({
  movie: { type: mongoose.Schema.Types.ObjectId, ref: 'Movie', required: true },
  theater: { type: mongoose.Schema.Types.ObjectId, ref: 'Theater', required: true },
  date: { type: String, required: true }, // e.g. "2026-04-22"
  time: { type: String, required: true }, // e.g. "10:30 AM"
  price: { type: Number, default: 15 },
});

module.exports = mongoose.model('Showtime', showtimeSchema);
