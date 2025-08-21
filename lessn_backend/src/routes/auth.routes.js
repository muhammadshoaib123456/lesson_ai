const router = require('express').Router();
const ctrl = require('../controllers/auth.controller');
const { requireAuth } = require('../middleware/auth');
const { validateBody } = require('../utils/validation');

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

module.exports = router;
