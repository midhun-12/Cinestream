import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { Ticket } from 'lucide-react';

const MyBookings = () => {
  const { user } = useContext(AuthContext);
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get('http://localhost:5000/api/bookings/mybookings', {
          headers: { Authorization: `Bearer ${token}` }
        });
        setBookings(res.data);
      } catch (error) {
        console.error("Failed to fetch bookings", error);
      } finally {
        setLoading(false);
      }
    };
    
    if (user) fetchBookings();
  }, [user]);

  if (!user) return <div style={{ padding: '4rem', textAlign: 'center' }}>Please login to view bookings.</div>;
  if (loading) return <div style={{ padding: '4rem', textAlign: 'center' }}>Loading your tickets...</div>;

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 0' }}>
      <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '2rem' }}>
        <Ticket size={28} color="var(--primary)" /> My Tickets
      </h2>

      {bookings.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
          <h3>No bookings found</h3>
          <p style={{ color: 'var(--text-muted)' }}>Looks like you haven't booked any movies yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {bookings.map(booking => {
            const isCancelled = booking.status === 'cancelled';
            return (
              <div
                key={booking._id}
                className="glass"
                style={{
                  display: 'flex', gap: '1.5rem', padding: '1.5rem',
                  borderRadius: '12px', alignItems: 'center',
                  opacity: isCancelled ? 0.7 : 1,
                  border: isCancelled
                    ? '1px solid rgba(248,113,113,0.35)'
                    : '1px solid rgba(255,255,255,0.05)',
                  background: isCancelled ? 'rgba(220,38,38,0.07)' : undefined,
                  position: 'relative',
                  overflow: 'hidden'
                }}
              >
                {/* Diagonal CANCELLED ribbon */}
                {isCancelled && (
                  <div style={{
                    position: 'absolute', top: '16px', right: '-24px',
                    background: '#dc2626', color: 'white',
                    fontSize: '0.62rem', fontWeight: 800,
                    padding: '3px 36px', transform: 'rotate(35deg)',
                    letterSpacing: '0.1em', zIndex: 1, pointerEvents: 'none'
                  }}>
                    CANCELLED
                  </div>
                )}

                <img
                  src={booking.showtime.movie.poster}
                  alt=""
                  style={{
                    width: '100px', borderRadius: '8px',
                    filter: isCancelled ? 'grayscale(60%)' : 'none',
                    flexShrink: 0
                  }}
                  referrerPolicy="no-referrer"
                />

                <div style={{ flex: 1, minWidth: 0 }}>
                  {/* Title + Status badge */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', marginBottom: '0.3rem', flexWrap: 'wrap' }}>
                    <h3 style={{ fontSize: '1.4rem' }}>{booking.showtime.movie.title}</h3>
                    <span style={{
                      padding: '0.2rem 0.7rem', borderRadius: '999px',
                      fontSize: '0.72rem', fontWeight: 700,
                      background: isCancelled ? '#dc262622' : '#16a34a22',
                      color: isCancelled ? '#f87171' : '#4ade80',
                      border: `1px solid ${isCancelled ? '#f8717133' : '#4ade8033'}`
                    }}>
                      {isCancelled ? '✗ Cancelled' : '✓ Confirmed'}
                    </span>
                  </div>

                  <p style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                    {booking.showtime.theater.name}, {booking.showtime.theater.locality} ({booking.showtime.theater.city})
                  </p>
                  <div style={{ display: 'flex', gap: '1.5rem', marginTop: '1rem', fontSize: '0.95rem', flexWrap: 'wrap' }}>
                    <span><strong>Date:</strong> {booking.showtime.date}</span>
                    <span><strong>Time:</strong> {booking.showtime.time}</span>
                    <span><strong>Seats:</strong> {booking.selectedSeats.join(', ')}</span>
                  </div>
                </div>

                {/* Amount & status */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <div style={{
                    fontSize: '1.8rem', fontWeight: 'bold',
                    color: isCancelled ? 'var(--text-muted)' : 'var(--primary)',
                    textDecoration: isCancelled ? 'line-through' : 'none'
                  }}>
                    ₹{booking.totalAmount}
                  </div>
                  <div style={{
                    fontSize: '0.8rem',
                    color: isCancelled ? '#f87171' : 'var(--text-muted)',
                    fontWeight: isCancelled ? 700 : 400,
                    marginTop: '0.2rem'
                  }}>
                    {isCancelled ? 'Cancelled by Admin' : 'Paid'}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyBookings;
