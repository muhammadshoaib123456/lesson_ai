const prisma = require('./prisma');

function buildWhere({ grade, subject, q }) {
  const where = {};
  if (grade) where.grade = grade;
  if (subject) where.subject = subject;
  if (q) {
    where.OR = [
      { title:    { contains: q } },
      { topic:    { contains: q } },
      { subTopic: { contains: q } },
      { summary:  { contains: q } },
    ];
  }
  return where;
}

async function list({ grade, subject, q, page = 1, limit = 24 }) {
  page = Number(page) || 1;
  limit = Math.min(Number(limit) || 24, 100);
  const where = buildWhere({ grade, subject, q });
  const [items, total] = await Promise.all([
    prisma.libraryItem.findMany({
      where, orderBy: { updatedAt: 'desc' },
      skip: (page - 1) * limit, take: limit,
    }),
    prisma.libraryItem.count({ where }),
  ]);
  return { items, total, page, pages: Math.ceil(total / limit) };
}

async function getByIdOrSlug(idOrSlug) {
  const isNum = /^\d+$/.test(idOrSlug);
  const where = isNum ? { id: Number(idOrSlug) } : { slug: idOrSlug };
  const item = await prisma.libraryItem.findUnique({ where });
  if (!item) throw { status: 404, message: 'Library item not found' };
  return item;
}

async function meta() {
  const [grades, subjects] = await Promise.all([
    prisma.libraryItem.findMany({ distinct: ['grade'], select: { grade: true }, where: { grade: { not: null } } }),
    prisma.libraryItem.findMany({ distinct: ['subject'], select: { subject: true }, where: { subject: { not: null } } }),
  ]);
  return {
    grades: grades.map(g => g.grade).filter(Boolean).sort(),
    subjects: subjects.map(s => s.subject).filter(Boolean).sort(),
  };
}

/** Facet counts for current query (for filter panel numbers) */
async function facets({ grade, subject, q }) {
  const where = buildWhere({ grade, subject, q });

  const [gradeBuckets, subjectBuckets] = await Promise.all([
    prisma.libraryItem.groupBy({ by: ['grade'], where, _count: { _all: true } }),
    prisma.libraryItem.groupBy({ by: ['subject'], where, _count: { _all: true } }),
  ]);

  return {
    grades: gradeBuckets
      .filter(g => g.grade)
      .map(g => ({ value: g.grade, count: g._count._all }))
      .sort((a, b) => a.value.localeCompare(b.value)),
    subjects: subjectBuckets
      .filter(s => s.subject)
      .map(s => ({ value: s.subject, count: s._count._all }))
      .sort((a, b) => a.value.localeCompare(b.value)),
  };
}

module.exports = { list, getByIdOrSlug, meta, facets, buildWhere };
