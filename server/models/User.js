// models/User.js
const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, required: true, unique: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String },
  branch: { type: String },
  year: { type: String },
  roll: { type: String },
  avatar: { type: String },
  skills: [{ type: String }],
  interests: [{ type: String }],
  socials: {
    linkedin: { type: String },
    github: { type: String },
    portfolio: { type: String }
  },
  education: [{
    institution: String,
    degree: String,
    field: String,
    startYear: String,
    endYear: String
  }],
  achievements: [{
    title: String,
    description: String,
    date: String
  }],
  projects: [{
    name: String,
    description: String,
    link: String
  }],
  certifications: [{
    name: String,
    issuer: String,
    date: String
  }],
  resume: { type: String }, // store file URL or path
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
