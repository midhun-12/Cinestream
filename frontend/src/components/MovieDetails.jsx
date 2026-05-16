import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import axios from 'axios';
import { Clock, ChevronLeft } from 'lucide-react';

const MovieDetails = () => {
  // Trigger HMR specifically to clear stale state
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const city = searchParams.get('city');
  const navigate = useNavigate();
  
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const movieRes = await axios.get(`http://localhost:5000/api/movies/${id}`);
        setMovie(movieRes.data);
      } catch (error) {
        console.error("Failed to fetch movie details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div>Loading movie details...</div>;
  if (!movie) return <div>Movie not found.</div>;

  return (
    <div>
      <button onClick={() => navigate(-1)} style={{ background: 'none', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1.5rem', fontSize: '1rem' }}>
        <ChevronLeft size={20} /> Back to Movies
      </button>

      {/* Trailer Section */}
      {movie.trailerUrl && (
        <div style={{ marginBottom: '3rem', width: '100%', aspectRatio: '16/9', borderRadius: '16px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
          <iframe 
            width="100%" 
            height="100%" 
            src={movie.trailerUrl} 
            title={`${movie.title} Trailer`} 
            frameBorder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowFullScreen>
          </iframe>
        </div>
      )}

      <div style={{ display: 'flex', gap: '3rem', flexWrap: 'wrap', marginBottom: '3rem' }}>
        <img src={movie.poster} alt={movie.title} style={{ width: '300px', borderRadius: '16px', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }} referrerPolicy="no-referrer" />
        <div style={{ flex: '1', minWidth: '300px' }}>
          <h1 style={{ fontSize: '3rem', marginBottom: '0.5rem', color: 'var(--primary)' }}>{movie.title}</h1>
          <p className="movie-genre" style={{ fontSize: '1.2rem' }}>{movie.format} • {movie.language} • {movie.genre}</p>
          
          <div style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Clock size={20} /> {movie.duration} min
            </div>
          </div>

          <p style={{ fontSize: '1.1rem', lineHeight: '1.8', marginBottom: '2rem' }}>{movie.description}</p>
          
          <button 
            className="btn-primary" 
            style={{ fontSize: '1.2rem', padding: '1rem 3rem', width: '100%', maxWidth: '300px', display: 'flex', justifyContent: 'center' }}
            onClick={() => navigate(`/buytickets/${movie._id}?city=${city || ''}`)}
          >
            Book Tickets
          </button>
        </div>
      </div>

      {/* Cast Section */}
      {movie.cast && movie.cast.length > 0 && (
        <div style={{ marginTop: '4rem' }}>
          <h2 style={{ marginBottom: '1.5rem', fontSize: '2rem' }}>Cast</h2>
          <div style={{ display: 'flex', gap: '2rem', overflowX: 'auto', paddingBottom: '1rem' }}>
            {movie.cast.map(actor => (
              <div key={actor._id} style={{ textAlign: 'center', minWidth: '120px' }}>
                <img 
                  src={actor.image} 
                  alt={actor.name} 
                  style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem', border: '3px solid var(--border-color)' }} 
                  referrerPolicy="no-referrer"
                />
                <p style={{ fontWeight: 'bold' }}>{actor.name}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default MovieDetails;
