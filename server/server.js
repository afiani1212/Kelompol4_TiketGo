const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const flightRoutes = require('./routes/flights');
const authRoutes = require('./routes/auth');

app.use('/api/flights', flightRoutes);
app.use('/api/auth', authRoutes);

const SERVER_PORT = process.env.SERVER_PORT || 5000;
app.listen(SERVER_PORT, () => console.log(`Server running on port ${SERVER_PORT}`));
