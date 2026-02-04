import rateLimit from "express-rate-limit";

const ratelimitvalid = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 5,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many login attempts, try after 10 minutes.",
  },
});

export default ratelimitvalid;
