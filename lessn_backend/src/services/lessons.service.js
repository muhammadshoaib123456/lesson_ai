const fs = require('fs');
const prisma = require('./prisma');
const { generateLesson } = require('./ai/provider');
const { storagePath, ensureStorageDir } = require('../utils/files');
const PptxGenJS = require('pptxgenjs');

async function getLesson(id) {
  const lesson = await prisma.lesson.findUnique({ where: { id: Number(id) } });
  if (!lesson) throw { status: 404, message: 'Lesson not found' };
  return lesson;
}

async function generate({ ownerId, grade, subject, topic, length, language }) {
  // Create record in GENERATING status (even if we do it synchronously for now)
  let lesson = await prisma.lesson.create({
    data: {
      title: topic || 'Untitled',
      ownerId: ownerId || null,
      grade: grade || null,
      subject: subject || null,
      topic: topic || null,
      status: 'GENERATING',
    },
  });

  try {
    const payload = await generateLesson({ grade, subject, topic, length, language });
    lesson = await prisma.lesson.update({
      where: { id: lesson.id },
      data: { slidesJson: payload, title: payload.title || lesson.title, status: 'READY' },
    });
    return lesson;
  } catch (e) {
    await prisma.lesson.update({ where: { id: lesson.id }, data: { status: 'FAILED' } });
    throw e;
  }
}

async function exportPptx(id) {
  const lesson = await getLesson(id);
  if (!lesson.slidesJson) throw { status: 400, message: 'No slides to export yet' };

  const deck = new PptxGenJS();
  const meta = lesson.slidesJson;

  // Title slide
  deck.addSlide().addText(meta.title || 'Lesson', { x: 0.5, y: 1.5, fontSize: 36, bold: true });

  // Content slides
  (meta.slides || []).forEach((s) => {
    const slide = deck.addSlide();
    slide.addText(s.title || '', { x: 0.5, y: 0.5, fontSize: 28, bold: true });
    if (Array.isArray(s.bullets) && s.bullets.length) {
      slide.addText(
        s.bullets.map((b) => `• ${b}`).join('\n'),
        { x: 0.5, y: 1.2, fontSize: 18, lineSpacing: 20 }
      );
    }
    if (s.notes) {
      slide.addNotes(s.notes);
    }
  });

  ensureStorageDir();
  const filePath = storagePath(`lesson_${lesson.id}.pptx`);
  await deck.writeFile({ fileName: filePath });

  const updated = await prisma.lesson.update({
    where: { id: lesson.id },
    data: { pptxUrl: `/files/lesson_${lesson.id}.pptx` }, // if you mounted /files static
  });

  return { filePath, lesson: updated };
}

module.exports = { generate, getLesson, exportPptx };
