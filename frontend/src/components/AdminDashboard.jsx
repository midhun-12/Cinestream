import React, { useState, useEffect, useContext, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import {
  LayoutDashboard, Ticket, Film, Users, Trash2,
  XCircle, Edit2, Plus, X, CheckCircle, AlertTriangle,
  DollarSign, TrendingUp, ChevronDown, Save, RefreshCw
} from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const API = 'http://localhost:5000/api/admin';

const getToken = () => localStorage.getItem('token');
const authHeader = () => ({ Authorization: `Bearer ${getToken()}` });

// ── Stat Card ─────────────────────────────────────────────────────
const StatCard = ({ icon: Icon, label, value, color, prefix = '' }) => (
  <div style={{
    background: 'rgba(28,36,56,0.7)',
    border: `1px solid ${color}33`,
    borderRadius: '16px',
    padding: '1.8rem',
    display: 'flex',
    alignItems: 'center',
    gap: '1.4rem',
    backdropFilter: 'blur(10px)',
    boxShadow: `0 4px 24px ${color}18`,
    transition: 'transform 0.2s',
    flex: '1',
    minWidth: '200px'
  }}
    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-4px)'}
    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
  >
    <div style={{
      width: '56px', height: '56px', borderRadius: '14px',
      background: `${color}22`, display: 'flex', alignItems: 'center',
      justifyContent: 'center', flexShrink: 0
    }}>
      <Icon size={26} color={color} />
    </div>
    <div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.3rem' }}>{label}</p>
      <p style={{ fontSize: '2rem', fontWeight: 800, color: '#fff' }}>{prefix}{typeof value === 'number' ? value.toLocaleString() : value}</p>
    </div>
  </div>
);

// ── Badge ─────────────────────────────────────────────────────────
const Badge = ({ status }) => (
  <span style={{
    padding: '0.25rem 0.75rem',
    borderRadius: '999px',
    fontSize: '0.75rem',
    fontWeight: 700,
    background: status === 'confirmed' ? '#16a34a22' : '#dc262622',
    color: status === 'confirmed' ? '#4ade80' : '#f87171',
    border: `1px solid ${status === 'confirmed' ? '#4ade8033' : '#f8717133'}`
  }}>
    {status === 'confirmed' ? '✓ Confirmed' : '✗ Cancelled'}
  </span>
);

// ── Movie Modal ───────────────────────────────────────────────────
const MovieModal = ({ movie, onClose, onSave }) => {
  const emptyForm = {
    title: '', description: '', poster: '', trailerUrl: '',
    genre: '', language: 'English', format: 'Standard', duration: 120
  };
  const [form, setForm] = useState(movie || emptyForm);
  const [saving, setSaving] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    await onSave(form);
    setSaving(false);
  };

  const inputStyle = {
    width: '100%', padding: '0.7rem 1rem',
    background: 'rgba(255,255,255,0.05)',
    border: '1px solid var(--border-color)',
    borderRadius: '8px', color: 'white',
    fontSize: '0.95rem', marginBottom: '1rem', fontFamily: 'inherit'
  };
  const labelStyle = { display: 'block', color: 'var(--text-muted)', fontSize: '0.8rem', marginBottom: '0.3rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center',
      justifyContent: 'center', zIndex: 1000, padding: '1rem'
    }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        background: '#0f172a', border: '1px solid var(--border-color)',
        borderRadius: '20px', width: '100%', maxWidth: '580px',
        maxHeight: '90vh', overflowY: 'auto', padding: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.4rem', color: 'var(--primary)' }}>
            {movie ? 'Edit Movie' : 'Add New Movie'}
          </h2>
          <button onClick={onClose} style={{ background: 'none', color: 'var(--text-muted)' }}>
            <X size={22} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <label style={labelStyle}>Title</label>
          <input name="title" value={form.title} onChange={handleChange} required placeholder="Movie title" style={inputStyle} />

          <label style={labelStyle}>Description</label>
          <textarea name="description" value={form.description} onChange={handleChange} rows={3}
            placeholder="Short synopsis..." required
            style={{ ...inputStyle, resize: 'vertical' }} />

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={labelStyle}>Genre</label>
              <input name="genre" value={form.genre} onChange={handleChange} placeholder="Action / Drama" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Format</label>
              <select name="format" value={form.format} onChange={handleChange}
                style={{ ...inputStyle, cursor: 'pointer' }}>
                {['Standard', 'IMAX', 'IMAX 3D', 'Dolby Cinema', '3D', 'IMAX 70mm'].map(f => (
                  <option key={f} value={f} style={{ background: '#0f172a' }}>{f}</option>
                ))}
              </select>
            </div>
            <div>
              <label style={labelStyle}>Language</label>
              <input name="language" value={form.language} onChange={handleChange} placeholder="English" style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Duration (min)</label>
              <input name="duration" type="number" value={form.duration} onChange={handleChange} min={1} style={inputStyle} />
            </div>
          </div>

          <label style={labelStyle}>Poster URL</label>
          <input name="poster" value={form.poster} onChange={handleChange} placeholder="https://..." style={inputStyle} />

          <label style={labelStyle}>Trailer YouTube Embed URL</label>
          <input name="trailerUrl" value={form.trailerUrl} onChange={handleChange}
            placeholder="https://www.youtube.com/embed/VIDEO_ID?autoplay=1&mute=1" style={inputStyle} />

          <button type="submit" className="btn-primary" disabled={saving}
            style={{ width: '100%', marginTop: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
            {saving ? <RefreshCw size={16} style={{ animation: 'spin 1s linear infinite' }} /> : <Save size={16} />}
            {saving ? 'Saving...' : 'Save Movie'}
          </button>
        </form>
      </div>
    </div>
  );
};

