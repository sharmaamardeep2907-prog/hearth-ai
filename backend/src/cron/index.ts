import cron from "node-cron";
import { logger } from "../utils/logger";
import { Booking } from "../models/booking.model";
import { BookingStatus } from "../types";

export function initCronJobs(): void {
  logger.info("Initializing cron jobs...");
  cron.schedule("* * * * *", async () => {
    try {
      const r = await Booking.updateMany({ status: BookingStatus.PENDING, createdAt: { $lt: new Date(Date.now() - 86400000) } }, { $set: { status: BookingStatus.EXPIRED }, $push: { timeline: { status: BookingStatus.EXPIRED, timestamp: new Date(), note: "Auto-expired" } } });
      if (r.modifiedCount > 0) logger.info(`Expired ${r.modifiedCount} bookings`);
    } catch (e: any) {}
  });
  cron.schedule("0 3 * * *", async () => {
    try {
      const { Notification } = require("../models/notification.model");
      await Notification.deleteMany({ createdAt: { $lt: new Date(Date.now() - 7776000000) }, isRead: true });
    } catch (e: any) {}
  });
  logger.info("Cron jobs initialized");
}