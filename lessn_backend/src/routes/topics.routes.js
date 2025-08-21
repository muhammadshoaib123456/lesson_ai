const router = require('express').Router();
const ctrl = require('../controllers/topics.controller');

router.get('/', ctrl.list);           // /api/topics?grade=&subject=&q=
router.get('/:slug', ctrl.detail);    // /api/topics/:slug

module.exports = router;
