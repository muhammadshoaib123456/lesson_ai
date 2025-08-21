const svc = require('../services/topics.service');

async function list(req, res, next) {
  try { res.json(await svc.listTopics(req.query)); }
  catch (e) { next(e); }
}
async function detail(req, res, next) {
  try { res.json(await svc.getBySlug(req.params.slug)); }
  catch (e) { next(e); }
}

module.exports = { list, detail };
