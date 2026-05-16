const mongoose = require('mongoose');

const theaterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  city: { type: String, required: true },
  locality: { type: String, required: true }
});

module.exports = mongoose.model('Theater', theaterSchema);
