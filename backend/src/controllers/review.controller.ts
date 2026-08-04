import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { Review } from "../models/review.model";
import { Provider } from "../models/provider.model";
import { Booking } from "../models/booking.model";
import { AIService } from "../services/ai.service";
import { ApiResponseBuilder } from "../utils/response";
import { ApiError } from "../utils/errors";
import { AuthRequest } from "../types";

export class ReviewController {
  static async create(req: Request, res: Response, n: NextFunction) {
    try {
      const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized();
      const { bookingId, rating, title, comment, images } = req.body;
      const booking = await Booking.findById(bookingId);
      if (!booking) throw ApiError.notFound();
      if (booking.status !== "completed") throw ApiError.badRequest();
      if (booking.customerId.toString() !== u.id) throw ApiError.forbidden();
      if (await Review.findOne({ bookingId })) throw ApiError.conflict();
      const review = new Review({ bookingId, customerId: u.id, providerId: booking.providerId, rating, title, comment, images });
      await review.save();
      const reviews = await Review.find({ providerId: booking.providerId, status: "published" });
      const avg = reviews.reduce((s,r) => s + r.rating, 0) / reviews.length;
      await Provider.findByIdAndUpdate(booking.providerId, { $set: { "ratings.average": Math.round(avg*10)/10, "ratings.count": reviews.length } });
      AIService.summarizeReviews(reviews.map(r=>({rating:r.rating,comment:r.comment}))).catch(()=>{});
      ApiResponseBuilder.created(res, { review });
    } catch (e) { n(e); }
  }
  static async getProviderReviews(req: Request, res: Response, n: NextFunction) {
    try {
      const { page=1, limit=20 } = req.query;
      const q: any = { providerId: req.params.providerId, status: "published", isDeleted: false };
      const [reviews, total] = await Promise.all([Review.find(q).sort({createdAt:-1}).skip((+page-1)*+limit).limit(+limit).populate("customerId","firstName lastName avatar"), Review.countDocuments(q)]);
      ApiResponseBuilder.paginated(res, reviews, total, +page, +limit);
    } catch (e) { n(e); }
  }
  static async reply(req: Request, res: Response, n: NextFunction) {
    try { const r = await Review.findById(req.params.id); if (!r) throw ApiError.notFound(); r.providerReply = { comment: req.body.comment, repliedAt: new Date() }; await r.save(); ApiResponseBuilder.success(res, { review: r }); } catch (e) { n(e); }
  }
  static async markHelpful(req: Request, res: Response, n: NextFunction) {
    try {
      const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized();
      const r = await Review.findById(req.params.id); if (!r) throw ApiError.notFound();
      if (r.helpfulVotes.voters.some(v=>v.toString()===u.id)) throw ApiError.badRequest("Already voted");
      r.helpfulVotes.count++; r.helpfulVotes.voters.push(u.id as mongoose.Types.ObjectId);
      await r.save();
      ApiResponseBuilder.success(res, { helpfulCount: r.helpfulVotes.count });
    } catch (e) { n(e); }
  }
}