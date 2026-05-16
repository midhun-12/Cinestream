import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Film, User as UserIcon, LogOut, Shield } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <nav className="navbar glass">
      <Link to="/" className="brand">
        <Film size={28} color="var(--primary)" />
        CineStream
      </Link>
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        {user ? (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-muted)' }}>
              <UserIcon size={18} /> Hi, {user.name.split(' ')[0]}
            </div>
            {user.isAdmin && (
              <Link
                to="/admin"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  color: '#facc15',
                  fontWeight: 700,
                  padding: '0.4rem 1rem',
                  borderRadius: '8px',
                  background: 'rgba(250,204,21,0.12)',
                  border: '1px solid rgba(250,204,21,0.3)',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(250,204,21,0.22)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(250,204,21,0.12)'}
              >
                <Shield size={16} /> Admin
              </Link>
            )}
            <Link to="/mybookings" style={{ color: 'white' }}>My Tickets</Link>
            <button onClick={handleLogout} style={{ background: 'transparent', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <LogOut size={16} /> Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ color: 'white' }}>Login</Link>
            <Link to="/register" className="btn-primary" style={{ padding: '0.5rem 1.5rem' }}>Sign Up</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
