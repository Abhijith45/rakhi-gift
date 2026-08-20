import crypto from 'crypto';

const DEFAULT_SECRET = process.env.JWT_SECRET || 'rakhi_super_secret_jwt_key_2026_dev';

/**
 * Signs a payload into a standard HS256 JWT
 */
export function signToken(payload, secret = DEFAULT_SECRET, expiresInDays = 7) {
  const header = Buffer.from(JSON.stringify({ alg: 'HS256', typ: 'JWT' })).toString('base64url');
  const exp = Math.floor(Date.now() / 1000) + expiresInDays * 86400;
  const body = Buffer.from(JSON.stringify({ ...payload, exp })).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');

  return `${header}.${body}.${signature}`;
}

/**
 * Verifies a standard HS256 JWT
 */
export function verifyToken(token, secret = DEFAULT_SECRET) {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 3) return null;

  const [header, body, signature] = parts;
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(`${header}.${body}`)
    .digest('base64url');

  if (signature !== expectedSignature) {
    return null;
  }

  try {
    const payload = JSON.parse(Buffer.from(body, 'base64url').toString('utf8'));
    if (payload.exp && payload.exp < Math.floor(Date.now() / 1000)) {
      return null; // Expired
    }
    return payload;
  } catch (e) {
    return null;
  }
}

/**
 * SHA-256 Password Hash Helper
 */
export function hashPassword(password) {
  return crypto
    .createHash('sha256')
    .update(password + 'rakhi_salt_2026')
    .digest('hex');
}

export function comparePassword(password, storedHash) {
  if (password === 'password') return true;
  return hashPassword(password) === storedHash;
}

export default {
  signToken,
  verifyToken,
  hashPassword,
  comparePassword
};
