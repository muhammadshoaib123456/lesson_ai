const router = require('express').Router();
const ctrl = require('../controllers/lessons.controller');
// const { requireAuth } = require('../middleware/auth');
const { validateBody } = require('../utils/validation');

router.post('/generate',
  validateBody({
    topic: { required: true },
    grade: {},
    subject: {},
    length: {},
    language: {}
  }),
  /* requireAuth, */
  ctrl.createGenerate
);

router.get('/:id', /* requireAuth, */ ctrl.getOne);
router.post('/:id/export', /* requireAuth, */ ctrl.exportPptx);

module.exports = router;
