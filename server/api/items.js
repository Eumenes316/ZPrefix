const express = require('express');
const router = express.Router();
const checkToken = require('./auth'); 
const db = require('../config/database'); 

router.get('/', checkToken, (req, res) => {
  const userId = req.user.id;

  console.log(`Fetching all items for user: ${userId}`);

  const sql = "SELECT * FROM items WHERE userId = ?";
  db.all(sql, [userId], (err, items) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error getting items from database' });
    }
    console.log('Items found:', items);
    res.json(items);
  });
});

router.get('/:id', checkToken, (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.id;

  const sql = "SELECT * FROM items WHERE id = ? AND userId = ?";
  db.get(sql, [itemId, userId], (err, item) => {
    if (err) {
      return res.status(500).json({ error: 'Error getting item from database' });
    }
    if (!item) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json(item);
  });
});

router.post('/', checkToken, (req, res) => {
  const { itemName, description, quantity } = req.body;
  const userId = req.user.id;

  const sql = "INSERT INTO items (userId, itemName, description, quantity) VALUES (?, ?, ?, ?)";
  db.run(sql, [userId, itemName, description, quantity], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error adding item' });
    }
    res.status(201).json({ id: this.lastID, userId, itemName, description, quantity });
  });
});

router.put('/:id', checkToken, (req, res) => {
  const { itemName, description, quantity } = req.body;
  const userId = req.user.id;
  const itemId = req.params.id;

  const sql = "UPDATE items SET itemName = ?, description = ?, quantity = ? WHERE id = ? AND userId = ?";
  db.run(sql, [itemName, description, quantity, itemId, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error updating item' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item not found or you do not have permission to update it' });
    }
    res.json({ message: 'Item updated successfully' });
  });
});

router.delete('/:id', checkToken, (req, res) => {
  const userId = req.user.id;
  const itemId = req.params.id;

  const sql = "DELETE FROM items WHERE id = ? AND userId = ?";
  db.run(sql, [itemId, userId], function(err) {
    if (err) {
      return res.status(500).json({ error: 'Error deleting item' });
    }
    if (this.changes === 0) {
      return res.status(404).json({ error: 'Item not found or you do not have permission to delete it' });
    }
    res.json({ message: 'Item deleted successfully' });
  });
});

module.exports = router;