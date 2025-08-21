const svc = require('../services/lessons.service');

async function createGenerate(req, res, next) {
  try {
    const ownerId = req.user?.id || null; // if you attach auth later
    const out = await svc.generate({ ownerId, ...req.body });
    res.status(201).json(out);
  } catch (e) { next(e); }
}

async function getOne(req, res, next) {
  try { res.json(await svc.getLesson(req.params.id)); }
  catch (e) { next(e); }
}

async function exportPptx(req, res, next) {
  try {
    const { filePath, lesson } = await svc.exportPptx(req.params.id);
    // Send as a download (direct). Alternatively return JSON with URL.
    res.download(filePath, `lesson_${lesson.id}.pptx`);
  } catch (e) { next(e); }
}

module.exports = { createGenerate, getOne, exportPptx };
