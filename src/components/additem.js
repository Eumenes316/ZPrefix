import React, { useState } from 'react';

function AddItem() {
  const [itemName, setItemName] = useState('');
  const [description, setDescription] = useState('');
  const [quantity, setQuantity] = useState(0);

  function handleSubmit(e) {
    e.preventDefault();
    
    fetch('http://localhost:5000/api/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + localStorage.getItem('token')
      },
      body: JSON.stringify({ itemName, description, quantity })
    })
    .then(response => response.json())
    .then(data => {
      console.log('Item added:', data);
      setItemName('');
      setDescription('');
      setQuantity(0);
      alert('Item added successfully!');
    })
    .catch(error => {
      console.log('Error adding item:', error);
      alert('Failed to add item');
    });
  }

  return (
    <div>
      <h2>Add New Item</h2>
      <form onSubmit={handleSubmit}>
        <input 
          type="text" 
          value={itemName} 
          onChange={(e) => setItemName(e.target.value)} 
          placeholder="Item Name" 
          required 
        />
        <textarea 
          value={description} 
          onChange={(e) => setDescription(e.target.value)} 
          placeholder="Description" 
          required 
        />
        <input 
          type="number" 
          value={quantity} 
          onChange={(e) => setQuantity(Number(e.target.value))} 
          placeholder="Quantity" 
          required 
        />
        <button type="submit">Add Item</button>
      </form>
    </div>
  );
}

export default AddItem;