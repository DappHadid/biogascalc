const express = require('express');
const router = express.Router();
const {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getPromotionUsers,
} = require('../controllers/userController');
const {
  protect,
  superAdminOnly,
  protectSuperAdmin,
} = require('../middleware/authMiddleware');

router.use(protect);
router.use(superAdminOnly);

router.route('/')
  .get(getUsers)
  .post(createUser);

router.get('/promotions', protect, superAdminOnly, getPromotionUsers);

router.route('/:id')
  .put(protectSuperAdmin, updateUser)
  .delete(protectSuperAdmin, deleteUser);

module.exports = router;
