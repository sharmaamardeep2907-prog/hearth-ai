import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";
import { authenticate } from "../middleware/auth";
import { authLimiter } from "../middleware/rateLimiter";

const router = Router();
router.post("/register", authLimiter, AuthController.register);
router.post("/login", authLimiter, AuthController.login);
router.post("/refresh", AuthController.refreshTokens);
router.post("/forgot-password", authLimiter, AuthController.forgotPassword);
router.get("/google", AuthController.googleAuth);
router.get("/google/callback", AuthController.googleCallback);
router.use(authenticate);
router.get("/me", AuthController.getProfile);
router.put("/profile", AuthController.updateProfile);
router.post("/change-password", AuthController.changePassword);
router.post("/logout", AuthController.logout);
router.post("/logout-all", AuthController.logoutAll);
export default router;