const express = require('express');
const router = express.Router();

const odController = require('../controllers/odController');
const auth = require('../middleware/authMiddleware');
const upload = require('../middleware/upload');

router.post('/', auth, upload.single('attachment'), odController.createOD);
router.get('/', auth, odController.getODs);
router.put('/:id', auth, odController.updateOD);
router.delete('/:id', auth, odController.deleteOD);

module.exports = router;
