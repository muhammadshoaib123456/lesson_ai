const router = require('express').Router();
const rateLimit = require('express-rate-limit');
const ctrl = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { validateBody } = require('../utils/validation');

// stricter limits for sensitive endpoints
const strict = rateLimit({ windowMs: 15 * 60 * 1000, limit: 20 });

router.post('/register', validateBody({
  email: { required: true },
  password: { required: true, min: 6 },
  name: {}
}), ctrl.register);

router.post('/login', validateBody({
  email: { required: true },
  password: { required: true, min: 6 }
}), ctrl.login);

router.get('/me', requireAuth, ctrl.me);

// Forgot / Reset
router.post('/forgot', strict, validateBody({ email: { required: true } }), ctrl.forgot);

router.post('/reset', strict, validateBody({
  email: { required: true },
  token: { required: true },
  password: { required: true, min: 6 },
}), ctrl.reset);

module.exports = router;
