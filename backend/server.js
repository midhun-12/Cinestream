require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
.then(() => console.log('MongoDB connection successful'))
.catch((err) => {
  console.error('MongoDB connection error:', err.message);
  console.log('⚠️ Running backend in DEMO mode due to DB Auth error! API will use fallback data.');
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/movies', require('./routes/movies'));
app.use('/api/theaters', require('./routes/theaters'));
app.use('/api/showtimes', require('./routes/showtimes'));
app.use('/api/bookings', require('./routes/bookings'));
app.use('/api/admin', require('./routes/admin'));

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
