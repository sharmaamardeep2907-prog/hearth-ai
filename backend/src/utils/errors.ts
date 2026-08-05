import { v4 as uuidv4 } from "uuid";
import { logger } from "./logger";

export class ApiError extends Error {
  public readonly statusCode: number;
  public readonly isOperational: boolean;
  public readonly errorCode: string;
  public readonly requestId: string;
  public readonly correlationId: string;
  public readonly details?: unknown;

  constructor(statusCode: number, message: string, options?: { errorCode?: string; isOperational?: boolean; details?: unknown }) {
    super(message);
    Object.setPrototypeOf(this, ApiError.prototype);
    this.statusCode = statusCode;
    this.isOperational = options?.isOperational ?? true;
    this.errorCode = options?.errorCode ?? `ERR_${statusCode}`;
    this.requestId = uuidv4();
    this.correlationId = uuidv4();
    this.details = options?.details;
  }

  log(): void { const lvl = this.statusCode >= 500 ? "error" : "warn"; logger[lvl](this.message, { statusCode: this.statusCode, errorCode: this.errorCode, requestId: this.requestId }); }

  static badRequest(msg = "Bad request") { return new ApiError(400, msg); }
  static unauthorized(msg = "Unauthorized") { return new ApiError(401, msg); }
  static forbidden(msg = "Forbidden") { return new ApiError(403, msg); }
  static notFound(msg = "Resource not found") { return new ApiError(404, msg); }
  static conflict(msg = "Conflict") { return new ApiError(409, msg); }
  static validation(msg = "Validation error") { return new ApiError(422, msg); }
  static tooMany(msg = "Too many requests") { return new ApiError(429, msg); }
  static internal(msg = "Internal server error") { return new ApiError(500, msg, { isOperational: false }); }
}
