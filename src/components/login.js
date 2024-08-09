import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function handleSubmit(e) {
    e.preventDefault();
    fetch('http://localhost:5000/api/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, password }),
    })
    .then(response => response.json())
    .then(data => {
      console.log('Login response:', data);
      if (data.token) {
        localStorage.setItem('token', data.token);
        console.log('Token stored:', data.token);
        navigate('/inventory');
      } else {
        alert('Login failed: ' + (data.error || 'Unknown error'));
      }
    })
    .catch(error => {
      console.error('Login error:', error);
      alert('An error occurred during login');
    });
  }

  return (
    <div>
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Username" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" />
        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;