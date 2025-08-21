// src/routes/library.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/library.controller');
const { requireAuth } = require('../middleware/auth');

router.get('/', ctrl.list);                 // /api/library
router.get('/meta', ctrl.meta);             // /api/library/meta
router.get('/facets', ctrl.facets);         // /api/library/facets?q=&grade=&subject=

// gated downloads (login required)
router.get('/:id/download/ppt', requireAuth, ctrl.downloadPpt);
router.get('/:id/download/pdf', requireAuth, ctrl.downloadPdf);
router.get('/:id/open/slides',  requireAuth, ctrl.openSlides);

router.get('/:id', ctrl.detail);            // /api/library/:idOrSlug  (keep last)

module.exports = router;
