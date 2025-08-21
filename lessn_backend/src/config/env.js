require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_later',
  STORAGE_DIR: process.env.STORAGE_DIR || 'storage',

  // for email links sent in forgot-password (where your frontend lives)
  APP_URL: process.env.APP_URL || 'http://localhost:5173',

  // SMTP (if not provided, we log the link to the console in dev)
  SMTP_HOST: process.env.SMTP_HOST || '',
  SMTP_PORT: Number(process.env.SMTP_PORT || 587),
  SMTP_USER: process.env.SMTP_USER || '',
  SMTP_PASS: process.env.SMTP_PASS || '',
  SMTP_FROM: process.env.SMTP_FROM || 'noreply@lessn.local',
};
