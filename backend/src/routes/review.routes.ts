import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { authenticate, optionalAuth } from "../middleware/auth";

const router = Router();
router.get("/provider/:providerId", optionalAuth, ReviewController.getProviderReviews);
router.use(authenticate);
router.post("/", ReviewController.create);
router.post("/:id/reply", ReviewController.reply);
router.post("/:id/helpful", ReviewController.markHelpful);
export default router;