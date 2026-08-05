import { Request, Response, NextFunction } from "express";
jwt from "jsonwebtoken";
import { config } from "../config";
import { ApiError } from "../utils/errors";
import { UserRole, AuthenticatedUser } from "../types";

export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) throw ApiError.unauthorized("Missing or invalid authorization header");
    const token = authHeader.split(" ")[1];
    if (!token) throw ApiError.unauthorized("Token not provided");
    const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
    if (decoded.iss !== config.jwt.issuer) throw ApiError.unauthorized("Invalid token issuer");
    req.user = { id: decoded.sub, email: decoded.email, role: decoded.role, status: decoded.status, sessionId: decoded.sessionId };
    next();
  } catch (error: any) {
    if (error instanceof ApiError) return next(error);
    if (error.name === "TokenExpiredError") return next(ApiError.unauthorized("Token expired"));
    if (error.name === "JsonWebTokenError") return next(ApiError.unauthorized("Invalid token"));
    next(ApiError.unauthorized("Authentication failed"));
  }
}

export function optionalAuth(req: Request, _res: Response, next: NextFunction): void {
  try {
    const authHeader = req.headers.authorization;
    if (!authHeader?.startsWith("Bearer ")) return next();
    const token = authHeader.split(" ")[1];
    if (!token) return next();
    const decoded = jwt.verify(token, config.jwt.accessSecret) as any;
    req.user = { id: decoded.sub, email: decoded.email, role: decoded.role, status: decoded.status, sessionId: decoded.sessionId };
  } catch { }
  next();
}

export function authorize(...allowedRoles: UserRole[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(ApiError.unauthorized("Authentication required"));
    if (req.user.status !== "active") return next(ApiError.forbidden(`Account ${req.user.status}`));
    if (!allowedRoles.includes(req.user.role)) return next(ApiError.forbidden(`Role not authorized`));
    next();
  };
}

export function authorizeOwner(getOwnerId: (req: Request) => string | undefined) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) return next(ApiError.unauthorized("Authentication required"));
    if ([UserRole.ADMIN, UserRole.SUPER_ADMIN].includes(req.user.role)) return next();
    const ownerId = getOwnerId(req);
    if (ownerId && ownerId !== req.user.id) return next(ApiError.forbidden("You can only access your own resources"));
    next();
  };
}
