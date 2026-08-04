import { Response } from "express";
import { v4 as uuidv4 } from "uuid";
import { AuthRequest } from "../types";

interface ApiResponse<T> { success: boolean; statusCode: number; message: string; requestId: string; timestamp: string; data?: T; metadata?: Record<string, unknown>; }
interface PaginationMeta { page: number; limit: number; total: number; totalPages: number; hasNext: boolean; hasPrev: boolean; }
interface PaginatedData<T> { items: T[]; pagination: PaginationMeta; }

export class ApiResponseBuilder {
  private static build<T>(res: Response, statusCode: number, message: string, data?: T, metadata?: Record<string, unknown>): void {
    const requestId = (res.req as AuthRequest)?.requestId || uuidv4();
    const response: ApiResponse<T> = { success: statusCode >= 200 && statusCode < 300, statusCode, message, requestId, timestamp: new Date().toISOString() };
    if (data !== undefined) response.data = data;
    if (metadata) response.metadata = metadata;
    res.status(statusCode).json(response);
  }
  static success<T>(res: Response, data?: T, message = "Success", statusCode = 200) { this.build(res, statusCode, message, data); }
  static created<T>(res: Response, data?: T, message = "Created") { this.build(res, 201, message, data); }
  static paginated<T>(res: Response, items: T[], total: number, page: number, limit: number, message = "Success") {
    const totalPages = Math.ceil(total / limit);
    this.build(res, 200, message, { items, pagination: { page, limit, total, totalPages, hasNext: page < totalPages, hasPrev: page > 1 } });
  }
}