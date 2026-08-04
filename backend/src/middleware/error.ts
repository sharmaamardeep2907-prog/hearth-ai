import { Request, Response, NextFunction } from "express";
import v8 from "v8";
import os from "os";
import { ApiError } from "../utils/errors";
import { logger } from "../utils/logger";
import { config } from "../config";
import { AuthRequest } from "../types";

export function errorHandler(err: Error, req: Request, res: Response, _next: NextFunction): void {
  const requestId = (req as AuthRequest).requestId || "unknown";
  if (err instanceof ApiError) {
    err.log();
    res.status(err.statusCode).json({ success: false, statusCode: err.statusCode, message: err.message, errorCode: err.errorCode, requestId, timestamp: new Date().toISOString(), ...(config.server.isDev && err.details ? { details: err.details } : {}) });
    return;
  }
  if ((err as any).code === 11000) {
    res.status(409).json({ success: false, statusCode: 409, message: "Duplicate entry", errorCode: "DUPLICATE_KEY", requestId, timestamp: new Date().toISOString() });
    return;
  }
  logger.error("Unhandled error", { error: err.message, stack: err.stack, path: req.path });
  res.status(500).json({ success: false, statusCode: 500, message: config.server.isDev ? err.message : "Internal Server Error", errorCode: "INTERNAL_ERROR", requestId, timestamp: new Date().toISOString() });
}

export function notFoundHandler(req: Request, _res: Response, next: NextFunction): void { next(ApiError.notFound(`Route ${req.method} ${req.originalUrl} not found`)); }

export function requestContext(req: Request, _res: Response, next: NextFunction): void {
  import("uuid").then(({ v4: uuidv4 }) => { (req as AuthRequest).requestId = uuidv4(); (req as AuthRequest).correlationId = (req.headers["x-correlation-id"] as string) || uuidv4(); next(); });
}

export function getHealthData() {
  const totalMem = os.totalmem();
  const freeMem = os.freemem();
  return { status: "healthy", timestamp: new Date().toISOString(), uptime: Math.floor(process.uptime()), memory: { total: `${(totalMem / 1073741824).toFixed(1)} GB`, used: `${((totalMem - freeMem) / 1073741824).toFixed(1)} GB`, usagePercent: ((1 - freeMem / totalMem) * 100).toFixed(1) }, cpu: { cores: os.cpus().length, loadAvg: os.loadavg() }, node: process.version };
}