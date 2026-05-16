const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Booking = require('../models/Booking');
const authMiddleware = require('../middleware/auth');

// Create a new booking
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { showtimeId, selectedSeats, totalAmount } = req.body;

    const newBooking = new Booking({
      user: req.user.userId,
      showtime: showtimeId,
      selectedSeats,
      totalAmount
    });

    const savedBooking = await newBooking.save();
    res.status(201).json(savedBooking);
  } catch (error) {
    res.status(500).json({ message: 'Error creating booking', error: error.message });
  }
});

// Get bookings for a specific showtime (to show disabled seats)
router.get('/showtime/:showtimeId', async (req, res) => {
  try {
    const bookings = await Booking.find({ showtime: req.params.showtimeId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching bookings', error: error.message });
  }
});

// Get my bookings (protected)
router.get('/mybookings', authMiddleware, async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user.userId })
      .populate({
        path: 'showtime',
        populate: [
          { path: 'movie', select: 'title poster' },
          { path: 'theater', select: 'name city locality' }
        ]
      })
      .sort({ bookingDate: -1 });

    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user bookings', error: error.message });
  }
});

module.exports = router;
