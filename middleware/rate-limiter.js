import { config } from "../config.js";
import rateLimit from "express-rate-limit";

export default rateLimit({
  windowMs: config.rateLimit.windowMs,
  max: config.rateLimit.maxRequest,
  // keyGenerator: (req, res) => `dwitter`,
});
