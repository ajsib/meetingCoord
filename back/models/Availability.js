const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
    meeting: { type: mongoose.Schema.Types.ObjectId, ref: 'Meeting', required: true },
    participant: {
      name: { type: String, required: true },
      email: { type: String, required: true }
    },
    availableTimes: [{
      start: { type: Date, required: true },
      end: { type: Date, required: true }
    }],
    createdAt: { type: Date, default: Date.now }
  });

module.exports = mongoose.model('Availability', availabilitySchema);
  