const express = require('express');
const router = express.Router();
const Theater = require('../models/Theater');

// Get all theaters (optional: filter by city)
router.get('/', async (req, res) => {
  try {
    const query = req.query.city ? { city: req.query.city } : {};
    const theaters = await Theater.find(query);
    res.json(theaters);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching theaters', error: error.message });
  }
});

// Get unique cities
router.get('/cities', async (req, res) => {
  try {
    const cities = await Theater.distinct('city');
    res.json(cities);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching cities', error: error.message });
  }
});

module.exports = router;
