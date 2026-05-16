import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { ChevronLeft } from 'lucide-react';

const ROWS = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];
const SEATS_PER_ROW = 12;

const SeatSelection = () => {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);

  const [showtime, setShowtime] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [bookedSeats, setBookedSeats] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isBooking, setIsBooking] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [showRes, bookingsRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/showtimes/${showtimeId}`),
          axios.get(`http://localhost:5000/api/bookings/showtime/${showtimeId}`)
        ]);

        setShowtime(showRes.data);
        const allBooked = bookingsRes.data.flatMap(booking => booking.selectedSeats);
        setBookedSeats(allBooked);
      } catch (error) {
        console.error("Failed to fetch seat data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [showtimeId]);

  const toggleSeat = (seatId) => {
    if (bookedSeats.includes(seatId)) return;

    if (selectedSeats.includes(seatId)) {
      setSelectedSeats(selectedSeats.filter(id => id !== seatId));
    } else {
      setSelectedSeats([...selectedSeats, seatId]);
    }
  };

  const handleBooking = async () => {
    if (!user) {
      alert("Please login first to book tickets!");
      navigate('/login');
      return;
    }
    if (selectedSeats.length === 0) return alert('Please select at least one seat');

    setIsBooking(true);
    try {
      const totalAmount = selectedSeats.length * showtime.price;
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/bookings', {
        showtimeId: showtime._id,
        selectedSeats,
        totalAmount
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(`Booking Confirmed! Enjoy ${showtime.movie.title} at ${showtime.theater.name}`);
      navigate('/mybookings');
    } catch (error) {
      console.error("Booking failed", error);
      alert('Booking failed. Please try again.');
    } finally {
      setIsBooking(false);
    }
  }

  if (loading) return <div>Loading seating chart...</div>;
  if (!showtime) return <div>Showtime not found.</div>;

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
        <ChevronLeft size={20} /> Back to Theaters
      </button>

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap' }}>
        {/* Seating Layout */}
        <div style={{ flex: '2', minWidth: '350px' }}>
          <div style={{ background: '#4b5563', height: '8px', width: '80%', margin: '0 auto 3rem auto', borderRadius: '4px', boxShadow: '0 10px 20px rgba(255,255,255,0.2)' }}>
            <p style={{ textAlign: 'center', marginTop: '1rem', color: 'var(--text-muted)', fontSize: '0.8rem', letterSpacing: '4px', textTransform: 'uppercase' }}>Screen This Way</p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem', alignItems: 'center' }}>
            {ROWS.map(row => (
              <div key={row} style={{ display: 'flex', gap: '0.8rem', alignItems: 'center' }}>
                <span style={{ width: '20px', color: 'var(--text-muted)', fontWeight: 'bold' }}>{row}</span>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  {Array.from({ length: SEATS_PER_ROW }).map((_, i) => {
                    const seatNumber = `${row}${i + 1}`;
                    const isBooked = bookedSeats.includes(seatNumber);
                    const isSelected = selectedSeats.includes(seatNumber);

                    let backgroundColor = '#374151'; // empty
                    if (isBooked) backgroundColor = '#ef4444'; // red
                    if (isSelected) backgroundColor = 'var(--primary)'; // selected

                    return (
                      <button
                        key={seatNumber}
                        onClick={() => toggleSeat(seatNumber)}
                        disabled={isBooked}
                        style={{
                          width: '28px',
                          height: '28px',
                          borderRadius: '6px 6px 2px 2px',
                          background: backgroundColor,
                          border: 'none',
                          cursor: isBooked ? 'not-allowed' : 'pointer',
                          transform: isSelected ? 'scale(1.1) translateY(-2px)' : 'none',
                          transition: 'all 0.2s',
                          boxShadow: isSelected ? '0 4px 10px rgba(229,9,20,0.5)' : 'none',
                          fontSize: '0.65rem',
                          color: isSelected ? 'white' : 'transparent'
                        }}
                      />
                    );
                  })}
                </div>
                <span style={{ width: '20px', color: 'var(--text-muted)', fontWeight: 'bold', textAlign: 'right' }}>{row}</span>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginTop: '3rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '16px', height: '16px', background: '#374151', borderRadius: '4px' }}></div> Available</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '16px', height: '16px', background: 'var(--primary)', borderRadius: '4px' }}></div> Selected</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><div style={{ width: '16px', height: '16px', background: '#ef4444', borderRadius: '4px' }}></div> Unavailable</div>
          </div>
        </div>

        {/* Checkout Sidebar */}
        <div style={{ flex: '1', minWidth: '300px', background: 'rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '12px', border: '1px solid var(--border-color)', height: 'fit-content' }}>
          <h3 style={{ marginBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem' }}>Booking Summary</h3>
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '1.5rem' }}>
            <img src={showtime.movie.poster} style={{ width: '60px', borderRadius: '6px' }} referrerPolicy="no-referrer" />
            <div>
              <p style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{showtime.movie.title}</p>
              <p style={{ color: 'var(--text-muted)' }}>{showtime.theater.name}</p>
            </div>
          </div>

          <p style={{ marginBottom: '0.8rem' }}><strong>Time:</strong> {showtime.time} - {showtime.date}</p>
          <p style={{ marginBottom: '0.8rem' }}><strong>Seats ({selectedSeats.length}):</strong> {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None selected'}</p>

          <div style={{ marginTop: '2rem', paddingTop: '1rem', borderTop: '1px solid var(--border-color)', marginBottom: '2rem' }}>
            <p style={{ display: 'flex', justifyContent: 'space-between', fontSize: '1.2rem', fontWeight: 'bold' }}>
              <span>Total Price:</span>
              <span>₹{selectedSeats.length * showtime.price}</span>
            </p>
          </div>

          {user ? (
            <button
              onClick={handleBooking}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem' }}
              disabled={selectedSeats.length === 0 || isBooking}
            >
              {isBooking ? 'Processing...' : 'Pay & Confirm'}
            </button>
          ) : (
            <button
              onClick={() => navigate('/login')}
              className="btn-primary"
              style={{ width: '100%', marginTop: '1rem', background: '#374151', padding: '1rem', fontSize: '1.1rem' }}
            >
              Login to Book
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatSelection;
