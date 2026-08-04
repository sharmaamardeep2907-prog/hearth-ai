import { Router } from "express";
import { AIController } from "../controllers/ai.controller";
import { authenticate, optionalAuth } from "../middleware/auth";
import { aiLimiter } from "../middleware/rateLimiter";

const router = Router();
router.use(aiLimiter);
router.post("/chat", optionalAuth, AIController.chat);
router.post("/smart-search", optionalAuth, AIController.smartSearch);
router.post("/estimate-price", optionalAuth, AIController.estimatePrice);
router.use(authenticate);
router.post("/booking-assistant", AIController.bookingAssistant);
router.post("/diagnose-image", AIController.diagnoseImage);
router.post("/summarize-reviews", AIController.summarizeReviews);
export default router;