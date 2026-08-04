import { Request, Response, NextFunction } from "express";
import { AIService } from "../services/ai.service";
import { ApiResponseBuilder } from "../utils/response";
import { ApiError } from "../utils/errors";

export class AIController {
  static async chat(req: Request, res: Response, n: NextFunction) { try { if (!req.body.messages?.length) throw ApiError.badRequest(); const r = await AIService.chat(req.body.messages, req.body.context); ApiResponseBuilder.success(res, { response: r }); } catch (e) { n(e); } }
  static async bookingAssistant(req: Request, res: Response, n: NextFunction) { try { if (!req.body.query) throw ApiError.badRequest(); const r = await AIService.bookingAssistant(req.body.query); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } }
  static async diagnoseImage(req: Request, res: Response, n: NextFunction) { try { if (!req.body.imageBase64) throw ApiError.badRequest(); const r = await AIService.imageDiagnosis(req.body.imageBase64, req.body.mimeType); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } }
  static async summarizeReviews(req: Request, res: Response, n: NextFunction) { try { if (!req.body.reviews?.length) throw ApiError.badRequest(); const r = await AIService.summarizeReviews(req.body.reviews); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } }
  static async smartSearch(req: Request, res: Response, n: NextFunction) { try { if (!req.body.query) throw ApiError.badRequest(); const r = await AIService.smartSearch(req.body.query); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } }
  static async estimatePrice(req: Request, res: Response, n: NextFunction) { try { if (!req.body.category || !req.body.description) throw ApiError.badRequest(); const r = await AIService.estimatePrice(req.body.category, req.body.description); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } }
}