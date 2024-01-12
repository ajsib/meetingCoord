// meetingControllers.js
const Meeting = require('../models/Meeting');
const Availability = require('../models/Availability');

// Helper function to generate a URL-friendly link from meeting name
const generateLinkFromName = (name) => {
  return name.toLowerCase().replace(/\s+/g, '-') + '-' + Math.floor(Math.random() * 10000);
};

// Controller to create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const { coordinator, meetingName, description, proposedTimes } = req.body;
    let meetingLink = generateLinkFromName(meetingName);

    // Check if a meeting with the generated link already exists
    let existingMeeting = await Meeting.findOne({ link: meetingLink });
    while (existingMeeting) {
      // If the meeting exists, regenerate the link with a new random number
      meetingLink = generateLinkFromName(meetingName);
      existingMeeting = await Meeting.findOne({ link: meetingLink });
    }

    // Create and save the new meeting
    const meeting = new Meeting({ coordinator, meetingName, description, proposedTimes, link: meetingLink });
    await meeting.save();
    res.status(201).json({ message: "Meeting created", link: meetingLink, meeting });
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error: error });
  }
};

// Controller to get a meeting by its unique link (id)
exports.getMeeting = async (req, res) => {
  try {
    const { link } = req.params;
    const meeting = await Meeting.findOne({ link }).populate('availabilities');
    if (!meeting) {
      return res.status(404).json({ message: "Meeting not found" });
    }
    res.status(200).json(meeting);
  } catch (error) {
    res.status(500).json({ message: "Error fetching meeting", error: error });
  }
};

// Optional: Controller to update a meeting
// Optional: Controller to delete a meeting

module.exports = exports;
