// availabilityControllers.js
const Meeting = require('../models/Meeting');
const Availability = require('../models/Availability');

// Controller to submit availability
exports.submitAvailability = async (req, res) => {
  try {
    const { meetingLink } = req.params; // Now using 'meetingLink' which corresponds to 'link' in the Meeting schema
    const { participant, availableTimes } = req.body;
    
    // Find the meeting by its 'link' field
    const meeting = await Meeting.findOne({ link: meetingLink });
    
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }

    const availability = new Availability({
      meeting: meeting._id,
      participant,
      availableTimes
    });
    await availability.save();

    // Add the availability to the meeting
    meeting.availabilities.push(availability);
    await meeting.save();

    res.status(201).json(availability);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Error submitting availability", error: error });
  }
};


// Optional: Controller to update availability
// Optional: Controller to delete availability

module.exports = exports;
