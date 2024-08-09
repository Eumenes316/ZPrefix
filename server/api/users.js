const express = require('express');
const router = express.Router();
const db = require('../config/database'); 

router.get('/', (req, res) => {
  db.all('SELECT id, firstName, lastName, username FROM users', (err, users) => {
    if (err) {
      res.status(500).json({ error: 'Could not fetch users' });
    } else {
      res.json(users);
    }
  });
});

router.get('/:id', (req, res) => {
  db.get('SELECT id, firstName, lastName, username FROM users WHERE id = ?', [req.params.id], (err, user) => {
    if (err) {
      res.status(500).json({ error: 'Could not fetch user' });
    } else if (!user) {
      res.status(404).json({ error: 'User not found' });
    } else {
      res.json(user);
    }
  });
});


router.put('/:id', (req, res) => {
  const { firstName, lastName, username } = req.body;
  db.run(
    'UPDATE users SET firstName = ?, lastName = ?, username = ? WHERE id = ?',
    [firstName, lastName, username, req.params.id],
    (err) => {
      if (err) {
        res.status(500).json({ error: 'Could not update user' });
      } else {
        res.json({ message: 'User updated successfully' });
      }
    }
  );
});

router.delete('/:id', (req, res) => {
  db.run('DELETE FROM users WHERE id = ?', [req.params.id], (err) => {
    if (err) {
      res.status(500).json({ error: 'Could not delete user' });
    } else {
      res.json({ message: 'User deleted successfully' });
    }
  });
});

module.exports = router;