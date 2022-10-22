const rateLimiter = require("express-rate-limit");

const rateLimitProtection = (minute, limit) =>
    rateLimiter({
        windowMs: minute * 60 * 1000,
        max: limit,
        standardHeaders: true,
        store: new rateLimiter.MemoryStore(),
        message: {
            message: "Too many request",
        },
    });

module.exports = { rateLimitProtection };
