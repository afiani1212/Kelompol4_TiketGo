// server/models/User.js
const db = require('../config/db');

const User = {
  findByUsername: (username, callback) => {
    const query = 'SELECT * FROM users WHERE username = ?';
    db.query(query, [username], callback);
  },
  create: (userData, callback) => {
    const query = 'INSERT INTO users SET ?';
    db.query(query, userData, callback);
  }
};

module.exports = User;