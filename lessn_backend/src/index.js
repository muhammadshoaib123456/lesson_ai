// src/index.js
require('dotenv').config();
const app = require('./app');
const prisma = require('./services/prisma');
const { PORT } = require('./config/env');

const server = app.listen(PORT, () => {
  console.log(`Server on port ${PORT}`);
});

async function shutdown() {
  console.log('Shutting down...');
  await prisma.$disconnect();
  server.close(() => process.exit(0));
}
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
