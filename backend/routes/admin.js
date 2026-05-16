const express = require('express');
const router = express.Router();
const adminAuth = require('../middleware/adminAuth');
const Booking = require('../models/Booking');
const Movie = require('../models/Movie');
const User = require('../models/User');
const Showtime = require('../models/Showtime');

// ── Stats overview ──────────────────────────────────────────────
router.get('/stats', adminAuth, async (req, res) => {
  try {
    const [totalBookings, totalMovies, totalUsers, bookings] = await Promise.all([
      Booking.countDocuments(),
      Movie.countDocuments(),
      User.countDocuments({ isAdmin: false }),
      Booking.find({ status: 'confirmed' }, 'totalAmount')
    ]);
    const totalRevenue = bookings.reduce((sum, b) => sum + b.totalAmount, 0);
    res.json({ totalBookings, totalMovies, totalUsers, totalRevenue });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching stats', error: error.message });
  }
});

// ── Bookings ─────────────────────────────────────────────────────
router.get('/bookings', adminAuth, async (req, res) => {
  try {
    const bookings = await Booking.find()
      .populate('user', 'name email')
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster' },
          { path: 'theater', select: 'name city' }
        ]
      })
      .sort({ bookingDate: -1 });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Cancel a booking
router.put('/bookings/:id/cancel', adminAuth, async (req, res) => {
  try {
    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status: 'cancelled' },
      { new: true }
    );
    if (!booking) return res.status(404).json({ message: 'Booking not found' });
    res.json(booking);
  } catch (error) {
    res.status(500).json({ message: 'Error cancelling booking', error: error.message });
  }
});

// Delete a booking permanently
router.delete('/bookings/:id', adminAuth, async (req, res) => {
  try {
    await Booking.findByIdAndDelete(req.params.id);
    res.json({ message: 'Booking deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting booking', error: error.message });
  }
});

// ── Movies ────────────────────────────────────────────────────────
router.get('/movies', adminAuth, async (req, res) => {
  try {
    const movies = await Movie.find();
    res.json(movies);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching movies', error: error.message });
  }
});

router.post('/movies', adminAuth, async (req, res) => {
  try {
    const movie = new Movie(req.body);
    await movie.save();
    res.status(201).json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error creating movie', error: error.message });
  }
});

router.put('/movies/:id', adminAuth, async (req, res) => {
  try {
    const movie = await Movie.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!movie) return res.status(404).json({ message: 'Movie not found' });
    res.json(movie);
  } catch (error) {
    res.status(500).json({ message: 'Error updating movie', error: error.message });
  }
});

router.delete('/movies/:id', adminAuth, async (req, res) => {
  try {
    await Movie.findByIdAndDelete(req.params.id);
    // Also delete associated showtimes and bookings
    const showtimes = await Showtime.find({ movie: req.params.id });
    const showtimeIds = showtimes.map(s => s._id);
    await Booking.deleteMany({ showtime: { $in: showtimeIds } });
    await Showtime.deleteMany({ movie: req.params.id });
    res.json({ message: 'Movie and related showtimes/bookings deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting movie', error: error.message });
  }
});

// ── Users ─────────────────────────────────────────────────────────
router.get('/users', adminAuth, async (req, res) => {
  try {
    const users = await User.find({ isAdmin: false }).select('-password').sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
});

module.exports = router;
