const express = require('express');
const router = express.Router();
const {
  getAllDomes,
  getDomeById,
  createDome,
  updateDome,
  deleteDome,
  getManagedDomes
} = require('../controllers/domeController');
const { protect, adminOnly, superAdminOnly } = require('../middleware/authMiddleware');

router.get('/', getAllDomes);
router.get('/managed', protect, adminOnly, getManagedDomes);
router.get('/:id', getDomeById);
router.post('/', protect, superAdminOnly, createDome);
router.put('/:id', protect, adminOnly, updateDome);
router.delete('/:id', protect, superAdminOnly, deleteDome);

module.exports = router;
