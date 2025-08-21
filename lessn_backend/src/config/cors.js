const { FRONTEND_URL } = require('./env');

module.exports = {
  origin: [FRONTEND_URL],
  credentials: true,
  methods: 'GET,POST,PATCH,DELETE,OPTIONS',
  allowedHeaders: 'Content-Type,Authorization',
};
