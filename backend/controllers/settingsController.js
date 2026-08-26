const { AppSetting } = require('../models');

const DEFAULT_DOME_MATERIALS = [
  { name: 'Semen', coefficientPerM2: 15, unit: 'kg' },
  { name: 'Pasir', coefficientPerM2: 0.03, unit: 'm³' },
  { name: 'Batu Bata / Batako', coefficientPerM2: 60, unit: 'buah' },
  { name: 'Besi Tulangan (Rebar)', coefficientPerM2: 2.5, unit: 'kg' },
  { name: 'Kerikil / Split', coefficientPerM2: 0.02, unit: 'm³' },
  { name: 'Cat Pelapis Anti Bocor', coefficientPerM2: 0.12, unit: 'liter' },
];

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

const getDomeMaterials = async (req, res, next) => {
  try {
    const setting = await AppSetting.findByPk('DOME_MATERIALS');
    let materials = DEFAULT_DOME_MATERIALS;

    if (setting) {
      try {
        materials = JSON.parse(setting.value);
      } catch {
        materials = DEFAULT_DOME_MATERIALS;
      }
    }

    res.json({ success: true, data: materials });
  } catch (error) {
    next(error);
  }
};

const updateDomeMaterials = async (req, res, next) => {
  try {
    const { materials } = req.body;

    if (!Array.isArray(materials)) {
      res.status(400);
      return next(new Error('Data materials harus berupa array.'));
    }

    for (let i = 0; i < materials.length; i++) {
      const m = materials[i];
      if (!m.name || typeof m.name !== 'string' || m.name.trim() === '') {
        res.status(400);
        return next(new Error(`Item ke-${i + 1}: nama bahan wajib diisi.`));
      }
      if (typeof m.coefficientPerM2 !== 'number' || m.coefficientPerM2 < 0) {
        res.status(400);
        return next(new Error(`Item ke-${i + 1} (${m.name}): koefisien harus berupa angka >= 0.`));
      }
      if (!m.unit || typeof m.unit !== 'string' || m.unit.trim() === '') {
        res.status(400);
        return next(new Error(`Item ke-${i + 1} (${m.name}): satuan wajib diisi.`));
      }
    }

    const cleanMaterials = materials.map(m => ({
      name: m.name.trim(),
      coefficientPerM2: m.coefficientPerM2,
      unit: m.unit.trim(),
    }));

    await AppSetting.upsert({
      key: 'DOME_MATERIALS',
      value: JSON.stringify(cleanMaterials),
      description: 'Dome material estimation coefficients (JSON array)',
    });

    res.json({ success: true, message: 'Data estimasi bahan baku berhasil diperbarui.', data: cleanMaterials });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getVolumeLimits,
  updateVolumeLimits,
  getPromoThreshold,
  updatePromoThreshold,
  getDomeMaterials,
  updateDomeMaterials,
  DEFAULT_DOME_MATERIALS,
};
