const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  poster: { type: String, required: true },
  bannerImage: { type: String },
  trailerUrl: { type: String },
  cast: [{
    name: String,
    image: String
  }],
  genre: { type: String, required: true },
  language: { type: String, default: "English" },
  format: { type: String, default: "2D" },
  duration: { type: Number, required: true } // in minutes
});

module.exports = mongoose.model('Movie', movieSchema);
