// availabilityRoutes.js
const express = require('express');
const router = express.Router();
const availabilityController = require('../controllers/availabilityControllers');

// Route to submit availability for a meeting
router.post('/:meetingId/availability', availabilityController.submitAvailability);

// Optional: Routes to update and delete availability could be added here

module.exports = router;
