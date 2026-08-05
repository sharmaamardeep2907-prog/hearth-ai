import { Router, Request, Response, NextFunction } from "express";
import { authenticate, authorize } from "../middleware/auth";
import { User } from "../models/user.model";
import { Provider } from "../models/provider.model";
import { Booking } from "../models/booking.model";
import { ApiResponseBuilder } from "../utils/response";
class AdminService {
  async getStats() {
    const [totalUsers, totalProviders, totalBookings, bookings] = await Promise.all([
      User.countDocuments(), Provider.countDocuments(), Booking.countDocuments(),
      Booking.find({ status: "completed" }).select("amount platformFee createdAt")
    ]);
    const totalRevenue = bookings.reduce((s,b) => s + (b.platformFee||0), 0);
    const monthly: Record<string,number> = {};
    bookings.forEach(b => { const m = b.createdAt.toISOString().slice(0,7); monthly[m] = (monthly[m]||0) + (b.platformFee||0); });
    return { totalUsers, totalProviders, totalBookings, totalRevenue, monthlyRevenue: monthly };
  }
  async listUsers(query: any) {
    const page=Number(query.page)||1, limit=Number(query.limit)||20;
    const [users, total] = await Promise.all([
      User.find().select("-password").skip((page-1)*limit).limit(limit).sort({ createdAt: -1 }),
      User.countDocuments()
    ]);
    return { data: users, meta: { page, limit, total } };
  }
}
const adminSvc = new AdminService();
const router = Router();
router.use(authenticate, authorize("admin"));
router.get("/stats", async (req,res,next) => { try { ApiResponseBuilder.success(res, await adminSvc.getStats(), "Admin stats"); } catch(e) { next(e); } });
router.get("/users", async (req,res,next) => { try { ApiResponseBuilder.success(res, await adminSvc.listUsers(req.query)); } catch(e) { next(e); } });
router.get("/providers", async (req,res,next) => { try { const page=Number(req.query.page)||1, limit=Number(req.query.limit)||20; const [providers,total]=await Promise.all([Provider.find().skip((page-1)*limit).limit(limit).sort({createdAt:-1}),Provider.countDocuments()]); ApiResponseBuilder.success(res, {data:providers,meta:{page,limit,total}}); } catch(e) { next(e); } });
router.get("/bookings", async (req,res,next) => { try { const page=Number(req.query.page)||1, limit=Number(req.query.limit)||20, filter:any={}; if(req.query.status) filter.status=req.query.status; const [bookings,total]=await Promise.all([Booking.find(filter).skip((page-1)*limit).limit(limit).sort({createdAt:-1}),Booking.countDocuments(filter)]); ApiResponseBuilder.success(res, {data:bookings,meta:{page,limit,total}}); } catch(e) { next(e); } });
export default router;
