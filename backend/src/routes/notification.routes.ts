import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { NotificationService } from "../services/notification.service";
import { ApiResponseBuilder } from "../utils/response";

const router = Router();
router.use(authenticate);
router.get("/", async (req, res, n) => { try { const { isRead, page, limit } = req.query; const r = await NotificationService.getUserNotifications(req.user!.id, { isRead: isRead !== undefined ? isRead === "true" : undefined, page: page ? +page : 1, limit: limit ? +limit : 20 }); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } });
router.post("/mark-read", async (req, res, n) => { try { await NotificationService.markAsRead(req.body.ids, req.user!.id); ApiResponseBuilder.success(res, null); } catch (e) { n(e); } });
router.post("/mark-all-read", async (req, res, n) => { try { await NotificationService.markAllAsRead(req.user!.id); ApiResponseBuilder.success(res, null); } catch (e) { n(e); } });
router.delete("/:id", async (req, res, n) => { try { await NotificationService.dismiss(req.params.id, req.user!.id); ApiResponseBuilder.success(res, null); } catch (e) { n(e); } });
export default router;