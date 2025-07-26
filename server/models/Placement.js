const mongoose = require('mongoose');

const PlacementSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  company: { type: String, required: true },
  status: {
    type: String,
    enum: [
      'Application Sent',
      'Shortlisted',
      'Pre-Placement Talk',
      'Test',
      'Interview',
      'Offer',
    ],
    default: 'Application Sent',
  },
}, { timestamps: true });

module.exports = mongoose.model('Placement', PlacementSchema);
