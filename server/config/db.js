// server/config/db.js
const mysql = require('mysql2');
require('dotenv').config();

// DEBUG: cek apakah ENV terbaca
console.log("ENV TEST:", process.env.DB_HOST, process.env.DB_USER, process.env.DB_PASS, process.env.DB_NAME);

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to the database:', err);
  } else {
    console.log('MySQL Connected...');
  }
});

module.exports = db;
