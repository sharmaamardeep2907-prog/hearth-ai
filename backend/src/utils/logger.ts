import winston from "winston";
import path from "path";
import fs from "fs";
import { config } from "../config";

const logDir = path.resolve(config.logging.dir);
if (!fs.existsSync(logDir)) fs.mkdirSync(logDir, { recursive: true });

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss.SSS" }),
  winston.format.errors({ stack: true }),
  config.server.isDev ? winston.format.combine(winston.format.colorize(), winston.format.printf(({ timestamp, level, message, ...meta }) => { const metaStr = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ""; return `${timestamp} [${level}]: ${message}${metaStr}`; })) : winston.format.json()
);

export const logger = winston.createLogger({
  level: config.logging.level,
  format: logFormat,
  transports: [new winston.transports.Console(), new winston.transports.File({ filename: path.join(logDir, "error.log"), level: "error", maxsize: 5242880, maxFiles: 5 }), new winston.transports.File({ filename: path.join(logDir, "combined.log"), maxsize: 5242880, maxFiles: 10 })],
});

export const aiLogger = logger.child({ service: "ai" });
export const socketLogger = logger.child({ service: "socket" });
