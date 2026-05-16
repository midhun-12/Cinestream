import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Signup = () => {
  const { register } = useContext(AuthContext);
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(name, email, password);
      navigate('/');
    } catch (err) {
      alert('Signup Failed: ' + (err.response?.data?.message || 'Error occurred'));
    }
  };

  return (
    <div style={{ maxWidth: '400px', margin: '4rem auto', padding: '2rem' }} className="glass">
      <h2 style={{ marginBottom: '2rem', textAlign: 'center' }}>Create an Account</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" placeholder="Full Name" required value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email Address" required value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>Sign Up</button>
      </form>
      <p style={{ marginTop: '1.5rem', textAlign: 'center' }}>Already have an account? <Link to="/login" style={{ color: 'var(--primary)' }}>Login</Link></p>
    </div>
  );
};

export default Signup;