// ── Confirm Dialog ────────────────────────────────────────────────
const ConfirmDialog = ({ message, onConfirm, onCancel, danger = true }) => (
  <div style={{
    position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)',
    backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center',
    justifyContent: 'center', zIndex: 1001
  }}>
    <div style={{
      background: '#0f172a', border: '1px solid var(--border-color)',
      borderRadius: '16px', padding: '2rem', maxWidth: '400px', width: '90%', textAlign: 'center'
    }}>
      <AlertTriangle size={40} color={danger ? '#f87171' : '#facc15'} style={{ marginBottom: '1rem' }} />
      <p style={{ marginBottom: '1.5rem', fontSize: '1.05rem' }}>{message}</p>
      <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        <button onClick={onCancel} style={{
          padding: '0.6rem 1.5rem', borderRadius: '8px',
          background: 'rgba(255,255,255,0.08)', color: 'white', fontWeight: 600
        }}>Cancel</button>
        <button onClick={onConfirm} style={{
          padding: '0.6rem 1.5rem', borderRadius: '8px',
          background: danger ? 'var(--primary)' : '#ca8a04', color: 'white', fontWeight: 600
        }}>Confirm</button>
      </div>
    </div>
  </div>
);

// ── Toast ─────────────────────────────────────────────────────────
const Toast = ({ message, type }) => (
  <div style={{
    position: 'fixed', bottom: '2rem', right: '2rem',
    background: type === 'success' ? '#16a34a' : '#dc2626',
    color: 'white', padding: '0.9rem 1.5rem', borderRadius: '12px',
    display: 'flex', alignItems: 'center', gap: '0.6rem',
    boxShadow: '0 8px 24px rgba(0,0,0,0.4)', zIndex: 2000,
    animation: 'slideIn 0.3s ease',
    fontWeight: 600
  }}>
    {type === 'success' ? <CheckCircle size={18} /> : <XCircle size={18} />}
    {message}
  </div>
);

