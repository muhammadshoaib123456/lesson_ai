// src/controllers/library.controller.js
const svc = require('../services/library.service');

async function list(req, res, next) {
  try { res.json(await svc.list(req.query)); }
  catch (e) { next(e); }
}

async function detail(req, res, next) {
  try { res.json(await svc.getByIdOrSlug(req.params.id)); }
  catch (e) { next(e); }
}

async function meta(_req, res, next) {
  try { res.json(await svc.meta()); }
  catch (e) { next(e); }
}

/** Facet counts */
async function facets(req, res, next) {
  try { res.json(await svc.facets(req.query)); }
  catch (e) { next(e); }
}

/** Protected: download PPTX -> redirect to remote url */
async function downloadPpt(req, res, next) {
  try {
    const item = await svc.getByIdOrSlug(req.params.id);
    if (!item.pptxUrl) throw { status: 404, message: 'PPT not available' };
    return res.redirect(302, item.pptxUrl);
  } catch (e) { next(e); }
}

/** Protected: download PDF -> redirect to remote url */
async function downloadPdf(req, res, next) {
  try {
    const item = await svc.getByIdOrSlug(req.params.id);
    if (!item.pdfUrl) throw { status: 404, message: 'PDF not available' };
    return res.redirect(302, item.pdfUrl);
  } catch (e) { next(e); }
}

/** Protected: open Google Slides/Slides URL */
async function openSlides(req, res, next) {
  try {
    const item = await svc.getByIdOrSlug(req.params.id);
    const url = item.slidesUrl || item.viewUrl;
    if (!url) throw { status: 404, message: 'Slides link not available' };
    return res.redirect(302, url);
  } catch (e) { next(e); }
}

module.exports = { list, detail, meta, facets, downloadPpt, downloadPdf, openSlides };
