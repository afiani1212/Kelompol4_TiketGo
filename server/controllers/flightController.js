const db = require('../config/db');

// Ambil semua data penerbangan
exports.getAllFlights = (req, res) => {
  db.query("SELECT * FROM flights", (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json(result);
  });
};

// Ambil data penerbangan berdasarkan ID
exports.getFlightById = (req, res) => {
  const { id } = req.params;
  db.query("SELECT * FROM flights WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    if (result.length === 0) return res.status(404).json({ message: "Flight not found" });
    res.json(result[0]);
  });
};

// Tambah penerbangan baru (admin)
exports.createFlight = (req, res) => {
  const { flight_number, departure_city, arrival_city, departure_time, arrival_time, price } = req.body;

  // Validasi input
  if (!flight_number || !departure_city || !arrival_city || !departure_time || !arrival_time || !price) {
    return res.status(400).json({ message: "All fields are required" });
  }

  db.query(
    "INSERT INTO flights (flight_number, departure_city, arrival_city, departure_time, arrival_time, price) VALUES (?, ?, ?, ?, ?, ?)",
    [flight_number, departure_city, arrival_city, departure_time, arrival_time, price],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.status(201).json({ message: "Flight created successfully", flightId: result.insertId });
    }
  );
};

// Update penerbangan (admin)
exports.updateFlight = (req, res) => {
  const { id } = req.params;
  const { flight_number, departure_city, arrival_city, departure_time, arrival_time, price } = req.body;

  db.query(
    "UPDATE flights SET flight_number=?, departure_city=?, arrival_city=?, departure_time=?, arrival_time=?, price=? WHERE id=?",
    [flight_number, departure_city, arrival_city, departure_time, arrival_time, price, id],
    (err, result) => {
      if (err) return res.status(500).json({ message: "DB error", error: err });
      res.json({ message: "Flight updated successfully" });
    }
  );
};

// Hapus penerbangan (admin)
exports.deleteFlight = (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM flights WHERE id = ?", [id], (err, result) => {
    if (err) return res.status(500).json({ message: "DB error", error: err });
    res.json({ message: "Flight deleted successfully" });
  });
};
