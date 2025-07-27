// @route   GET /api/auth/profile
exports.getProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.body.userId || req.query.userId;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });
    let user = await User.findById(userId).lean();
    if (!user) return res.status(404).json({ msg: 'User not found' });
    // Remove sensitive fields
    delete user.password;

    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch profile', error: err.message });
  }
};

// @route   PUT /api/auth/profile
exports.updateProfile = async (req, res) => {
  try {
    const userId = req.user?.id || req.userId || req.body.userId || req.query.userId;
    if (!userId) return res.status(401).json({ msg: 'Unauthorized' });
    const update = { ...req.body };
    delete update.password;

    // For array fields, allow full CRUD (add, edit, delete)
    const arrayFields = ['skills', 'interests', 'education', 'achievements', 'projects', 'certifications', 'placementStats', 'placementBadges', 'recent'];
    const setOps = {};
    arrayFields.forEach(field => {
      if (update[field] !== undefined) setOps[field] = update[field];
    });
    // For nested objects (socials)
    if (update.socials !== undefined) setOps.socials = update.socials;
    // For other fields
    ['name','email','phone','branch','year','roll','avatar','resume'].forEach(field => {
      if (update[field] !== undefined) setOps[field] = update[field];
    });

    const user = await User.findByIdAndUpdate(userId, { $set: setOps }, { new: true, runValidators: true }).lean();
    if (!user) return res.status(404).json({ msg: 'User not found' });
    delete user.password;
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update profile', error: err.message });
  }
};
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

// @route   POST /api/auth/register
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const userExist = await User.findOne({ email });
    if (userExist) return res.status(400).json({ msg: "User already exists" });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword
    });

    res.status(201).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

// @route   POST /api/auth/login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid email or password" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ msg: "Invalid email or password" });

    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      token: generateToken(user._id)
    });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
