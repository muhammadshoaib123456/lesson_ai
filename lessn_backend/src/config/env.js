require('dotenv').config();

module.exports = {
  NODE_ENV: process.env.NODE_ENV || 'development',
  PORT: process.env.PORT || 5000,
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173',
  JWT_SECRET: process.env.JWT_SECRET || 'dev_secret_change_later',
  STORAGE_DIR: process.env.STORAGE_DIR || 'storage',

  // keep central even if not used yet in code paths
  AI_MODE: (process.env.AI_MODE || 'mock').toLowerCase(),
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  REDIS_URL: process.env.REDIS_URL || '',
};
