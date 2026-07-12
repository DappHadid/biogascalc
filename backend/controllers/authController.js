const jwt = require('jsonwebtoken');
const { User } = require('../models');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE || '30d',
  });
};

const userResponse = (user, token) => ({
  success: true,
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
  },
  token,
});

const register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      res.status(400);
      throw new Error('Semua field wajib diisi.');
    }

    const existingUser = await User.findOne({ where: { email: email.toLowerCase() } });
    if (existingUser) {
      res.status(409);
      throw new Error('Email sudah terdaftar. Silakan gunakan email lain atau login.');
    }

    const user = await User.create({ name, email, password, role: 'user' });
    const token = generateToken(user.id);

    res.status(201).json(userResponse(user, token));
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      const messages = error.errors.map((e) => e.message);
      res.status(400);
      return next(new Error(messages.join('. ')));
    }
    next(error);
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      res.status(400);
      throw new Error('Email dan password wajib diisi.');
    }

    const user = await User.scope('withPassword').findOne({
      where: { email: email.toLowerCase() },
    });

    if (!user) {
      res.status(401);
      throw new Error('Email atau password salah.');
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      res.status(401);
      throw new Error('Email atau password salah.');
    }

    const token = generateToken(user.id);
    res.json(userResponse(user, token));
  } catch (error) {
    next(error);
  }
};

const getMe = async (req, res) => {
  res.json({
    success: true,
    user: {
      id: req.user.id,
      name: req.user.name,
      email: req.user.email,
      role: req.user.role,
    },
  });
};

module.exports = { register, login, getMe };
