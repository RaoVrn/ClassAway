const express = require('express');
const router = express.Router();
const placementController = require('../controllers/placementController');
const auth = require('../middleware/authMiddleware');

router.post('/', auth, placementController.upsertPlacement);
router.get('/', auth, placementController.getPlacements);

module.exports = router;
