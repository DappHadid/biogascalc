const { PromoEmailLog, User } = require('../models');
const sendEmail = require('../utils/sendEmail');

const getPromoEmailHistory = async (req, res, next) => {
  try {
    const { userId } = req.params;
    
    const logs = await PromoEmailLog.findAll({
      where: { userId },
      include: [
        { model: User, as: 'sender', attributes: ['id', 'name'] }
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({ success: true, data: logs });
  } catch (error) {
    next(error);
  }
};

const sendManualPromoEmail = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const { shape } = req.body;

    if (!['circular', 'rectangle'].includes(shape)) {
      res.status(400);
      return next(new Error('Tipe dome tidak valid. Harus circular atau rectangle.'));
    }

    const user = await User.findByPk(userId);
    if (!user) {
      res.status(404);
      return next(new Error('User tidak ditemukan.'));
    }

    const subject = `Rekomendasi Spesial: Desain Dome ${shape === 'circular' ? 'Circular' : 'Rectangle'}`;
    const message = `Halo ${user.name},\n\nTerima kasih telah menggunakan BioGasCalc!\nKami melihat Anda sangat tertarik dalam merancang dome. Berikut adalah rekomendasi dan tips terbaik untuk merancang dome ${shape === 'circular' ? 'Circular' : 'Rectangle'} yang efisien.\n\nSalam,\nTim BioGasCalc`;
    
    await sendEmail({
      email: user.email,
      subject,
      message,
    });

    await PromoEmailLog.create({
      userId: user.id,
      shape,
      type: 'manual',
      sentById: req.user.id,
    });

    res.json({ success: true, message: `Email promosi manual (${shape}) berhasil dikirim ke ${user.name}.` });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getPromoEmailHistory,
  sendManualPromoEmail,
};
