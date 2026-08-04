import mongoose from "mongoose";
import { config } from "./index";
import { logger } from "../utils/logger";

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    logger.info("✅ MongoDB connected");
  } catch (error: any) {
    logger.error("❌ MongoDB connection failed", { error: error.message });
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> { await mongoose.disconnect(); }
export async function checkDatabaseHealth(): Promise<boolean> { return mongoose.connection.readyState === 1; }