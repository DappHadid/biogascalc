const express = require('express');
const router = express.Router();
const { getVolumeLimits, updateVolumeLimits, getPromoThreshold, updatePromoThreshold } = require('../controllers/settingsController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

router.get('/volume-limits', getVolumeLimits);
router.put('/volume-limits', protect, superAdminOnly, updateVolumeLimits);

router.get('/promo-threshold', protect, superAdminOnly, getPromoThreshold);
router.put('/promo-threshold', protect, superAdminOnly, updatePromoThreshold);

module.exports = router;
