const mongoose = require('mongoose');

const meetingSchema = new mongoose.Schema({
  link: { type: String, unique: true, sparse: true },
  coordinator: { 
    name: { type: String, required: true },
    email: { type: String, required: true }
  },
  meetingName: { type: String, required: true },
  description: String,
  proposedTimes: [{ 
    start: { type: Date, required: true },
    end: { type: Date, required: true }
  }],
  availabilities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Availability' }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Meeting', meetingSchema);
