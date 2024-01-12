// meetingControllers.js
const Meeting = require('../models/Meeting');
const Availability = require('../models/Availability');

// Controller to create a new meeting
exports.createMeeting = async (req, res) => {
  try {
    const { coordinator, meetingName, description, proposedTimes, link } = req.body;
    let meetingLink = link;
    
    // If link is not provided, create the meeting first and use its _id as the link
    if (!meetingLink) {
      let tempMeeting = new Meeting({ coordinator, meetingName, description, proposedTimes });
      await tempMeeting.save();
      meetingLink = tempMeeting._id;
      tempMeeting.link = meetingLink;
      await tempMeeting.save();
      return res.status(201).json({ message: "Meeting created with default link", meeting: tempMeeting });
    } 

    // Check if the provided link is unique
    const existingMeeting = await Meeting.findOne({ link: meetingLink });
    if (existingMeeting) {
      return res.status(400).json({ message: "Provided link is not unique" });
    }

    // If the link is unique, create the meeting with the provided link
    const meeting = new Meeting({ coordinator, meetingName, description, proposedTimes, link: meetingLink });
    await meeting.save();
    res.status(201).json({ message: "Meeting created with provided link", meeting });
  } catch (error) {
    res.status(500).json({ message: "Error creating meeting", error: error });
  }
};

// Controller to get a meeting by its unique link (id)
exports.getMeeting = async (req, res) => {
  try {
    const { link } = req.params;
    const meeting = await Meeting.findById(link).populate('availabilities');
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
