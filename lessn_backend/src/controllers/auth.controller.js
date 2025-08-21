const svc = require('../services/auth.service');

async function register(req, res, next) {
  try { res.status(201).json(await svc.register(req.body)); }
  catch (e) { next(e); }
}

async function login(req, res, next) {
  try { res.json(await svc.login(req.body)); }
  catch (e) { next(e); }
}

async function me(req, res, next) {
  try { res.json(await svc.me(req.user.id)); }
  catch (e) { next(e); }
}

async function forgot(req, res, next) {
  try { res.json(await svc.requestPasswordReset(req.body)); }
  catch (e) { next(e); }
}

async function reset(req, res, next) {
  try { res.json(await svc.resetPassword(req.body)); }
  catch (e) { next(e); }
}

module.exports = { register, login, me, forgot, reset };
