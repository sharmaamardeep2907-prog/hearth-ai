import { Router, Request, Response, NextFunction } from "express";
import { Provider } from "../models/provider.model";
import { sendSuccess } from "../utils/response";
const router = Router();
router.get("/", async (req,res,next) => {
  try {
    const { q, category, city, minRating, verified, page=1, limit=10 } = req.query;
    const filters: any = { status: "active" };
    if (category) filters.profession = { $regex: category, $options: "i" };
    if (city) filters.city = { $regex: city, $options: "i" };
    if (minRating) filters.rating = { $gte: Number(minRating) };
    if (verified==="true") filters.verified = true;
    if (q) filters.$or = [{ name: { $regex: q, $options: "i" } }, { profession: { $regex: q, $options: "i" } }, { skills: { $regex: q, $options: "i" } }];
    const p=Number(page), l=Number(limit);
    const [providers, total] = await Promise.all([
      Provider.find(filters).select("name profession title rating reviewCount location city verified featured services").skip((p-1)*l).limit(l).sort({rating:-1}),
      Provider.countDocuments(filters)
    ]);
    const data = providers.map(p=>({id:p._id,name:p.name,category:p.profession,rating:p.rating,reviews:p.reviewCount,price:Math.min(...(p.services||[]).map(s=>s.price))||0,city:p.city,verified:p.verified,featured:p.featured}));
    sendSuccess(res, data, `Found ${total} results`, 200, { page:p, limit:l, total, totalPages: Math.ceil(total/l) });
  } catch(e) { next(e); }
});
export default router;
