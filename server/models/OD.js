const mongoose = require('mongoose');

const ODSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Placement', 'Self-Applied'], required: true },
  title: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Applied', 'In Process', 'Approved', 'Rejected'], default: 'Applied' },
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
  attachment: { type: String }, // file link
  dayOrder: { type: String, enum: ['1', '2', '3', '4', '5'], required: false },
}, { timestamps: true });

module.exports = mongoose.model('OD', ODSchema);
