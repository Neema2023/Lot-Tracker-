const rateLimit = require("express-rate-limit");

const writeRateLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes

    max: 100, // Maximum 100 write requests per 15 minutes

    message: {
        message: "Too many write requests. Please try again later."
    },

    standardHeaders: true,

    legacyHeaders: false
});

module.exports = writeRateLimiter;