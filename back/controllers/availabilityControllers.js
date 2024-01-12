// availabilityControllers.js
const Meeting = require('../models/Meeting');
const Availability = require('../models/Availability');

// Controller to submit availability
exports.submitAvailability = async (req, res) => {
  try {
    const { meetingId } = req.params;
    const { participant, availableTimes } = req.body;
    const availability = new Availability({
      meeting: meetingId,
      participant,
      availableTimes
    });
    await availability.save();

    // Add the availability to the meeting
    const meeting = await Meeting.findById(meetingId);
    meeting.availabilities.push(availability);
    await meeting.save();

    res.status(201).json(availability);
  } catch (error) {
    res.status(500).json({ message: "Error submitting availability", error: error });
  }
};

// Optional: Controller to update availability
// Optional: Controller to delete availability

module.exports = exports;
