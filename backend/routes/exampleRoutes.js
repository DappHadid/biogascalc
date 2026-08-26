const express = require('express');
const router = express.Router();
const {
  getExamples,
  getExampleById,
  createExample,
  updateExample,
  deleteExample,
} = require('../controllers/exampleController');

router.route('/').get(getExamples).post(createExample);

router.route('/:id').get(getExampleById).put(updateExample).delete(deleteExample);

module.exports = router;
