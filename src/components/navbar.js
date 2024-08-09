import React from 'react';
import {Link} from 'react-router-dom';

function Navbar() {
  const isLoggedIn = localStorage.getItem('token') ? true : false;
  
  const name = localStorage.getItem('name');

  return (
    <div>
      <ul>
        <li><Link to="/inventory">Inventory</Link></li>
        {isLoggedIn ? (
          <div>
            <li>Welcome, {name}!</li>
            <li><button onClick={() => {
              localStorage.removeItem('token');
              localStorage.removeItem('name');
              window.location.href = '/login';
            }}>Logout</button></li>
          </div>
        ) : (
          <div>
            <li><Link to="/login">Login</Link></li>
            <li><Link to="/register">Register</Link></li>
          </div>
        )}
      </ul>
    </div>
  );
}

export default Navbar;