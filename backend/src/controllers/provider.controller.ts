import { Request, Response, NextFunction } from "express";
import { providerService } from "../services/provider.service";
import { ApiResponseBuilder } from "../utils/response";
import { ApiError } from "../utils/errors";
import { AuthRequest } from "../types";
import { providerJoinDTO, updateProviderDTO } from "../dto";
class ProviderController {
  async list(req: Request, res: Response, next: NextFunction) { try { const r = await providerService.list(req.query); ApiResponseBuilder.paginated(res, r.data, r.meta.total, r.meta.page, r.meta.limit, "Providers fetched"); } catch(e) { next(e); } }
  async getById(req: Request, res: Response, next: NextFunction) { try { ApiResponseBuilder.success(res, await providerService.getById(req.params.id), "Provider details"); } catch(e) { next(e); } }
  async register(req: Request, res: Response, next: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const payload = providerJoinDTO.parse(req.body); ApiResponseBuilder.created(res, await providerService.register(u.id, payload), "Registration submitted"); } catch(e) { next(e); } }
  async getMyProfile(req: Request, res: Response, next: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); ApiResponseBuilder.success(res, await providerService.getMyProfile(u.id), "Profile fetched"); } catch(e) { next(e); } }
  async updateProfile(req: Request, res: Response, next: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const updates = updateProviderDTO.parse(req.body); ApiResponseBuilder.success(res, await providerService.updateProfile(req.params.id, u.id, updates), "Profile updated"); } catch(e) { next(e); } }
  async getMyJobs(req: Request, res: Response, next: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const p = await providerService.getMyProfile(u.id); ApiResponseBuilder.success(res, await providerService.getMyJobs(p._id as string, req.query.status as string), "Jobs fetched"); } catch(e) { next(e); } }
  async getMyEarnings(req: Request, res: Response, next: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const p = await providerService.getMyProfile(u.id); ApiResponseBuilder.success(res, await providerService.getEarnings(p._id as string), "Earnings fetched"); } catch(e) { next(e); } }
  async getCalendar(req: Request, res: Response, next: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const p = await providerService.getMyProfile(u.id); ApiResponseBuilder.success(res, await providerService.getCalendar(p._id as string, req.query.month as string), "Calendar fetched"); } catch(e) { next(e); } }
  async verify(req: Request, res: Response, next: NextFunction) { try { const { verified } = req.body; ApiResponseBuilder.success(res, await providerService.verify(req.params.id, verified), `Provider ${verified?"verified":"unverified"}`); } catch(e) { next(e); } }
}
export const providerController = new ProviderController();
