import express from "express";
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
import { connectDatabase, disconnectDatabase } from "./config/database";
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

class App {
  public app: express.Application;
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
    this.app.use(cors({ origin: config.security.corsOrigin, credentials: true, methods: ["GET","POST","PUT","PATCH","DELETE","OPTIONS"] }));
    this.app.use(compression());
    this.app.use(express.json({ limit: "16mb" }));
    this.app.use(express.urlencoded({ extended: true, limit: "16mb" }));
    this.app.use(cookieParser());
    this.app.use(requestContext);
    if (config.server.isDev) this.app.use(morgan("dev"));
    this.app.use(mongoSanitize());
    this.app.use(hppProtection);
    this.app.use(sanitizeRequest);
    this.app.use("/api/", globalLimiter);
    const uploadsDir = path.resolve(config.upload.path);
    if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
  }
  private configureRoutes(): void {
    this.app.use("/health", healthRoutes);
    this.app.use("/api/v1/auth", authRoutes);
    this.app.use("/api/v1/ai", aiRoutes);
    this.app.use("/api/v1/bookings", bookingRoutes);
    this.app.use("/api/v1/reviews", reviewRoutes);
    this.app.use("/api/v1/wallet", walletRoutes);
    this.app.use("/api/v1/notifications", notificationRoutes);
    this.app.get("/", (_req, res) => { res.json({ name: "Hearth AI API", version: "1.0.0", environment: config.server.nodeEnv, health: "/health" }); });
  }
  private configureErrorHandling(): void { this.app.use(notFoundHandler); this.app.use(errorHandler); }
  private configureProcessHandlers(): void {
    process.on("uncaughtException", (error) => { logger.error("UNCAUGHT EXCEPTION", { error: error.message }); process.exit(1); });
    process.on("unhandledRejection", (reason: any) => { logger.error("UNHANDLED REJECTION", { error: reason?.message }); });
    const shutdown = async (sig: string) => { logger.info(`${sig} — shutting down`); this.server.close(async () => { await disconnectDatabase(); process.exit(0); }); };
    process.on("SIGTERM", () => shutdown("SIGTERM"));
    process.on("SIGINT", () => shutdown("SIGINT"));
  }
  public async start(): Promise<void> {
    const env = validateEnvironment();
    if (!env.valid) { logger.error("Env validation failed"); process.exit(1); }
    await connectDatabase();
    if (config.features.socketEnabled) initSocketIO(this.server);
    initCronJobs();
    this.server.listen(config.server.port, () => { logger.info(`🔥 Hearth AI API on port ${config.server.port}`); });
  }
}
new App().start();
export default App;