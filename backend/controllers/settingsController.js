const { AppSetting } = require('../models');

const getVolumeLimits = async (req, res, next) => {
  try {
    const settings = await AppSetting.findAll({
      where: {
        key: ['MAX_VOLUME_GUEST', 'MAX_VOLUME_USER', 'ADMIN_CONTACT_EMAIL']
      }
    });

    const limits = {
      guest: 5,
      user: 40,
      adminEmail: 'superadmin@biogascalc.com',
    };

    settings.forEach(setting => {
      if (setting.key === 'MAX_VOLUME_GUEST') limits.guest = parseFloat(setting.value);
      if (setting.key === 'MAX_VOLUME_USER') limits.user = parseFloat(setting.value);
      if (setting.key === 'ADMIN_CONTACT_EMAIL') limits.adminEmail = setting.value;
    });

    res.json({ success: true, data: limits });
  } catch (error) {
    next(error);
  }
};

const updateVolumeLimits = async (req, res, next) => {
  try {
    const { guest, user } = req.body;

    if (guest === undefined || user === undefined) {
      res.status(400);
      return next(new Error('Nilai guest dan user wajib diisi.'));
    }

    if (guest <= 0 || user <= 0) {
      res.status(400);
      return next(new Error('Batas volume harus lebih dari 0.'));
    }

    await AppSetting.upsert({
      key: 'MAX_VOLUME_GUEST',
      value: String(guest),
      description: 'Maximum dome volume for non-logged-in users (m3)'
    });

    await AppSetting.upsert({
      key: 'MAX_VOLUME_USER',
      value: String(user),
      description: 'Maximum dome volume for logged-in users (m3)'
    });

    res.json({ success: true, message: 'Pengaturan batas volume berhasil diperbarui.' });
  } catch (error) {
    next(error);
  }
};

const getPromoThreshold = async (req, res, next) => {
  try {
    const setting = await AppSetting.findByPk('EMAIL_PROMO_THRESHOLD');
    const threshold = setting ? parseInt(setting.value, 10) : 5;
    res.json({ success: true, data: { threshold } });
  } catch (error) {
    next(error);
  }
};

const updatePromoThreshold = async (req, res, next) => {
  try {
    const { threshold } = req.body;
    
    if (threshold === undefined || threshold <= 0) {
      res.status(400);
      return next(new Error('Nilai threshold harus lebih dari 0.'));
    }

    await AppSetting.upsert({
      key: 'EMAIL_PROMO_THRESHOLD',
      value: String(threshold),
      description: 'Activity count multiple required to trigger automated promo emails'
    });

    res.json({ success: true, message: 'Pengaturan batas email promosi berhasil diperbarui.' });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVolumeLimits,
  updateVolumeLimits,
  getPromoThreshold,
  updatePromoThreshold,
};
