import { v4 as uuidv4 } from "uuid";
import { logger } from "./logger";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode: string;
  public readonly requestId: string;
  public readonly correlationId: string;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, options?: { errorCode?: string; isOperational?: boolean; requestId?: string; correlationId?: string; details?: unknown }) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.errorCode = options?.errorCode ?? `ERR_${statusCode}`;
    this.requestId = options?.requestId ?? uuidv4();
    this.correlationId = options?.correlationId ?? uuidv4();
    this.details = options?.details;
  }

  static badRequest(msg = "Bad Request", code?: string) { return new ApiError(400, msg, { errorCode: code || "BAD_REQUEST" }); }
  static unauthorized(msg = "Unauthorized") { return new ApiError(401, msg, { errorCode: "UNAUTHORIZED" }); }
  static forbidden(msg = "Forbidden") { return new ApiError(403, msg, { errorCode: "FORBIDDEN" }); }
  static notFound(msg = "Not found") { return new ApiError(404, msg, { errorCode: "NOT_FOUND" }); }
  static conflict(msg = "Conflict") { return new ApiError(409, msg, { errorCode: "CONFLICT" }); }
  static validation(details: unknown) { return new ApiError(422, "Validation Error", { errorCode: "VALIDATION_ERROR", details }); }
  static tooMany(msg = "Too many requests") { return new ApiError(429, msg, { errorCode: "RATE_LIMIT" }); }
  static internal(msg = "Internal Server Error") { return new ApiError(500, msg, { errorCode: "INTERNAL_ERROR", isOperational: false }); }
  static serviceUnavailable(service: string) { return new ApiError(503, `${service} unavailable`, { errorCode: "SERVICE_UNAVAILABLE" }); }

  log(): void {
    if (this.statusCode >= 500) logger.error(this.message, { errorCode: this.errorCode, stack: this.stack });
    else logger.warn(this.message, { errorCode: this.errorCode });
  }
}