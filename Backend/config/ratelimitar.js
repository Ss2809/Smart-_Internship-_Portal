const ratelimitar = require("express-rate-limit");

const ratelimitvalid = ratelimitar({
  windowMs: 10 * 60 * 1000,
  max: 5,
   standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, try after 10 minutes.",
  }
});

module.exports = ratelimitvalid;
