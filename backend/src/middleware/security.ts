import { Request, Response, NextFunction } from "express";
import { ApiError } from "../utils/errors";

export function hppProtection(req: Request, _res: Response, next: NextFunction): void {
  const rawQuery = req.url?.split("?")[1] || "";
  const params: Record<string,number> = {};
  if (rawQuery) { rawQuery.split("&").forEach((pair) => { const [key] = pair.split("="); if (key) { params[key] = (params[key]||0)+1; if (params[key] > 1) throw ApiError.badRequest(`Duplicate param '${key}'`); } }); }
  next();
}

export function sanitizeRequest(req: Request, _res: Response, next: NextFunction): void {
  function sanitize(obj: any): void { if (!obj || typeof obj !== "object") return; for (const key of Object.keys(obj)) { if (typeof obj[key] === "string") obj[key] = obj[key].trim(); else if (typeof obj[key] === "object") sanitize(obj[key]); } }
  if (req.body) sanitize(req.body);
  if (req.query) sanitize(req.query);
  next();
}