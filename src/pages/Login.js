import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import '../styles/LoginPage.css'; // optional: for page-level styling

const Login = () => {
  const navigate = useNavigate();
  const [error, setError] = useState('');

  const handleLogin = ({ username, password }) => {
    if (username === 'Abhinav' && password === '13016') {
      navigate('/home');
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-page">
      {/* ✅ Add Project Heading */}
      <header className="login-header">
        <h1>Astronomy Data Visualizer 🌌</h1>
        <p>Explore stars, planets, and constellations interactively in real-time.</p>
      </header>

      <LoginForm onLogin={handleLogin} />

      {error && <p style={{ color: 'red', textAlign: 'center' }}>{error}</p>}
    </div>
  );
};

export default Login;
