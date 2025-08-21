// src/routes/search.routes.js
const router = require('express').Router();
const ctrl = require('../controllers/search.controller');

// /api/search/suggest?q=...&limit=5
router.get('/suggest', ctrl.suggest);

module.exports = router;
