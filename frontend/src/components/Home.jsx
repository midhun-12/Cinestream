import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { Play, MapPin } from 'lucide-react';

const Home = () => {
  // FORCE HMR RELOAD TO CLEAR CACHE
  const [movies, setMovies] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const citiesRes = await axios.get('http://localhost:5000/api/theaters/cities');
        setCities(citiesRes.data);
        if (citiesRes.data.length > 0) {
          setSelectedCity(citiesRes.data[0]);
        }

        const moviesRes = await axios.get('http://localhost:5000/api/movies');
        setMovies(moviesRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem' }}>Now Showing</h1>
          <p style={{ color: 'var(--text-muted)' }}>Book tickets for the latest movies.</p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(255,255,255,0.05)', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)' }}>
          <MapPin size={20} color="var(--primary)" />
          <select
            value={selectedCity}
            onChange={(e) => setSelectedCity(e.target.value)}
            style={{ background: 'transparent', color: 'white', border: 'none', outline: 'none', fontSize: '1rem', cursor: 'pointer' }}
          >
            {cities.map(city => (
              <option key={city} value={city} style={{ color: 'black' }}>{city}</option>
            ))}
          </select>
        </div>
      </div>

      {loading ? (
        <p>Loading movies...</p>
      ) : movies.length === 0 ? (
        <div className="glass" style={{ padding: '2rem', borderRadius: '12px', textAlign: 'center' }}>
          <h3>No Movies Found</h3>
        </div>
      ) : (
        <div className="movies-grid">
          {movies.map(movie => (
            <Link to={`/movie/${movie._id}?city=${selectedCity}`} key={movie._id} className="movie-card" style={{ display: 'block' }}>
              <img src={movie.poster} alt={movie.title} className="movie-poster" referrerPolicy="no-referrer" />
              <div className="movie-info">
                <h3 className="movie-title">{movie.title}</h3>
                <p className="movie-genre">{movie.genre}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;