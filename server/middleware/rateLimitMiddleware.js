/**
 * Production In-Memory Sliding Window Rate Limiter
 * Lightweight, zero-dependency, self-cleaning rate limiter.
 * Protects auth endpoints, payment creation, and public APIs from abuse.
 */

class RateLimiter {
  constructor({ windowMs = 60 * 1000, max = 60, message = 'Too many requests, please try again later.', code = 'RATE_LIMIT_EXCEEDED' }) {
    this.windowMs = windowMs;
    this.max = max;
    this.message = message;
    this.code = code;
    this.hits = new Map();

    // Periodic sweep to prevent memory leak
    this.sweepInterval = setInterval(() => {
      const now = Date.now();
      for (const [key, timestamps] of this.hits.entries()) {
        const active = timestamps.filter(time => now - time < this.windowMs);
        if (active.length === 0) {
          this.hits.delete(key);
        } else {
          this.hits.set(key, active);
        }
      }
    }, Math.min(this.windowMs, 60000));

    if (this.sweepInterval.unref) {
      this.sweepInterval.unref();
    }
  }

  middleware() {
    return (req, res, next) => {
      // Extract client IP identifier
      const forwarded = req.headers['x-forwarded-for'];
      const ip = (typeof forwarded === 'string' ? forwarded.split(',')[0].trim() : req.socket.remoteAddress) || 'unknown';
      const key = `${req.method}:${req.baseUrl || ''}${req.path}:${ip}`;
      const now = Date.now();

      const timestamps = this.hits.get(key) || [];
      const windowStart = now - this.windowMs;
      const recentHits = timestamps.filter(time => time > windowStart);

      if (recentHits.length >= this.max) {
        const oldestHit = recentHits[0];
        const resetTimeMs = this.windowMs - (now - oldestHit);
        const retryAfterSeconds = Math.ceil(Math.max(1, resetTimeMs / 1000));

        res.setHeader('Retry-After', retryAfterSeconds);
        res.setHeader('X-RateLimit-Limit', this.max);
        res.setHeader('X-RateLimit-Remaining', 0);
        res.setHeader('X-RateLimit-Reset', Math.ceil((now + resetTimeMs) / 1000));

        return res.status(429).json({
          success: false,
          error: {
            code: this.code,
            message: this.message,
            retryAfter: retryAfterSeconds
          }
        });
      }

      recentHits.push(now);
      this.hits.set(key, recentHits);

      res.setHeader('X-RateLimit-Limit', this.max);
      res.setHeader('X-RateLimit-Remaining', Math.max(0, this.max - recentHits.length));

      next();
    };
  }
}

/**
 * Strict Rate Limiter for Admin Authentication (5 attempts / 15 minutes)
 */
export const authLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 5,
  code: 'AUTH_RATE_LIMIT_EXCEEDED',
  message: 'Too many login attempts. Please wait 15 minutes before trying again.'
}).middleware();

/**
 * Strict Rate Limiter for Payment Order & Verification (15 requests / 15 minutes)
 */
export const paymentLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 15,
  code: 'PAYMENT_RATE_LIMIT_EXCEEDED',
  message: 'Payment request limit reached. Please try again shortly.'
}).middleware();

/**
 * Rate Limiter for Gift Creation & Photo Uploads (25 requests / 15 minutes)
 */
export const giftDraftLimiter = new RateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 25,
  code: 'GIFT_RATE_LIMIT_EXCEEDED',
  message: 'Too many gift drafts created. Please slow down.'
}).middleware();

/**
 * General API Rate Limiter (120 requests / 1 minute)
 */
export const apiLimiter = new RateLimiter({
  windowMs: 60 * 1000,
  max: 120,
  code: 'API_RATE_LIMIT_EXCEEDED',
  message: 'API rate limit exceeded. Please throttle requests.'
}).middleware();

export default {
  authLimiter,
  paymentLimiter,
  giftDraftLimiter,
  apiLimiter
};
