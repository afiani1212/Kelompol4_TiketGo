// server/routes/flights.js

const express = require('express');
const router = express.Router();
const flightController = require('../controllers/flightController');
const { mustLogin, mustAdmin } = require('../middleware/auth');

// PUBLIC / USER (lihat jadwal)
router.get('/', flightController.getAllFlights);
router.get('/:id', flightController.getFlightById);

// ADMIN ONLY
router.post('/', mustAdmin, flightController.createFlight);
router.put('/:id', mustAdmin, flightController.updateFlight);
router.delete('/:id', mustAdmin, flightController.deleteFlight);

module.exports = router;
