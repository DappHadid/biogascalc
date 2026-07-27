const express = require('express');
const router = express.Router();
const { trackActivity } = require('../controllers/activityController');
const { protect } = require('../middleware/authMiddleware');

router.post('/track', protect, trackActivity);

module.exports = router;
