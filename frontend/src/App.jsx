import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './components/Home';
import MovieDetails from './components/MovieDetails';
import Login from './components/Login';
import Signup from './components/Signup';
import MyBookings from './components/MyBookings';
import TheaterSelection from './components/TheaterSelection';
import SeatSelection from './components/SeatSelection';
import AdminDashboard from './components/AdminDashboard';
import { AuthProvider } from './context/AuthContext';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Navbar />
          <main>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/movie/:id" element={<MovieDetails />} />
              <Route path="/buytickets/:id" element={<TheaterSelection />} />
              <Route path="/seatselection/:showtimeId" element={<SeatSelection />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Signup />} />
              <Route path="/mybookings" element={<MyBookings />} />
              <Route path="/admin" element={<AdminDashboard />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
