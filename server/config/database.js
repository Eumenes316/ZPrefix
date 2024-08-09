const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database('../inventory.sqlite', (err) => {
  if (err) {
    console.log('Error connecting to db:', err);
  } else {
    console.log('Connected to db.');
    createTables();
  }
});

function createTables() {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    firstName TEXT,
    lastName TEXT,
    username TEXT UNIQUE,
    password TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    userId INTEGER,
    itemName TEXT,
    description TEXT,
    quantity INTEGER,
  )`);
}

module.exports = db;