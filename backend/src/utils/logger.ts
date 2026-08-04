import winston from "winston";
import path from "path";
import fs from "fs";
import { config } from "../config";

const logDir = path.resolve(config.logging.dir);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFormat = winston.format.combine(winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }), winston.format.errors({ stack: true }), config.server.isDev ? winston.format.combine(winston.format.colorize(), winston.format.printf(({ timestamp, level, message, ...meta }) => `${timestamp} [${level}]: ${message}${Object.keys(meta).length ? " " + JSON.stringify(meta) : ""}`)) : winston.format.json());

export const logger = winston.createLogger({
  level: config.logging.level, format: logFormat,
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error", maxsize: 10485760, maxFiles: 5 }),
    new winston.transports.File({ filename: path.join(logDir, "combined.log"), maxsize: 10485760, maxFiles: 5 }),
  ],
});

export const authLogger = logger.child({ module: "auth" });
export const aiLogger = logger.child({ module: "ai" });
export const paymentLogger = logger.child({ module: "payment" });
export const socketLogger = logger.child({ module: "socket" });