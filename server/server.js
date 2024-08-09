const express = require('express');
const path = require('path');
const cors = require('cors');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const PORT = process.env.PORT || 5000;
const SECRET_KEY = 'hardcodedlol';

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  console.log(`Received ${req.method} request for ${req.url}`);
  console.log('Headers:', req.headers);
  next();
});

const db = new sqlite3.Database('./inventory.sqlite');

db.run("CREATE TABLE IF NOT EXISTS users (id INTEGER PRIMARY KEY AUTOINCREMENT, firstName TEXT, lastName TEXT, username TEXT, password TEXT)");
db.run("CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, userId INTEGER, itemName TEXT, description TEXT, quantity INTEGER)");

async function checkLoggedIn(req, res, next) {
  const token = req.headers['authorization'];
  if (!token) {
    res.status(401).send('You need to login');
    return;
  }

  try {
    const decoded = await jwt.verify(token.split(' ')[1], SECRET_KEY);
    req.user = decoded;
    next();
  } catch (err) {
    console.error('Token verification failed:', err);
    res.status(403).send('Invalid token');
  }
}

app.post('/api/auth/register', async (req, res) => {
  const { firstName, lastName, username, password } = req.body;

  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const sql = "INSERT INTO users (firstName, lastName, username, password) VALUES (?, ?, ?, ?)";
    db.run(sql, [firstName, lastName, username, hashedPassword], (err) => {
      if (err) {
        res.status(400).send('Pick a different username, be original this time.');
        return;
      }
      res.status(201).send('Wow, an original username!');
    });
  } catch (err) {
    res.status(500).send('Error making password safe');
  }
});

app.post('/api/login', (req, res) => {
  const { username, password } = req.body;

  const sql = "SELECT * FROM users WHERE username = ?";
  db.get(sql, [username], async (err, user) => {
    if (err) {
      res.status(500).send('Error logging in');
      return;
    }
    if (!user) {
      res.status(400).send('User not found');
      return;
    }

    try {
      const result = await bcrypt.compare(password, user.password);
      if (result) {
        const token = jwt.sign({ id: user.id, username: user.username }, SECRET_KEY);
        res.json({ token, userId: user.id, firstName: user.firstName, lastName: user.lastName });
      } else {
        res.status(400).send('Wrong password');
      }
    } catch (err) {
      res.status(500).send('Error checking password');
    }
  });
});

app.get('/', (req, res) => {
  res.json({ message: "Inventory API" });
});

app.get('/api/items', checkLoggedIn, (req, res) => {
  const userId = req.user.id;

  console.log(`Fetching items for user: ${userId}`);

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

app.get('/api/items/:id', checkLoggedIn, (req, res) => {
  const id = req.params.id;
  const userId = req.user.id;

  console.log(`Fetching item with ID: ${id} for user: ${userId}`);

  const sql = "SELECT * FROM items WHERE id = ? AND userId = ?";
  db.get(sql, [id, userId], (err, item) => {
    if (err) {
      console.error('Database error:', err);
      return res.status(500).json({ error: 'Error getting item from database' });
    }
    if (!item) {
      console.log(`Item not found. ID: ${id}, User ID: ${userId}`);
      return res.status(404).json({ error: 'Item not found' });
    }
    console.log('Item found:', item);
    res.json(item);
  });
});

app.post('/api/items', checkLoggedIn, (req, res) => {
  const { itemName, description, quantity } = req.body;

  const sql = "INSERT INTO items (userId, itemName, description, quantity) VALUES (?, ?, ?, ?)";
  db.run(sql, [req.user.id, itemName, description, quantity], function(err) {
    if (err) {
      res.status(500).send('Error adding item');
      return;
    }
    res.status(201).json({ id: this.lastID, userId: req.user.id, itemName, description, quantity });
  });
});

app.put('/api/items/:id', checkLoggedIn, (req, res) => {
  const { itemName, description, quantity } = req.body;
  const id = req.params.id;

  const sql = "UPDATE items SET itemName = ?, description = ?, quantity = ? WHERE id = ? AND userId = ?";
  db.run(sql, [itemName, description, quantity, id, req.user.id], (err) => {
    if (err) {
      res.status(500).send('Error updating item');
      return;
    }
    res.send('Item updated!');
  });
});

app.delete('/api/items/:id', checkLoggedIn, (req, res) => {
  const id = req.params.id;

  const sql = "DELETE FROM items WHERE id = ? AND userId = ?";
  db.run(sql, [id, req.user.id], (err) => {
    if (err) {
      res.status(500).send('Error deleting item');
      return;
    }
    res.send('Item deleted!');
  });
});

app.use((req, res) => {
  console.log(`Route not found: ${req.method} ${req.url}`);
  res.status(404).send('Route not found');
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});