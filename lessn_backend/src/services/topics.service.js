const prisma = require('./prisma');

async function listTopics({ grade, subject, q, page = 1, limit = 50 }) {
  page = Number(page) || 1;
  limit = Math.min(Number(limit) || 50, 200);
  const where = {};
  if (grade) where.grade = grade;
  if (subject) where.subject = subject;
  if (q) where.title = { contains: q };

  const [items, total] = await Promise.all([
    prisma.libraryItem.findMany({
      where,
      select: { id: true, slug: true, title: true, grade: true, subject: true, topic: true, subTopic: true, thumbUrl: true },
      orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    }),
    prisma.libraryItem.count({ where }),
  ]);

  return { items, total, page, pages: Math.ceil(total / limit) };
}

async function getBySlug(slug) {
  const item = await prisma.libraryItem.findUnique({ where: { slug } });
  if (!item) throw { status: 404, message: 'Topic not found' };
  return item;
}

module.exports = { listTopics, getBySlug };
