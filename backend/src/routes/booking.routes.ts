import { Router } from "express";
import { BookingController } from "../controllers/booking.controller";
import { authenticate, authorize } from "../middleware/auth";
import { UserRole } from "../types";

const router = Router();
router.use(authenticate);
router.post("/", authorize(UserRole.CUSTOMER), BookingController.create);
router.get("/customer/me", authorize(UserRole.CUSTOMER), BookingController.getMyBookings);
router.get("/provider/:id", BookingController.getProviderBookings);
router.get("/:id", BookingController.getById);
router.patch("/:id/status", BookingController.updateStatus);
router.post("/:id/cancel", BookingController.cancel);
router.post("/:id/reschedule", authorize(UserRole.CUSTOMER), BookingController.reschedule);
export default router;