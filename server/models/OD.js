const mongoose = require('mongoose');

const ODSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  type: { type: String, enum: ['Placement', 'Self-Applied'], required: true },
  title: { type: String, required: true },
  reason: { type: String, required: true },
  date: { type: Date, required: true },
  status: { type: String, enum: ['Applied', 'In Process', 'Approved', 'Rejected'], default: 'Applied' },
  attachment: { type: String }, // file link
}, { timestamps: true });

module.exports = mongoose.model('OD', ODSchema);
