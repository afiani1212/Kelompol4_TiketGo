const db = require('../config/db');

const Flight = {
  getAll: (callback) => {
    const query = 'SELECT * FROM flights ORDER BY departure_time ASC';
    db.query(query, callback);
  },
  getById: (id, callback) => {
    const query = 'SELECT * FROM flights WHERE id = ?';
    db.query(query, [id], callback);
  },
  // --- Pastikan fungsi ini ADA dan diekspor ---
  create: (newFlight, callback) => {
    const query = 'INSERT INTO flights SET ?';
    db.query(query, newFlight, callback);
  },
  update: (id, updatedFlight, callback) => {
    const query = 'UPDATE flights SET ? WHERE id = ?';
    db.query(query, [updatedFlight, id], callback);
  },
  delete: (id, callback) => {
    const query = 'DELETE FROM flights WHERE id = ?';
    db.query(query, [id], callback);
  }
};

module.exports = Flight;