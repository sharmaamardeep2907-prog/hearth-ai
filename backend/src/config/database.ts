import mongoose from "mongoose";
import { config } from "./index";
import { logger } from "../utils/logger";

export async function connectDatabase(): Promise<void> {
  try {
    mongoose.set("strictQuery", true);
    mongoose.connection.on("connected", () => logger.info("MongoDB connected"));
    mongoose.connection.on("error", (err) => logger.error("MongoDB error", { error: err.message }));
    mongoose.connection.on("disconnected", () => logger.warn("MongoDB disconnected"));
    const uri = config.mongodb.uri;
    await mongoose.connect(uri, config.mongodb.options as any);
  } catch (error: any) {
    logger.error("Failed to connect to MongoDB", { error: error.message });
    process.exit(1);
  }
}

export async function disconnectDatabase(): Promise<void> {
  await mongoose.disconnect();
}
