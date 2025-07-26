const OD = require('../models/OD');

// Create OD
exports.createOD = async (req, res) => {
  try {
    let attachment = undefined;
    if (req.file) {
      attachment = `/uploads/${req.file.filename}`;
    }
    const od = new OD({
      ...req.body,
      user: req.user.id,
      attachment,
    });
    await od.save();
    res.status(201).json(od);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get ODs (with filters)
exports.getODs = async (req, res) => {
  try {
    const { type, status, date } = req.query;
    const filter = { user: req.user.id };
    if (type) filter.type = type;
    if (status) filter.status = status;
    if (date) filter.date = date;
    const ods = await OD.find(filter).sort({ date: -1 });
    res.json(ods);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update OD status
exports.updateOD = async (req, res) => {
  try {
    const od = await OD.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      req.body,
      { new: true }
    );
    if (!od) return res.status(404).json({ error: 'OD not found' });
    res.json(od);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Delete OD
exports.deleteOD = async (req, res) => {
  try {
    const od = await OD.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!od) return res.status(404).json({ error: 'OD not found' });
    res.json({ message: 'OD deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
