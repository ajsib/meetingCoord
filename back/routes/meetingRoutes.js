// meetingRoutes.js
const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingControllers');

// Route to create a new meeting
router.post('/create', meetingController.createMeeting);

// Route to get a meeting by its unique link
router.get('/:link', meetingController.getMeeting);

// Optional: Routes to update and delete a meeting could be added here

module.exports = router;
