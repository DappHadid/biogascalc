const express = require('express');
const router = express.Router();
const { getPromoEmailHistory, sendManualPromoEmail } = require('../controllers/promoController');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');

router.use(protect);
router.use(superAdminOnly);

router.get('/:userId/history', getPromoEmailHistory);
router.post('/:userId/send', sendManualPromoEmail);

module.exports = router;
