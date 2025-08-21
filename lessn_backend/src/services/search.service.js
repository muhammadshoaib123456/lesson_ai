const prisma = require('./prisma');

function norm(s) { return (s || '').trim(); }

/** Live suggestions for the landing page search box. */
async function suggest({ q, limit = 5 }) {
  q = norm(q);
  limit = Math.min(Math.max(Number(limit) || 5, 1), 20);
  if (!q) return [];

  const where = {
    OR: [
      { title:    { contains: q } },
      { topic:    { contains: q } },
      { subTopic: { contains: q } },
      { summary:  { contains: q } },
    ],
  };

  const items = await prisma.libraryItem.findMany({
    where,
    select: { id: true, slug: true, title: true, grade: true, subject: true, thumbUrl: true },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  });

  return items;
}

module.exports = { suggest };
