// server.js
require('dotenv').config(); // Initialize dotenv to load the environment variables

// Import necessary modules and libraries
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Replace 'require' with 'process.env' for the MongoDB URI
const MONGO_CONNECTION_STR = process.env.MONGO_CONNECTION_STR;

// Assume these routes are already defined in their respective files
// If not, you need to create them

const app = express();

// Middleware
app.use(cors({ origin: '*' }));
app.use(express.json());

mongoose.connect(MONGO_CONNECTION_STR)
.then(() => {
  console.log('Connected to MongoDB');
})
.catch((error) => {
  console.error('Error connecting to MongoDB:', error);
});

// Routes
const meetingRoutes = require('./routes/meetingRoutes');
const availabilityRoutes = require('./routes/availabilityRoutes');

app.use('/api/meetings', meetingRoutes);
app.use('/api/availabilities', availabilityRoutes);

const port = process.env.PORT || 3001;

app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
