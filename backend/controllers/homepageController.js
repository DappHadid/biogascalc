const { HowItWorksStep, FaqItem } = require('../models');
const { getSequelize } = require('../config/db');
const path = require('path');
const fs = require('fs');

const getHowItWorks = async (req, res, next) => {
  try {
    const steps = await HowItWorksStep.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });
    res.json({ data: steps });
  } catch (error) {
    next(error);
  }
};

const updateHowItWorks = async (req, res, next) => {
  const sequelize = getSequelize();
  const t = await sequelize.transaction();

  try {
    const { steps } = req.body;

    if (!Array.isArray(steps) || steps.length === 0) {
      res.status(400);
      return next(new Error('Data langkah tidak boleh kosong.'));
    }

    const currentSteps = await HowItWorksStep.findAll({ transaction: t });
    const oldImages = currentSteps
      .map((s) => s.imageUrl)
      .filter(Boolean);

    const newImages = steps.map((s) => s.imageUrl).filter(Boolean);

    await HowItWorksStep.destroy({ where: {}, transaction: t });

    const records = steps.map((step, i) => ({
      stepNumber: step.stepNumber || String(i + 1).padStart(2, '0'),
      title: step.title,
      description: step.description,
      imageUrl: step.imageUrl || null,
      sortOrder: step.sortOrder ?? i,
    }));

    await HowItWorksStep.bulkCreate(records, { transaction: t, validate: true });

    await t.commit();

    for (const oldImg of oldImages) {
      if (!newImages.includes(oldImg)) {
        const filePath = path.join(__dirname, '..', oldImg);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      }
    }

    const updated = await HowItWorksStep.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });

    res.json({ message: 'Langkah Cara Kerja berhasil diperbarui.', data: updated });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const getFaq = async (req, res, next) => {
  try {
    const items = await FaqItem.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });

    const categories = ['Umum', 'Teknis & Fitur', 'Langkah Selanjutnya'];
    const grouped = categories
      .map((cat) => ({
        category: cat,
        items: items
          .filter((item) => item.category === cat)
          .map((item) => ({
            id: item.id,
            q: item.question,
            a: item.answer,
            sortOrder: item.sortOrder,
          })),
      }))
      .filter((group) => group.items.length > 0);

    res.json({ data: grouped });
  } catch (error) {
    next(error);
  }
};

const updateFaq = async (req, res, next) => {
  const sequelize = getSequelize();
  const t = await sequelize.transaction();

  try {
    const { items } = req.body;

    if (!Array.isArray(items)) {
      res.status(400);
      return next(new Error('Data FAQ tidak valid.'));
    }

    if (items.length > 5) {
      res.status(400);
      return next(new Error('Total FAQ tidak boleh lebih dari 5.'));
    }

    const validCategories = ['Umum', 'Teknis & Fitur', 'Langkah Selanjutnya'];
    for (const item of items) {
      if (!validCategories.includes(item.category)) {
        res.status(400);
        return next(new Error(`Kategori "${item.category}" tidak valid.`));
      }
    }

    await FaqItem.destroy({ where: {}, transaction: t });

    const records = items.map((item, i) => ({
      category: item.category,
      question: item.question,
      answer: item.answer,
      sortOrder: item.sortOrder ?? i,
    }));

    await FaqItem.bulkCreate(records, { transaction: t, validate: true });

    await t.commit();

    const allItems = await FaqItem.findAll({
      order: [['sortOrder', 'ASC'], ['id', 'ASC']],
    });

    const grouped = validCategories
      .map((cat) => ({
        category: cat,
        items: allItems
          .filter((it) => it.category === cat)
          .map((it) => ({
            id: it.id,
            q: it.question,
            a: it.answer,
            sortOrder: it.sortOrder,
          })),
      }))
      .filter((group) => group.items.length > 0);

    res.json({ message: 'FAQ berhasil diperbarui.', data: grouped });
  } catch (error) {
    await t.rollback();
    next(error);
  }
};

const uploadImage = async (req, res, next) => {
  try {
    if (!req.file) {
      res.status(400);
      return next(new Error('File gambar wajib diunggah.'));
    }

    const imageUrl = `/uploads/homepage/${req.file.filename}`;
    res.json({ imageUrl });
  } catch (error) {
    next(error);
  }
};

const deleteImage = async (req, res, next) => {
  try {
    const { imageUrl } = req.body;
    if (!imageUrl) {
      res.status(400);
      return next(new Error('Path gambar tidak ditemukan.'));
    }

    const filePath = path.join(__dirname, '..', imageUrl);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }

    res.json({ message: 'Gambar berhasil dihapus.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getHowItWorks,
  updateHowItWorks,
  getFaq,
  updateFaq,
  uploadImage,
  deleteImage,
};
