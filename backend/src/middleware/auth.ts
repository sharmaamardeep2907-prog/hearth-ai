import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../utils/errors";
import { UserRole, AuthRequest } from "../types";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) throw ApiError.unauthorized("Missing authorization header");
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
    if (decoded.iss !== config.jwt.issuer) throw ApiError.unauthorized("Invalid issuer");
    (req as AuthRequest).user = { id: decoded.sub, email: decoded.email, role: decoded.role, status: decoded.status, sessionId: decoded.sessionId };
    next();
  } catch (error: any) {
    if (error instanceof ApiError) { next(error); return; }
    if (error.name === "TokenExpiredError") { next(ApiError.unauthorized("Token expired")); return; }
    next(ApiError.unauthorized("Authentication failed"));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
    (req as AuthRequest).user = { id: decoded.sub, email: decoded.email, role: decoded.role, status: decoded.status, sessionId: decoded.sessionId };
  } catch {}
  next();
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const user = (req as AuthRequest).user;
    if (!user) { next(ApiError.unauthorized()); return; }
    if (user.status !== "active") { next(ApiError.forbidden(`Account is ${user.status}`)); return; }
    if (!allowedRoles.includes(user.role)) { next(ApiError.forbidden("Not authorized")); return; }
    next();
  };
}