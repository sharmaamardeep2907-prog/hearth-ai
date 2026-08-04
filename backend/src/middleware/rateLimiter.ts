import rateLimit from "express-rate-limit";
import { config } from "../config";

export const globalLimiter = rateLimit({ windowMs: config.rateLimit.windowMs, max: config.rateLimit.max, standardHeaders: true, legacyHeaders: false, message: { success: false, statusCode: 429, message: "Too many requests", errorCode: "RATE_LIMIT", timestamp: new Date().toISOString() } });
export const authLimiter = rateLimit({ windowMs: 900000, max: 10, standardHeaders: true, legacyHeaders: false, message: { success: false, statusCode: 429, message: "Too many auth attempts", errorCode: "AUTH_RATE_LIMIT" } });
export const aiLimiter = rateLimit({ windowMs: 60000, max: 20, standardHeaders: true, legacyHeaders: false, message: { success: false, statusCode: 429, message: "AI rate limit", errorCode: "AI_RATE_LIMIT" } });