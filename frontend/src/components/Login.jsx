import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(email, password);
      navigate('/');
    } catch (err) {
      alert('Login Failed: Invalid credentials');
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }} className="glass">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Welcome Back</h2>
      <form onSubmit={handleSubmit}>
        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Login</button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>Don't have an account? <Link to="/register" style={{ color: 'var(--primary)' }}>Sign Up</Link></p>
      
      
    </div>
  );
};

export default Login;
