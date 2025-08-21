/* Import topics.csv into LibraryItem (idempotent upsert by slug/extId) */
const fs = require('fs');
const path = require('path');
const csv = require('csv-parser');
const prisma = require('../services/prisma');
const slugify = require('../utils/slugify');

const CSV_PATH = path.join(__dirname, '..', 'data', 'topics.csv');

async function run() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error('CSV not found at', CSV_PATH);
    process.exit(1);
  }

  const rows = [];
  await new Promise((resolve, reject) => {
    fs.createReadStream(CSV_PATH)
      .pipe(csv())
      .on('data', (row) => rows.push(row))
      .on('end', resolve)
      .on('error', reject);
  });

  let upserts = 0;
  for (const r of rows) {
    const title = r.title || r.name || r.Topic || r.topic || 'Untitled';
    const grade = r.grade || r.Grade || null;
    const subject = r.subject || r.Subject || null;
    const topic = r.topic || r.Topic || null;
    const subTopic = r.sub_topic || r.SubTopic || r.Sub_Topic || null;

    const thumbUrl  = r.thumbnail || r.thumb || r.image || null;
    const viewUrl   = r.presentation_view_link || r.view || null;
    const pptxUrl   = r.download_ppt_url || r.pptx || null;
    const pdfUrl    = r.download_pdf_url || r.pdf || null;
    const slidesUrl = r.slides_export_link_url || r.slides || null;

    const metaTitle = r.meta_titles || r.meta_title || null;
    const metaDesc  = r.meta_description || r.meta_desc || null;
    const summary   = r.summary || r.description || null;

    const extId = r.id || r.ID || r.external_id || null;
    const srcSlug = r.slug || r.Slug;

    let slug = srcSlug ? String(srcSlug) : slugify([title, grade, subject].filter(Boolean).join('-'));
    // Make unique if needed
    let candidate = slug; let i = 2;
    // eslint-disable-next-line no-await-in-loop
    while (await prisma.libraryItem.findUnique({ where: { slug: candidate } })) {
      candidate = `${slug}-${i++}`;
    }
    slug = candidate;

    const where = extId ? { extId } : { slug };
    await prisma.libraryItem.upsert({
      where,
      update: {
        slug, title, grade, subject, topic, subTopic, summary,
        thumbUrl, viewUrl, pptxUrl, pdfUrl, slidesUrl, metaTitle, metaDesc,
      },
      create: {
        extId, slug, title, grade, subject, topic, subTopic, summary,
        thumbUrl, viewUrl, pptxUrl, pdfUrl, slidesUrl, metaTitle, metaDesc,
      },
    });

    upserts++;
  }

  console.log(`Imported/updated ${upserts} library items.`);
  await prisma.$disconnect();
}

run().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
