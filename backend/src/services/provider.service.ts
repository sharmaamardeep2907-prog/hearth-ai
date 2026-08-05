import { IProvider } from "../interfaces";
import { Provider } from "../models/provider.model";
import { Review } from "../models/review.model";
class ProviderService {
  async list(filters: any) {
    const query: any = { status: "active" };
    if (filters.category) query.profession = filters.category;
    if (filters.city) query.city = { $regex: filters.city, $options: "i" };
    if (filters.minRating) query.rating = { $gte: filters.minRating };
    if (filters.verified) query.verified = true;
    const page = filters.page || 1, limit = filters.limit || 10;
    const [providers, total] = await Promise.all([Provider.find(query).select("name profession title rating reviewCount location city services verified featured avatar").skip((page-1)*limit).limit(limit).sort({ rating: -1 }), Provider.countDocuments(query)]);
    return { data: providers.map(p => ({ id: p._id, name: p.name, profession: p.profession, title: p.title, rating: p.rating, reviewCount: p.reviewCount, location: p.location, city: p.city, minPrice: p.services?.length ? Math.min(...p.services.map(s => s.price)) : 0, verified: p.verified, featured: p.featured, avatar: p.avatar })), meta: { page, limit, total, totalPages: Math.ceil(total/limit) } };
  }
  async getById(providerId: string) { const p = await Provider.findById(providerId); if (!p) throw { status: 404, message: "Provider not found" }; return p; }
  async register(userId: string, payload: any) { const existing = await Provider.findOne({ userId }); if (existing) throw { status: 409, message: "Profile exists" }; return Provider.create({ userId, ...payload, status: "pending", rating: 0, reviewCount: 0, totalJobs: 0, verified: false }); }
  async updateProfile(providerId: string, userId: string, updates: any) { const p = await Provider.findOneAndUpdate({ _id: providerId, userId }, { $set: updates }, { new: true }); if (!p) throw { status: 404, message: "Not found" }; return p; }
  async getMyProfile(userId: string) { const p = await Provider.findOne({ userId }); if (!p) throw { status: 404, message: "No profile" }; return p; }
  async getMyJobs(providerId: string, status?: string) { const { Booking } = require("../models/booking.model"); const q: any = { providerId }; if (status) q.status = status; return Booking.find(q).sort({ createdAt: -1 }); }
  async getEarnings(providerId: string) { const { Booking } = require("../models/booking.model"); const bk = await Booking.find({ providerId, status: "completed" }); const total = bk.reduce((s,b) => s + (b.providerEarnings||0), 0); const monthly: any = {}; bk.forEach(b => { const m = b.createdAt.toISOString().slice(0,7); monthly[m] = (monthly[m]||0) + (b.providerEarnings||0); }); return { totalEarnings: total, monthly }; }
  async getCalendar(providerId: string, month?: string) { const { Booking } = require("../models/booking.model"); const s = month ? new Date(month+"-01") : new Date(); const e = new Date(s); e.setMonth(e.getMonth()+1); return Booking.find({ providerId, date: { $gte: s.toISOString().slice(0,10), $lt: e.toISOString().slice(0,10) }, status: { $in: ["confirmed","in_progress"] } }).select("date time serviceName customerId"); }
  async verify(providerId: string, verified: boolean) { return Provider.findByIdAndUpdate(providerId, { $set: { verified } }, { new: true }); }
}
export const providerService = new ProviderService();
