import crypto from 'crypto';

/**
 * Production Request Correlation Middleware
 * Attaches a unique X-Request-ID to every incoming HTTP request and response header.
 * Allows tracing user journeys and backend operations across logs.
 */
export function requestIdMiddleware(req, res, next) {
  const existingId = req.headers['x-request-id'];
  const requestId = existingId && typeof existingId === 'string'
    ? existingId.substring(0, 64)
    : `req_${crypto.randomBytes(8).toString('hex')}`;

  req.id = requestId;
  res.setHeader('X-Request-ID', requestId);
  next();
}

export default requestIdMiddleware;
