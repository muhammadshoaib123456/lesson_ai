const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const morgan = require('morgan');
const path = require('path');

const corsCfg = require('./config/cors');
const { STORAGE_DIR } = require('./config/env');
const { notFound, errorHandler } = require('./middleware/errors');

const authRoutes    = require('./routes/auth.routes');
const libraryRoutes = require('./routes/library.routes');
const topicsRoutes  = require('./routes/topics.routes');
const lessonsRoutes = require('./routes/lessons.routes');
const searchRoutes  = require('./routes/search.routes'); // <-- added

const app = express();
app.set('trust proxy', 1);

// Security / perf
app.use(helmet());
app.use(compression());
app.use(morgan('combined'));

// CORS + body
app.use(cors(corsCfg));
app.use(express.json());

// Static files (for exported PPTX, etc.)
app.use('/files', express.static(path.resolve(STORAGE_DIR)));

// Basic rate limit on API
app.use('/api/', rateLimit({ windowMs: 60 * 1000, max: 120 }));

// Health
app.get('/health', (_req, res) =>
  res.json({ ok: true, env: process.env.NODE_ENV || 'dev', time: new Date().toISOString() })
);

// Routes
app.use('/api/auth',    authRoutes);
app.use('/api/library', libraryRoutes);
app.use('/api/topics',  topicsRoutes);
app.use('/api/lessons', lessonsRoutes);
app.use('/api/search',  searchRoutes);   // <-- added

// 404 + error handler
app.use(notFound);
app.use(errorHandler);

module.exports = app;
