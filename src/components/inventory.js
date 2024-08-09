import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import AddItem from './additem';

function Inventory() {
  const [items, setItems] = useState([]);
  const [showAddItem, setShowAddItem] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchItems();
  }, []);

  function fetchItems() {
    const token = localStorage.getItem('token');
    console.log('Token being sent:', token);
    fetch('http://localhost:5000/api/items', {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })
    .then(response => {
      console.log('Response status:', response.status);
      if (response.status === 401 || response.status === 403) {
        localStorage.removeItem('token');
        navigate('/login');
        throw new Error('Authentication failed. Please log in again.');
      }
      if (!response.ok) {
        return response.text().then(text => {
          throw new Error(`Server responded with ${response.status}: ${text}`);
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Fetched items:', data);
      setItems(data);
    })
    .catch(error => {
      console.error('Error fetching items:', error);
      setError('Error fetching items: ' + error.message);
    });
  }

  return (
    <div>
      <h2>Inventory</h2>
      <button onClick={() => setShowAddItem(!showAddItem)}>
        {showAddItem ? 'Hide Add Item Form' : 'Show Add Item Form'}
      </button>
      
      {showAddItem && <AddItem />}
      
      {error && <p style={{color: 'red'}}>{error}</p>}

      {!error && items.length === 0 ? (
        <p>No items in inventory.</p>
      ) : (
        <ul>
          {items.map(item => (
            <li key={item.id}>
              <Link to={'/item/' + item.id}>
                {item.itemName} - Quantity: {item.quantity}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Inventory;