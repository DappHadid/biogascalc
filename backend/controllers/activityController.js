const { UserActivity, AppSetting, PromoEmailLog, User } = require('../models');
const sendEmail = require('../utils/sendEmail');

const trackActivity = async (req, res, next) => {
  try {
    const { action } = req.body;
    const validActions = ['visualize_circular', 'visualize_rectangle'];

    if (!validActions.includes(action)) {
      res.status(400);
      return next(new Error('Aksi tidak valid.'));
    }

    await UserActivity.create({
      userId: req.user.id,
      action,
    });

    const setting = await AppSetting.findByPk('EMAIL_PROMO_THRESHOLD');
    const threshold = setting ? parseInt(setting.value, 10) : 5;

    const allActivities = await UserActivity.findAll({
      where: { userId: req.user.id }
    });

    const totalCount = allActivities.length;

    if (totalCount > 0 && totalCount % threshold === 0) {
      let circCount = 0;
      let rectCount = 0;
      
      allActivities.forEach(act => {
        if (act.action === 'visualize_circular') circCount++;
        else if (act.action === 'visualize_rectangle') rectCount++;
      });

      const mostUsedShape = circCount >= rectCount ? 'circular' : 'rectangle';
      
      const user = await User.findByPk(req.user.id);
      
      if (user) {
        try {
          const subject = `Rekomendasi Spesial: Desain Dome ${mostUsedShape === 'circular' ? 'Circular' : 'Rectangle'}`;
          const message = `Halo ${user.name},\n\nTerima kasih telah aktif menggunakan BioGasCalc!\nBerdasarkan aktivitas Anda yang sering merancang dome, berikut adalah rekomendasi dan tips terbaik untuk merancang dome ${mostUsedShape === 'circular' ? 'Circular' : 'Rectangle'} yang efisien.\n\nSalam,\nTim BioGasCalc`;
          
          await sendEmail({
            email: user.email,
            subject,
            message,
          });

          await PromoEmailLog.create({
            userId: user.id,
            shape: mostUsedShape,
            type: 'auto',
          });
        } catch (emailErr) {
          console.error('Gagal mengirim email promo otomatis:', emailErr);
        }
      }
    }

    res.status(201).json({ success: true, message: 'Aktivitas tercatat.' });
  } catch (error) {
    next(error);
  }
};

module.exports = { trackActivity };
