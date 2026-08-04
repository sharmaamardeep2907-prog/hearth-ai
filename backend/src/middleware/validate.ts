import { Request, Response, NextFunction } from "express";
import { ZodSchema } from "zod";
import { ApiError } from "../utils/errors";

export function validate(schema: ZodSchema, source: "body"|"query"|"params" = "body") {
  return (req: Request, _res: Response, next: NextFunction) => {
    try { req[source] = schema.parse(req[source]); next(); }
    catch (error: any) { if (error.errors) { next(ApiError.validation(error.errors.map((e: any) => ({ field: e.path.join("."), message: e.message })))); } else next(error); }
  };
}