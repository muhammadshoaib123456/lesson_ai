// Minimal, zero-dependency validator for request bodies.
// Usage: router.post('/route', validateBody({ field: { required: true, min: 3, enum: ['A','B'] } }), handler)

function isNonEmptyString(v) {
  return typeof v === 'string' && v.trim().length > 0;
}

function validateBody(rules) {
  return (req, res, next) => {
    const body = req.body || {};
    const errors = [];

    for (const [field, rule] of Object.entries(rules || {})) {
      const val = body[field];

      if (rule.required && !isNonEmptyString(val)) {
        errors.push(`${field} is required`);
        continue;
      }
      if (rule.min && typeof val === 'string' && val.trim().length < rule.min) {
        errors.push(`${field} must be at least ${rule.min} characters`);
      }
      if (rule.enum && val != null && !rule.enum.includes(val)) {
        errors.push(`${field} must be one of: ${rule.enum.join(', ')}`);
      }
    }

    if (errors.length) {
      return res.status(400).json({ error: 'Validation failed', details: errors });
    }
    next();
  };
}

module.exports = { validateBody };
