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
  salaryRange: {
    type: String,
    enum: [
      'Less than 5 LPA',
      '5-10 LPA',
      '10-20 LPA',
      'Above 20 LPA',
      'Not Disclosed',
    ],
    default: 'Not Disclosed',
  },
  salary: { type: Number },
  jobType: {
    type: String,
    enum: [
      'Intern',
      'Intern leads to Full Time',
      'Full Time',
      'Other',
    ],
    default: 'Full Time',
  },
  jobRole: { type: String },
  applicationDate: { type: Date },
}, { timestamps: true });

module.exports = mongoose.model('Placement', PlacementSchema);
