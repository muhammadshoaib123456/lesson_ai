const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const prisma = require('./prisma');
const { JWT_SECRET, APP_URL } = require('../config/env');
const { sendMail } = require('./email.service');

/* helpers */
function sign(user) {
  return jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '7d' });
}
function publicUser(u) { return { id: u.id, email: u.email, name: u.name }; }
function sha256(s) { return crypto.createHash('sha256').update(s).digest('hex'); }

async function register({ email, password, name }) {
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  const exists = await prisma.user.findUnique({ where: { email } });
  if (exists) throw { status: 409, message: 'Email already registered' };

  const hash = await bcrypt.hash(password, 10);
  const user = await prisma.user.create({ data: { email, password: hash, name } });
  const token = sign(user);
  return { token, user: publicUser(user) };
}

async function login({ email, password }) {
  if (!email || !password) throw { status: 400, message: 'Email and password required' };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 401, message: 'Invalid credentials' };
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw { status: 401, message: 'Invalid credentials' };
  const token = sign(user);
  return { token, user: publicUser(user) };
}

async function me(userId) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { id: true, email: true, name: true } });
  return user;
}

/* === Forgot / Reset === */

async function requestPasswordReset({ email }) {
  if (!email) throw { status: 400, message: 'Email required' };
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    // do not reveal user existence
    return { ok: true };
  }

  // delete expired/used tokens for this user (optional hygiene)
  await prisma.passwordResetToken.deleteMany({
    where: { userId: user.id, OR: [{ usedAt: { not: null } }, { expiresAt: { lt: new Date() } }] },
  });

  // create a new token
  const raw = crypto.randomBytes(32).toString('hex'); // sent to user
  const tokenHash = sha256(raw); // stored in DB
  const expiresAt = new Date(Date.now() + 1000 * 60 * 30); // 30 minutes

  await prisma.passwordResetToken.create({
    data: { userId: user.id, tokenHash, expiresAt },
  });

  const link = `${APP_URL}/reset-password?token=${raw}&email=${encodeURIComponent(email)}`;

  await sendMail({
    to: email,
    subject: 'Reset your Lessn password',
    text: `Click this link to reset your password:\n\n${link}\n\nThis link expires in 30 minutes.`,
    html: `<p>Click this link to reset your password:</p><p><a href="${link}">${link}</a></p><p>This link expires in 30 minutes.</p>`,
  });

  return { ok: true };
}

async function resetPassword({ email, token, password }) {
  if (!email || !token || !password) throw { status: 400, message: 'Email, token and new password are required' };

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) throw { status: 400, message: 'Invalid reset request' };

  const tokenHash = sha256(token);
  const now = new Date();

  const rec = await prisma.passwordResetToken.findUnique({ where: { tokenHash } });
  if (!rec || rec.userId !== user.id || rec.usedAt || rec.expiresAt < now) {
    throw { status: 400, message: 'Invalid or expired token' };
  }

  // update password
  const hash = await bcrypt.hash(password, 10);
  await prisma.user.update({ where: { id: user.id }, data: { password: hash } });

  // mark token used
  await prisma.passwordResetToken.update({
    where: { tokenHash },
    data: { usedAt: new Date() },
  });

  const jwtToken = sign(user);
  return { token: jwtToken, user: publicUser(user) };
}

module.exports = {
  register,
  login,
  me,
  requestPasswordReset,
  resetPassword,
};
