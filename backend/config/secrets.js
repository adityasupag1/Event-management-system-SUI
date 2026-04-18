/** Trim env values (avoids BOM/whitespace breaking JWT/session). */

function trim(v) {
  return (v || '').trim();
}

function jwtSecret() {
  const s = trim(process.env.JWT_SECRET);
  if (!s) throw new Error('JWT_SECRET is not set (add it to backend/.env or your host env)');
  return s;
}

/** express-session requires a non-empty secret. */
function sessionSecretForExpress() {
  const s = trim(process.env.SESSION_SECRET);
  if (s) return s;
  if (process.env.NODE_ENV === 'production') {
    throw new Error('SESSION_SECRET must be set in production');
  }
  return 'ems-local-dev-session-not-for-production';
}

module.exports = { jwtSecret, sessionSecretForExpress };