// ── Main Dashboard ────────────────────────────────────────────────
const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState('overview');
  const [stats, setStats] = useState(null);
  const [bookings, setBookings] = useState([]);
  const [movies, setMovies] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [movieModal, setMovieModal] = useState(null); // null | 'new' | movieObj
  const [confirm, setConfirm] = useState(null);
  const [toast, setToast] = useState(null);
  const [bookingFilter, setBookingFilter] = useState('all');

  // Guard
  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    if (!user.isAdmin) { navigate('/'); return; }
  }, [user, navigate]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3500);
  };

  // Fetch data
  const fetchStats = useCallback(async () => {
    const res = await axios.get(`${API}/stats`, { headers: authHeader() });
    setStats(res.data);
  }, []);

  const fetchBookings = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/bookings`, { headers: authHeader() });
      setBookings(res.data);
    } finally { setLoading(false); }
  }, []);

  const fetchMovies = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/movies`, { headers: authHeader() });
      setMovies(res.data);
    } finally { setLoading(false); }
  }, []);

  const fetchUsers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API}/users`, { headers: authHeader() });
      setUsers(res.data);
    } finally { setLoading(false); }
  }, []);

  useEffect(() => {
    if (!user?.isAdmin) return;
    fetchStats();
    if (activeTab === 'bookings') fetchBookings();
    if (activeTab === 'movies') fetchMovies();
    if (activeTab === 'users') fetchUsers();
  }, [activeTab, user]);

  // Booking actions
  const cancelBooking = async (id) => {
    try {
      await axios.put(`${API}/bookings/${id}/cancel`, {}, { headers: authHeader() });
      setBookings(b => b.map(bk => bk._id === id ? { ...bk, status: 'cancelled' } : bk));
      showToast('Booking cancelled successfully');
    } catch { showToast('Failed to cancel booking', 'error'); }
    setConfirm(null);
  };

  const deleteBooking = async (id) => {
    try {
      await axios.delete(`${API}/bookings/${id}`, { headers: authHeader() });
      setBookings(b => b.filter(bk => bk._id !== id));
      showToast('Booking deleted');
      await fetchStats();
    } catch { showToast('Failed to delete booking', 'error'); }
    setConfirm(null);
  };

  // Movie actions
  const saveMovie = async (form) => {
    try {
      if (movieModal === 'new') {
        const res = await axios.post(`${API}/movies`, form, { headers: authHeader() });
        setMovies(m => [res.data, ...m]);
        showToast('Movie added!');
      } else {
        const res = await axios.put(`${API}/movies/${movieModal._id}`, form, { headers: authHeader() });
        setMovies(m => m.map(mv => mv._id === movieModal._id ? res.data : mv));
        showToast('Movie updated!');
      }
      setMovieModal(null);
      fetchStats();
    } catch { showToast('Failed to save movie', 'error'); }
  };

  const deleteMovie = async (id) => {
    try {
      await axios.delete(`${API}/movies/${id}`, { headers: authHeader() });
      setMovies(m => m.filter(mv => mv._id !== id));
      showToast('Movie and related data deleted');
      fetchStats();
    } catch { showToast('Failed to delete movie', 'error'); }
    setConfirm(null);
  };

  // Filtered bookings
  const filteredBookings = bookingFilter === 'all' ? bookings
    : bookings.filter(b => b.status === bookingFilter);

  // Tabs config
  const tabs = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'bookings', label: 'Bookings', icon: Ticket },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'users', label: 'Users', icon: Users },
  ];

  const tableHead = {
    background: 'rgba(255,255,255,0.04)',
    padding: '0.9rem 1rem',
    textAlign: 'left',
    color: 'var(--text-muted)',
    fontSize: '0.78rem',
    fontWeight: 700,
    textTransform: 'uppercase',
    letterSpacing: '0.06em',
    whiteSpace: 'nowrap'
  };
  const tableCell = {
    padding: '1rem',
    borderBottom: '1px solid rgba(255,255,255,0.04)',
    fontSize: '0.9rem',
    verticalAlign: 'middle'
  };
  const actionBtn = (color) => ({
    padding: '0.4rem 0.8rem', borderRadius: '7px', fontWeight: 600,
    fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '0.3rem',
    background: `${color}18`, color: color, border: `1px solid ${color}33`,
    cursor: 'pointer', transition: 'all 0.15s', fontFamily: 'inherit'
  });

  if (!user?.isAdmin) return null;

  return (
    <div style={{ minHeight: '100vh', padding: '0', maxWidth: '100%' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes slideIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        .admin-tab-content { animation: fadeIn 0.25s ease; }
        .action-btn:hover { filter: brightness(1.2); transform: scale(1.05); }
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(255,255,255,0.15); border-radius: 3px; }
      `}</style>

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #0f172a 0%, #1c1033 100%)',
        borderBottom: '1px solid var(--border-color)',
        padding: '2rem 2.5rem 0',
        marginBottom: '2rem'
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, background: 'linear-gradient(90deg, #facc15, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', marginBottom: '0.2rem' }}>
              Admin Dashboard
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              Manage bookings, movies, and users — CineStream Control Center
            </p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', background: 'rgba(250,204,21,0.12)', border: '1px solid rgba(250,204,21,0.3)', borderRadius: '10px', padding: '0.5rem 1rem' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', boxShadow: '0 0 6px #4ade80', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#facc15', fontWeight: 700, fontSize: '0.85rem' }}>Admin: {user?.name}</span>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ display: 'flex', gap: '0.25rem' }}>
          {tabs.map(tab => {
            const Icon = tab.icon;
            const active = activeTab === tab.id;
            return (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '0.75rem 1.5rem',
                  background: active ? 'rgba(229,9,20,0.15)' : 'transparent',
                  color: active ? 'var(--primary)' : 'var(--text-muted)',
                  border: 'none',
                  borderBottom: active ? '2px solid var(--primary)' : '2px solid transparent',
                  borderRadius: '8px 8px 0 0',
                  fontWeight: active ? 700 : 500,
                  display: 'flex', alignItems: 'center', gap: '0.5rem',
                  cursor: 'pointer', transition: 'all 0.2s', fontSize: '0.9rem',
                  fontFamily: 'inherit'
                }}
              >
                <Icon size={16} /> {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      <div style={{ padding: '0 2.5rem 3rem' }}>

        {/* ── OVERVIEW TAB ── */}
        {activeTab === 'overview' && (
          <div className="admin-tab-content">
            {stats ? (
              <>
                <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', marginBottom: '2.5rem' }}>
                  <StatCard icon={Ticket} label="Total Bookings" value={stats.totalBookings} color="#e50914" />
                  <StatCard icon={DollarSign} label="Total Revenue" value={stats.totalRevenue} color="#4ade80" prefix="₹" />
                  <StatCard icon={Film} label="Movies Listed" value={stats.totalMovies} color="#60a5fa" />
                  <StatCard icon={Users} label="Registered Users" value={stats.totalUsers} color="#c084fc" />
                </div>
                <div style={{
                  background: 'rgba(28,36,56,0.5)', border: '1px solid var(--border-color)',
                  borderRadius: '16px', padding: '2rem', backdropFilter: 'blur(10px)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.7rem', marginBottom: '1.2rem' }}>
                    <TrendingUp size={20} color="#facc15" />
                    <h3 style={{ color: '#facc15', fontSize: '1rem', fontWeight: 700 }}>Quick Actions</h3>
                  </div>
                  <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                    {[
                      { label: '📋 View All Bookings', tab: 'bookings', color: '#e50914' },
                      { label: '🎬 Manage Movies', tab: 'movies', color: '#60a5fa' },
                      { label: '👥 View Users', tab: 'users', color: '#c084fc' },
                    ].map(({ label, tab, color }) => (
                      <button key={tab} onClick={() => setActiveTab(tab)}
                        style={{
                          padding: '0.7rem 1.5rem', borderRadius: '10px',
                          background: `${color}15`, color: color,
                          border: `1px solid ${color}33`, fontWeight: 600,
                          cursor: 'pointer', fontFamily: 'inherit', transition: 'all 0.2s'
                        }}
                        onMouseEnter={e => e.currentTarget.style.background = `${color}25`}
                        onMouseLeave={e => e.currentTarget.style.background = `${color}15`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={32} style={{ animation: 'spin 1s linear infinite', marginBottom: '1rem' }} />
                <p>Loading stats...</p>
              </div>
            )}
          </div>
        )}

        {/* ── BOOKINGS TAB ── */}
        {activeTab === 'bookings' && (
          <div className="admin-tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>All Bookings</h2>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {['all', 'confirmed', 'cancelled'].map(f => (
                  <button key={f} onClick={() => setBookingFilter(f)}
                    style={{
                      padding: '0.4rem 1rem', borderRadius: '20px', cursor: 'pointer',
                      fontFamily: 'inherit', fontWeight: 600, fontSize: '0.82rem',
                      background: bookingFilter === f ? 'var(--primary)' : 'rgba(255,255,255,0.07)',
                      color: bookingFilter === f ? 'white' : 'var(--text-muted)',
                      border: bookingFilter === f ? 'none' : '1px solid var(--border-color)'
                    }}>{f.charAt(0).toUpperCase() + f.slice(1)}</button>
                ))}
              </div>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: '900px' }}>
                  <thead>
                    <tr>
                      {['User', 'Movie', 'Theater', 'Seats', 'Amount', 'Date', 'Status', 'Actions'].map(h => (
                        <th key={h} style={tableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filteredBookings.length === 0 ? (
                      <tr><td colSpan={8} style={{ ...tableCell, textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No bookings found.</td></tr>
                    ) : filteredBookings.map(b => (
                      <tr key={b._id} style={{ transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <td style={tableCell}>
                          <p style={{ fontWeight: 600 }}>{b.user?.name || 'Deleted'}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{b.user?.email}</p>
                        </td>
                        <td style={tableCell}>{b.showtime?.movie?.title || '—'}</td>
                        <td style={tableCell}>
                          <p>{b.showtime?.theater?.name || '—'}</p>
                          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>{b.showtime?.date} • {b.showtime?.time}</p>
                        </td>
                        <td style={tableCell}>
                          <span style={{ background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '0.2rem 0.6rem', fontSize: '0.82rem' }}>
                            {b.selectedSeats?.join(', ') || '—'}
                          </span>
                        </td>
                        <td style={{ ...tableCell, color: '#4ade80', fontWeight: 700 }}>₹{b.totalAmount}</td>
                        <td style={{ ...tableCell, color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                          {new Date(b.bookingDate).toLocaleDateString('en-IN')}
                        </td>
                        <td style={tableCell}><Badge status={b.status} /></td>
                        <td style={tableCell}>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {b.status === 'confirmed' && (
                              <button className="action-btn" style={actionBtn('#f97316')}
                                onClick={() => setConfirm({ msg: `Cancel booking for ${b.user?.name}?`, onConfirm: () => cancelBooking(b._id) })}>
                                <XCircle size={13} /> Cancel
                              </button>
                            )}
                            <button className="action-btn" style={actionBtn('#f87171')}
                              onClick={() => setConfirm({ msg: 'Permanently delete this booking record?', onConfirm: () => deleteBooking(b._id) })}>
                              <Trash2 size={13} /> Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── MOVIES TAB ── */}
        {activeTab === 'movies' && (
          <div className="admin-tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Movies ({movies.length})</h2>
              <button className="btn-primary"
                onClick={() => setMovieModal('new')}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1.4rem' }}>
                <Plus size={17} /> Add Movie
              </button>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {movies.map(m => (
                  <div key={m._id} style={{
                    background: 'rgba(28,36,56,0.6)', border: '1px solid var(--border-color)',
                    borderRadius: '14px', padding: '1.2rem 1.5rem',
                    display: 'flex', alignItems: 'center', gap: '1.5rem',
                    transition: 'border-color 0.2s',
                    backdropFilter: 'blur(8px)'
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
                    onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border-color)'}
                  >
                    <img src={m.poster} alt={m.title} style={{
                      width: '55px', height: '80px', objectFit: 'cover',
                      borderRadius: '8px', flexShrink: 0,
                      boxShadow: '0 4px 12px rgba(0,0,0,0.5)'
                    }} />
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '1.05rem', marginBottom: '0.2rem', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{m.title}</p>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{m.genre} • {m.format} • {m.duration} min</p>
                    </div>
                    <div style={{ display: 'flex', gap: '0.6rem', flexShrink: 0 }}>
                      <button className="action-btn" style={actionBtn('#60a5fa')}
                        onClick={() => setMovieModal(m)}>
                        <Edit2 size={13} /> Edit
                      </button>
                      <button className="action-btn" style={actionBtn('#f87171')}
                        onClick={() => setConfirm({ msg: `Delete "${m.title}" and all related showtimes/bookings?`, onConfirm: () => deleteMovie(m._id) })}>
                        <Trash2 size={13} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── USERS TAB ── */}
        {activeTab === 'users' && (
          <div className="admin-tab-content">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 style={{ fontSize: '1.4rem', fontWeight: 700 }}>Registered Users ({users.length})</h2>
            </div>
            {loading ? (
              <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>
                <RefreshCw size={28} style={{ animation: 'spin 1s linear infinite' }} />
              </div>
            ) : (
              <div style={{ overflowX: 'auto', borderRadius: '16px', border: '1px solid var(--border-color)' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead>
                    <tr>
                      {['#', 'Name', 'Email', 'Joined'].map(h => (
                        <th key={h} style={tableHead}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {users.length === 0 ? (
                      <tr><td colSpan={4} style={{ ...tableCell, textAlign: 'center', color: 'var(--text-muted)', padding: '3rem' }}>No users found.</td></tr>
                    ) : users.map((u, i) => (
                      <tr key={u._id}
                        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                        style={{ transition: 'background 0.15s' }}
                      >
                        <td style={{ ...tableCell, color: 'var(--text-muted)', width: '50px' }}>{i + 1}</td>
                        <td style={tableCell}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
                            <div style={{
                              width: '36px', height: '36px', borderRadius: '50%',
                              background: `hsl(${(u.name.charCodeAt(0) * 13) % 360},60%,45%)`,
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                              fontWeight: 700, fontSize: '0.9rem', flexShrink: 0
                            }}>
                              {u.name.charAt(0).toUpperCase()}
                            </div>
                            <span style={{ fontWeight: 600 }}>{u.name}</span>
                          </div>
                        </td>
                        <td style={{ ...tableCell, color: 'var(--text-muted)' }}>{u.email}</td>
                        <td style={{ ...tableCell, color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                          {new Date(u.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Movie Modal */}
      {movieModal && (
        <MovieModal
          movie={movieModal === 'new' ? null : movieModal}
          onClose={() => setMovieModal(null)}
          onSave={saveMovie}
        />
      )}

      {/* Confirm Dialog */}
      {confirm && (
        <ConfirmDialog
          message={confirm.msg}
          onConfirm={confirm.onConfirm}
          onCancel={() => setConfirm(null)}
        />
      )}

      {/* Toast */}
      {toast && <Toast message={toast.message} type={toast.type} />}
    </div>
  );
};

export default AdminDashboard;
