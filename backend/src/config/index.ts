import dotenv from "dotenv";
dotenv.config();

export const config = {
  server: { port: parseInt(process.env.PORT || "5000", 10), host: process.env.HOST || "0.0.0.0", nodeEnv: process.env.NODE_ENV || "development", isDev: (process.env.NODE_ENV || "development") === "development", isProd: process.env.NODE_ENV === "production" },
  mongodb: { uri: process.env.MONGODB_URI || "mongodb://localhost:27017/hearth-ai", options: { maxPoolSize: 20, minPoolSize: 5, connectTimeoutMS: 10000, socketTimeoutMS: 45000, serverSelectionTimeoutMS: 5000, retryWrites: true } },
  jwt: { accessSecret: process.env.JWT_ACCESS_SECRET || "dev", refreshSecret: process.env.JWT_REFRESH_SECRET || "dev", accessExpiry: process.env.JWT_ACCESS_EXPIRY || "15m", refreshExpiry: process.env.JWT_REFRESH_EXPIRY || "7d", issuer: process.env.JWT_ISSUER || "hearth-ai" },
  google: { clientId: process.env.GOOGLE_CLIENT_ID || "", clientSecret: process.env.GOOGLE_CLIENT_SECRET || "", callbackUrl: process.env.GOOGLE_CALLBACK_URL || "" },
  gemini: { apiKey: process.env.GEMINI_API_KEY || "", model: process.env.GEMINI_MODEL || "gemini-2.0-flash", visionModel: process.env.GEMINI_VISION_MODEL || "gemini-2.0-flash", maxTokens: parseInt(process.env.GEMINI_MAX_TOKENS || "4096", 10), temperature: parseFloat(process.env.GEMINI_TEMPERATURE || "0.7") },
  razorpay: { keyId: process.env.RAZORPAY_KEY_ID || "", keySecret: process.env.RAZORPAY_KEY_SECRET || "", webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET || "" },
  cloudinary: { cloudName: process.env.CLOUDINARY_CLOUD_NAME || "", apiKey: process.env.CLOUDINARY_API_KEY || "", apiSecret: process.env.CLOUDINARY_API_SECRET || "" },
  smtp: { host: process.env.SMTP_HOST || "", port: parseInt(process.env.SMTP_PORT || "587", 10), secure: false, user: process.env.SMTP_USER || "", pass: process.env.SMTP_PASS || "", from: process.env.EMAIL_FROM || "Hearth AI <noreply@hearth.ai>" },
  rateLimit: { windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || "900000", 10), max: parseInt(process.env.RATE_LIMIT_MAX || "100", 10) },
  security: { bcryptRounds: parseInt(process.env.BCRYPT_ROUNDS || "12", 10), corsOrigin: process.env.CORS_ORIGIN || "http://localhost:3000" },
  upload: { maxFileSize: parseInt(process.env.MAX_FILE_SIZE || "10485760", 10), path: process.env.UPLOAD_PATH || "./uploads" },
  logging: { level: process.env.LOG_LEVEL || "info", dir: process.env.LOG_DIR || "./logs" },
  features: { aiEnabled: process.env.AI_ENABLED !== "false", mapsEnabled: process.env.MAPS_ENABLED !== "false", paymentsEnabled: process.env.PAYMENTS_ENABLED !== "false", notificationsEnabled: process.env.NOTIFICATIONS_ENABLED !== "false", socketEnabled: process.env.SOCKET_ENABLED !== "false" },
};