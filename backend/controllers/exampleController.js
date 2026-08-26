const { Example } = require('../models');

const getExamples = async (req, res, next) => {
  try {
    const examples = await Example.findAll({ order: [['createdAt', 'DESC']] });
    res.json({ success: true, count: examples.length, data: examples });
  } catch (error) {
    next(error);
  }
};

const getExampleById = async (req, res, next) => {
  try {
    const example = await Example.findByPk(req.params.id);
    if (!example) {
      res.status(404);
      throw new Error('Example not found');
    }
    res.json({ success: true, data: example });
  } catch (error) {
    next(error);
  }
};

const createExample = async (req, res, next) => {
  try {
    const example = await Example.create(req.body);
    res.status(201).json({ success: true, data: example });
  } catch (error) {
    next(error);
  }
};

const updateExample = async (req, res, next) => {
  try {
    const example = await Example.findByPk(req.params.id);
    if (!example) {
      res.status(404);
      throw new Error('Example not found');
    }
    await example.update(req.body);
    res.json({ success: true, data: example });
  } catch (error) {
    next(error);
  }
};

const deleteExample = async (req, res, next) => {
  try {
    const example = await Example.findByPk(req.params.id);
    if (!example) {
      res.status(404);
      throw new Error('Example not found');
    }
    await example.destroy();
    res.json({ success: true, data: {} });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
};
