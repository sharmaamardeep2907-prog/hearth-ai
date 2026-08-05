import { Router, Request, Response, NextFunction } from "express";
import { Provider } from "../models/provider.model";
import { sendSuccess } from "../utils/response";
class CategoryService {
  async list() {
    const cats = await Provider.distinct("profession", { status: "active" });
    const withCounts = await Promise.all(cats.map(async c => {
      const count = await Provider.countDocuments({ profession: c, status: "active" });
      return { slug: c.toLowerCase().replace(/\s+/g,"-"), name: c, count };
    }));
    return withCounts;
  }
  async getProviders(slug: string, query: any) {
    const profession = slug.replace(/-/g," ");
    const filters: any = { status: "active", profession: new RegExp(profession, "i") };
    const page = Number(query.page) || 1, limit = Number(query.limit) || 12;
    const [providers, total] = await Promise.all([
      Provider.find(filters).select("name title rating reviewCount location city verified featured services").skip((page-1)*limit).limit(limit).sort({ rating: -1 }),
      Provider.countDocuments(filters)
    ]);
    return { data: providers, meta: { page, limit, total, totalPages: Math.ceil(total/limit) } };
  }
}
const cs = new CategoryService();
const router = Router();
router.get("/", async (req,res,next) => { try { sendSuccess(res, await cs.list(), "Categories fetched"); } catch(e) { next(e); } });
router.get("/:slug", async (req,res,next) => { try { const r = await cs.getProviders(req.params.slug, req.query); sendSuccess(res, r.data, "Providers fetched", 200, r.meta); } catch(e) { next(e); } });
export default router;
