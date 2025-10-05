const rateLimit = require("express-rate-limit")
// ✅ Global API rate limiter (general endpoints)
const globalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 50,             // max 50 requests per IP per minute
  standardHeaders: true, // sends RateLimit-* headers
  legacyHeaders: false,  // disables X-RateLimit-* headers
  message: "Too many requests, try again later.",
});

// ✅ Login route limiter (more strict)
const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,                  // max 5 attempts per IP
  standardHeaders: true,   // sends RateLimit-* headers
  legacyHeaders: false,    // disables X-RateLimit-* headers
  message: "Too many login attempts, try again after 1 minute",
  skipFailedRequests: false, // count failed requests too
});

module.exports = {globalLimiter,loginLimiter}