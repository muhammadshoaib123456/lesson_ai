const fs = require('fs');
const path = require('path');
const { STORAGE_DIR } = require('../config/env');

function ensureStorageDir() {
  if (!fs.existsSync(STORAGE_DIR)) fs.mkdirSync(STORAGE_DIR, { recursive: true });
}

function storagePath(...parts) {
  ensureStorageDir();
  return path.join(STORAGE_DIR, ...parts);
}

/**
 * For dev we return a local relative URL (served by Express static if you add it),
 * or send files directly from disk on download endpoints.
 * In prod, you might upload to S3 and return a signed URL instead.
 */
module.exports = { storagePath, ensureStorageDir };
