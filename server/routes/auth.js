// server/routes/auth.js
const express = require('express');
const router = express.Router();

// 🔹 Pastikan path dan nama fungsi benar
const authController = require('../controllers/authController'); // ✅ Nama file benar

router.post('/register', authController.register); // ✅ Nama fungsi benar
router.post('/login', authController.login);       // ✅ Nama fungsi benar

module.exports = router;