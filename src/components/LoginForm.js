import React, { useState } from 'react';
import '../styles/Login.css';

const LoginForm = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

 

  const handleSubmit = e => {
    e.preventDefault();
    onLogin({ username, password });
  };

  return (
    <form className="login-form" onSubmit={handleSubmit}>
      
      <h2>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        required
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        required
      />
      <button type="submit">Log In</button>
    </form>
  );
};

export default LoginForm;
