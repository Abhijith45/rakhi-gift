/**
 * Production Structured Logger
 * Provides structured logging with log levels, timestamps, request correlation IDs,
 * and automatic redaction of sensitive credentials, secrets, and customer PII.
 */

const SENSITIVE_KEYS = new Set([
  'password',
  'admin_password_hash',
  'jwt_secret',
  'razorpay_key_secret',
  'razorpay_webhook_secret',
  'cloudinary_api_secret',
  'signature',
  'razorpay_signature',
  'token',
  'authorization',
  'cookie'
]);

/**
 * Recursively redacts sensitive keys from log metadata objects
 */
function sanitizeLogData(data) {
  if (!data || typeof data !== 'object') return data;
  if (data instanceof Error) {
    return {
      message: data.message,
      stack: process.env.NODE_ENV === 'production' ? undefined : data.stack,
      code: data.code
    };
  }

  if (Array.isArray(data)) {
    return data.map(item => sanitizeLogData(item));
  }

  const sanitized = {};
  for (const [key, value] of Object.entries(data)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('secret') || lowerKey.includes('password')) {
      sanitized[key] = '[REDACTED]';
    } else if (typeof value === 'object' && value !== null) {
      sanitized[key] = sanitizeLogData(value);
    } else {
      sanitized[key] = value;
    }
  }
  return sanitized;
}

function formatLog(level, message, meta = {}, req = null) {
  const timestamp = new Date().toISOString();
  const requestId = req?.id || meta?.requestId || undefined;
  const payload = {
    timestamp,
    level,
    message,
    ...(requestId && { requestId }),
    ...(Object.keys(meta).length > 0 && { meta: sanitizeLogData(meta) })
  };

  if (process.env.NODE_ENV === 'production') {
    return JSON.stringify(payload);
  }

  // Readable colorful output for development
  const color = {
    info: '\x1b[36m', // Cyan
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    debug: '\x1b[90m'  // Gray
  }[level] || '\x1b[0m';

  const reqPart = requestId ? ` [${requestId}]` : '';
  const metaPart = Object.keys(meta).length > 0 ? ` | ${JSON.stringify(sanitizeLogData(meta))}` : '';
  return `${color}[${timestamp}] [${level.toUpperCase()}]${reqPart} ${message}\x1b[0m${metaPart}`;
}

export const logger = {
  info: (msg, meta = {}, req = null) => {
    console.log(formatLog('info', msg, meta, req));
  },
  warn: (msg, meta = {}, req = null) => {
    console.warn(formatLog('warn', msg, meta, req));
  },
  error: (msg, meta = {}, req = null) => {
    console.error(formatLog('error', msg, meta, req));
  },
  debug: (msg, meta = {}, req = null) => {
    if (process.env.NODE_ENV !== 'production') {
      console.log(formatLog('debug', msg, meta, req));
    }
  }
};

export default logger;
