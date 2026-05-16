import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { MapPin, ChevronLeft } from 'lucide-react';

const TheaterSelection = () => {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city');
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Group showtimes by theater
  const theatersWithShowtimes = showtimes.reduce((acc, st) => {
    if (!acc[st.theater.name]) {
      acc[st.theater.name] = { theater: st.theater, times: [] };
    }
    acc[st.theater.name].times.push(st);
    return acc;
  }, {});

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const [movieRes, showtimesRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/movies/${id}`),
          axios.get(`http://localhost:5000/api/showtimes?movieId=${id}${city ? '&city=' + city : ''}`)
        ]);
        setMovie(movieRes.data);
        setShowtimes(showtimesRes.data);
      } catch (error) {
        console.error("Failed to fetch showtimes", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id, city]);

  if (loading) return <div>Loading theaters...</div>;
  if (!movie) return <div>Movie not found.</div>;

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto' }}>
      <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
        <ChevronLeft size={20} /> Back to Movie
      </button>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', marginBottom: '3rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
        <img src={movie.poster} alt={movie.title} style={{ width: '80px', borderRadius: '8px' }} referrerPolicy="no-referrer" />
        <div>
          <h1 style={{ fontSize: '2rem', marginBottom: '0.2rem' }}>{movie.title}</h1>
          <p style={{ color: 'var(--text-muted)' }}>{movie.format} • {movie.language} • {movie.genre}</p>
        </div>
      </div>

      <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <h2 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><MapPin size={24} color="var(--primary)"/> Theaters in {city || 'All Locations'}</h2>
      </div>

      {Object.keys(theatersWithShowtimes).length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center', borderRadius: '12px' }}>
          <p style={{ color: 'var(--text-muted)' }}>No showtimes available for this city currently.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          {Object.values(theatersWithShowtimes).map(({ theater, times }) => (
            <div key={theater._id} className="glass" style={{ padding: '1.5rem 2rem', borderRadius: '12px' }}>
              <h3 style={{ marginBottom: '0.5rem', fontSize: '1.3rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                {theater.name}
              </h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{theater.locality}</p>
              
              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                {times.map(st => (
                  <button 
                    key={st._id} 
                    onClick={() => navigate(`/seatselection/${st._id}`)}
                    style={{ 
                      padding: '0.8rem 1.5rem', 
                      borderRadius: '8px', 
                      background: 'rgba(255,255,255,0.05)',
                      color: 'var(--primary)',
                      border: `1px solid var(--border-color)`,
                      minWidth: '120px',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      gap: '0.3rem',
                      transition: 'all 0.2s',
                    }}
                    onMouseOver={(e) => { e.currentTarget.style.borderColor = 'var(--primary)'; e.currentTarget.style.background = 'rgba(229,9,20,0.1)'; }}
                    onMouseOut={(e) => { e.currentTarget.style.borderColor = 'var(--border-color)'; e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; }}
                  >
                    <span style={{ fontSize: '1.1rem', fontWeight: 'bold' }}>{st.time}</span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>₹{st.price}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TheaterSelection;
