import express, { Application } from "express";
import http from "http";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import mongoSanitize from "express-mongo-sanitize";
import path from "path";
import fs from "fs";

import { config } from "./config";
import { connectDatabase } from "./config/database";
import { validateEnvironment } from "./config/validate";
import { logger } from "./utils/logger";
import { errorHandler, notFoundHandler, requestContext } from "./middleware/error";
import { globalLimiter } from "./middleware/rateLimiter";
import { hppProtection, sanitizeRequest } from "./middleware/security";
import { initSocketIO } from "./socket";
import { initCronJobs } from "./cron";

import healthRoutes from "./routes/health.routes";
import authRoutes from "./routes/auth.routes";
import aiRoutes from "./routes/ai.routes";
import bookingRoutes from "./routes/booking.routes";
import reviewRoutes from "./routes/review.routes";
import walletRoutes from "./routes/wallet.routes";
import notificationRoutes from "./routes/notification.routes";
import providerRoutes from "./routes/provider.routes";
import categoryRoutes from "./routes/category.routes";
import searchRoutes from "./routes/search.routes";
import adminRoutes from "./routes/admin.routes";
import uploadRoutes from "./routes/upload.routes";

class App {
  public app: Application;
  public server: http.Server;

  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.configureMiddleware();
    this.configureRoutes();
    this.configureErrorHandling();
    this.configureProcessHandlers();
  }

  private configureMiddleware(): void {
    this.app.use(helmet());
    this.app.use(cors({ origin: config.security.corsOrigin, credentials: true }));
    this.app.use(compression());
    this.app.use(express.json({ limit: "16mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "16mb" }));
    this.app.use(cookieParser());
    this.app.use(requestContext);
    if (config.server.isDev) this.app.use(morgan("dev"));
    else this.app.use(morgan("combined", { stream: { write: (msg: string) => logger.info(msg.trim()) } }));
    this.app.use(mongoSanitize());
    this.app.use(hppProtection);
    this.app.use(sanitizeRequest);
    this.app.use("/api/", globalLimiter);
    const uploadsDir = path.resolve(config.upload.path);
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    this.app.use("/uploads", express.static(uploadsDir));
  }

  private configureRoutes(): void {
    this.app.use("/health", healthRoutes);
    this.app.use("/api/v1/auth", authRoutes);
    this.app.use("/api/v1/ai", aiRoutes);
    this.app.use("/api/v1/bookings", bookingRoutes);
    this.app.use("/api/v1/reviews", reviewRoutes);
    this.app.use("/api/v1/wallet", walletRoutes);
    this.app.use("/api/v1/notifications", notificationRoutes);
    this.app.use("/api/v1/providers", providerRoutes);
    this.app.use("/api/v1/categories", categoryRoutes);
    this.app.use("/api/v1/search", searchRoutes);
    this.app.use("/api/v1/admin", adminRoutes);
    this.app.use("/api/v1/upload", uploadRoutes);
    this.app.get("/api/v1/socket/status", (req, res) => { const { SocketController } = require("./controllers/socket.controller"); SocketController.getStatus(req, res); });
    this.app.get("/", (_req, res) => { res.json({ name: "Hearth AI API", version: "1.0.0", environment: config.server.nodeEnv }); });
  }

  private configureErrorHandling(): void {
    this.app.use(notFoundHandler);
    this.app.use(errorHandler);
  }

  private configureProcessHandlers(): void {
    process.on("unhandledRejection", (reason) => { logger.error("Unhandled Rejection", { reason }); });
    process.on("uncaughtException", (err) => { logger.error("Uncaught Exception", { error: err.message, stack: err.stack }); process.exit(1); });
    process.on("SIGTERM", async () => { logger.info("SIGTERM received — shutting down"); process.exit(0); });
    process.on("SIGINT", async () => { logger.info("SIGINT received"); process.exit(0); });
  }

  async start(): Promise<void> {
    await connectDatabase();
    validateEnvironment();
    initSocketIO(this.server);
    initCronJobs();
    this.server.listen(config.server.port, () => { logger.info(`🚀 Hearth AI API running on port ${config.server.port}`); });
  }
}

const app = new App();
app.start();
export default app;
