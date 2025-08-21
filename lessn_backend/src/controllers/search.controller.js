// src/controllers/search.controller.js
const svc = require('../services/search.service');

async function suggest(req, res, next) {
  try { res.json(await svc.suggest(req.query)); }
  catch (e) { next(e); }
}

module.exports = { suggest };
