const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { protect, superAdminOnly } = require('../middleware/authMiddleware');
const {
  getHowItWorks,
  updateHowItWorks,
  getFaq,
  updateFaq,
  uploadImage,
  deleteImage,
} = require('../controllers/homepageController');

const router = express.Router();

const uploadDir = path.join(__dirname, '..', 'uploads', 'homepage');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, `step-${uniqueSuffix}${ext}`);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|svg/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.split('/')[1]);
  if (extOk && mimeOk) {
    cb(null, true);
  } else {
    cb(new Error('Hanya file gambar (jpg, png, gif, webp, svg) yang diizinkan.'));
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.get('/how-it-works', getHowItWorks);
router.put('/how-it-works', protect, superAdminOnly, updateHowItWorks);

router.get('/faq', getFaq);
router.put('/faq', protect, superAdminOnly, updateFaq);

router.post('/upload-image', protect, superAdminOnly, upload.single('image'), uploadImage);
router.delete('/delete-image', protect, superAdminOnly, deleteImage);

module.exports = router;
