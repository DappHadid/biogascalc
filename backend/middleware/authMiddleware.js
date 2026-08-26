const jwt = require('jsonwebtoken');
const { User } = require('../models');

const protect = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    res.status(401);
    return next(new Error('Akses ditolak. Silakan login terlebih dahulu.'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await User.findByPk(decoded.id);

    if (!req.user) {
      res.status(401);
      return next(new Error('User tidak ditemukan.'));
    }

    next();
  } catch (error) {
    res.status(401);
    return next(new Error('Token tidak valid atau sudah kadaluarsa.'));
  }
};

const adminOnly = (req, res, next) => {
  if (req.user && (req.user.role === 'admin' || req.user.role === 'superadmin')) {
    next();
  } else {
    res.status(403);
    return next(new Error('Akses ditolak. Hanya admin yang dapat mengakses.'));
  }
};

const superAdminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'superadmin') {
    next();
  } else {
    res.status(403);
    return next(new Error('Akses ditolak. Hanya super admin yang dapat mengakses.'));
  }
};

const protectSuperAdmin = async (req, res, next) => {
  try {
    const targetUserId = req.params.id;
    if (!targetUserId) return next();

    const targetUser = await User.findByPk(targetUserId);
    if (targetUser && targetUser.role === 'superadmin') {
      res.status(403);
      return next(new Error('Super Admin tidak dapat diubah atau dihapus.'));
    }

    next();
  } catch (error) {
    next(error);
  }
};

module.exports = { protect, adminOnly, superAdminOnly, protectSuperAdmin };
