import { Request, Response, NextFunction } from "express";
import { BookingService } from "../services/booking.service";
import { ApiResponseBuilder } from "../utils/response";
import { ApiError } from "../utils/errors";
import { BookingStatus, AuthRequest } from "../types";

export class BookingController {
  static async create(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const b = await BookingService.create({ customerId: u.id, ...req.body }); ApiResponseBuilder.created(res, { booking: b }); } catch (e) { n(e); } }
  static async getById(req: Request, res: Response, n: NextFunction) { try { const b = await BookingService.getById(req.params.id); if (!b) throw ApiError.notFound(); ApiResponseBuilder.success(res, { booking: b }); } catch (e) { n(e); } }
  static async getMyBookings(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const { status, page, limit } = req.query; const r = await BookingService.getCustomerBookings(u.id, { status: status as BookingStatus, page: +page! || 1, limit: +limit! || 20 }); ApiResponseBuilder.paginated(res, r.bookings, r.total, r.page, r.limit); } catch (e) { n(e); } }
  static async getProviderBookings(req: Request, res: Response, n: NextFunction) { try { const { status, page, limit } = req.query; const r = await BookingService.getProviderBookings(req.params.id, { status: status as BookingStatus, page: +page! || 1, limit: +limit! || 20 }); ApiResponseBuilder.paginated(res, r.bookings, r.total, r.page, r.limit); } catch (e) { n(e); } }
  static async updateStatus(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const b = await BookingService.updateStatus(req.params.id, req.body.status, u.id, u.role, req.body.note); ApiResponseBuilder.success(res, { booking: b }); } catch (e) { n(e); } }
  static async cancel(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const b = await BookingService.cancel(req.params.id, u.role, req.body.reason); ApiResponseBuilder.success(res, { booking: b }); } catch (e) { n(e); } }
  static async reschedule(req: Request, res: Response, n: NextFunction) { try { const b = await BookingService.reschedule(req.params.id, new Date(req.body.newDate), req.body.newTime, req.body.reason); ApiResponseBuilder.success(res, { booking: b }); } catch (e) { n(e); } }
}