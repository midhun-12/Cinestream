const express = require('express');
const router = express.Router();
const Showtime = require('../models/Showtime');

// Get showtimes for a movie (optionally filter by city and date)
router.get('/', async (req, res) => {
  try {
    const { movieId, city, date } = req.query;
    if (!movieId) return res.status(400).json({ message: 'movieId is required' });

    // First we'll populate the theater to filter by city
    let showtimes = await Showtime.find({ movie: movieId })
      .populate('theater')
      .populate('movie', 'title poster format language duration');

    // Filter in JS for simplicity, though could be done in Mongo aggregation
    if (city) {
      showtimes = showtimes.filter(st => st.theater && st.theater.city === city);
    }
    if (date) {
      showtimes = showtimes.filter(st => st.date === date);
    }

    res.json(showtimes);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching showtimes', error: error.message });
  }
});

// Get single showtime by ID
router.get('/:id', async (req, res) => {
  try {
    const showtime = await Showtime.findById(req.params.id)
      .populate('theater')
      .populate('movie', 'title poster');
    if (!showtime) return res.status(404).json({ message: 'Showtime not found' });
    res.json(showtime);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching showtime', error: error.message });
  }
});

module.exports = router;
