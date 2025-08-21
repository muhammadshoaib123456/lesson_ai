const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('./prisma');
const { JWT_SECRET } = require('../config/env');

function normEmail(email) {
  return (email || '').trim().toLowerCase();
}

async function register({ email, password, name }) {
  email = normEmail(email);
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw { status: 409, message: 'Email already registered' };
  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, name } });
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

async function login({ email, password }) {
  email = normEmail(email);
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };
  const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
  return { token, user: { id: user.id, email: user.email, name: user.name } };
}

async function me(userId) {
  return prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
}

module.exports = { register, login, me };
