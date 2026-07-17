const { User, Dome } = require('../models');

const getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll({
      where: { role: 'admin' },
      include: {
        model: Dome,
        as: 'assignedDomes',
        attributes: ['id', 'name', 'city', 'type', 'status'],
        through: { attributes: [] },
      },
    });
    res.json({ success: true, count: users.length, data: users });
  } catch (error) {
    next(error);
  }
};

const createUser = async (req, res, next) => {
  try {
    const { name, email, password, role, assignedDomes } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Semua field wajib diisi.');
    }

    const userRole = 'admin';

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      res.status(409);
      throw new Error('Email sudah terdaftar.');
    }

    const user = await User.create({
      name,
      email,
      password,
      role: userRole,
    });

    if (assignedDomes && assignedDomes.length > 0) {
      await user.setAssignedDomes(assignedDomes);
    }

    const result = await User.findByPk(user.id, {
      include: {
        model: Dome,
        as: 'assignedDomes',
        attributes: ['id', 'name', 'city', 'type', 'status'],
        through: { attributes: [] },
      },
    });

    res.status(201).json({
      success: true,
      data: {
        id: result.id,
        name: result.name,
        email: result.email,
        role: result.role,
        assignedDomes: result.assignedDomes,
      },
    });
  } catch (error) {
    next(error);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { name, email, role, assignedDomes } = req.body;

    const user = await User.findByPk(req.params.id);
    if (!user) {
      res.status(404);
      throw new Error('User tidak ditemukan.');
    }

    const updateData = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (role && role !== 'user') updateData.role = role;

    await user.update(updateData);

    if (assignedDomes !== undefined) {
      await user.setAssignedDomes(assignedDomes);
    }

    const result = await User.findByPk(user.id, {
      include: {
        model: Dome,
        as: 'assignedDomes',
        attributes: ['id', 'name', 'city', 'type', 'status'],
        through: { attributes: [] },
      },
    });

    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      res.status(404);
      throw new Error('User tidak ditemukan.');
    }

    await user.destroy();
    res.json({ success: true, message: 'User berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

const getPromotionUsers = async (req, res, next) => {
  try {
    const { UserActivity } = require('../models');
    const { fn, col } = require('sequelize');

    const users = await User.findAll({ where: { role: 'user' } });

    if (users.length === 0) {
      return res.json({ success: true, count: 0, data: [] });
    }

    const userIds = users.map(u => u.id);

    const activityCounts = await UserActivity.findAll({
      where: { userId: userIds },
      attributes: [
        'userId',
        'action',
        [fn('COUNT', col('id')), 'count'],
      ],
      group: ['userId', 'action'],
      raw: true,
    });

    const statsMap = {};
    for (const row of activityCounts) {
      if (!statsMap[row.userId]) {
        statsMap[row.userId] = { visualize_circular: 0, visualize_rectangle: 0 };
      }
      statsMap[row.userId][row.action] = parseInt(row.count, 10);
    }

    const usersWithStats = users.map(user => ({
      id: user.id,
      name: user.name,
      email: user.email,
      createdAt: user.createdAt,
      stats: {
        designCircular: statsMap[user.id]?.visualize_circular || 0,
        designRectangle: statsMap[user.id]?.visualize_rectangle || 0,
      },
    }));

    res.json({ success: true, count: usersWithStats.length, data: usersWithStats });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getUsers,
  createUser,
  updateUser,
  deleteUser,
  getPromotionUsers,
};
