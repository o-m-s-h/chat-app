const rateLimit = require("express-rate-limit");
// const RedisStore = require("rate-limit-redis");
const { RedisStore } = require("rate-limit-redis");
const redis = require("../config/redis");

// ==============================
// 🌐 Global HTTP Rate Limiter
// ==============================
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  handler: (req, res) => {
    res.status(429).json({ error: "Too many requests, please slow down." });
  },
});

// ==============================
// 🔐 Strict Auth Rate Limiter
// ==============================
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // only 10 login/register attempts
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args) => redis.call(...args),
  }),
  handler: (req, res) => {
    res.status(429).json({ error: "Too many auth attempts, try again later." });
  },
});

// ==============================
// ⚡ Socket Event Rate Limiter
// ==============================
const socketRateLimiter = async (redis, userId, event, limit, windowSec) => {
  const key = `rate:${event}:${userId}`;

  const current = await redis.incr(key);

  if (current === 1) {
    await redis.expire(key, windowSec);
  }

  if (current > limit) {
    return false; // rate limited
  }

  return true; // allowed
};

module.exports = { globalLimiter, authLimiter, socketRateLimiter };