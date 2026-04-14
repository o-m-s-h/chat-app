const Redis = require("ioredis");

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // required for Upstash (rediss://)
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay;
  },
});

redis.on("connect", () => console.log("✅ Redis connected"));
redis.on("error", (err) => console.error("❌ Redis error:", err.message));

module.exports = redis;