const Placement = require('../models/Placement');

// Create or update placement status for a company
exports.upsertPlacement = async (req, res) => {
  try {
    const { company, status } = req.body;
    let placement = await Placement.findOne({ user: req.user.id, company });
    if (placement) {
      placement.status = status;
      await placement.save();
    } else {
      placement = new Placement({ user: req.user.id, company, status });
      await placement.save();
    }
    res.json(placement);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// Get all placements for user
exports.getPlacements = async (req, res) => {
  try {
    const placements = await Placement.find({ user: req.user.id });
    res.json(placements);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
