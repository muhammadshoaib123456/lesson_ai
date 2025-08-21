const svc = require('../services/auth.service');

async function register(req, res, next) {
  try {
    const out = await svc.register(req.body);
    res.status(201).json(out);
  } catch (e) { next(e); }
}

async function login(req, res, next) {
  try {
    const out = await svc.login(req.body);
    res.json(out);
  } catch (e) { next(e); }
}

async function me(req, res, next) {
  try {
    const out = await svc.me(req.user.id);
    res.json(out);
  } catch (e) { next(e); }
}

module.exports = { register, login, me };
