import mongoose, { Schema, Document } from "mongoose";
import { NotificationChannel } from "../types";

export interface INotification extends Document {
  recipientId: mongoose.Types.ObjectId; type: string; title: string; body: string;
  data?: Record<string,unknown>; channels: NotificationChannel[];
  status: { email?: string; push?: string; inApp: string };
  isRead: boolean; readAt?: Date; actionUrl?: string; createdAt: Date;
}

const notificationSchema = new Schema<INotification>({
  recipientId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  type: { type: String, required: true },
  title: { type: String, required: true },
  body: { type: String, required: true },
  data: { type: Schema.Types.Mixed },
  channels: [{ type: String, enum: Object.values(NotificationChannel) }],
  status: { email: { type: String, default: "pending" }, push: { type: String, default: "pending" }, inApp: { type: String, enum: ["unread","read","dismissed"], default: "unread" } },
  isRead: { type: Boolean, default: false },
  readAt: Date,
  actionUrl: String,
}, { timestamps: true });

notificationSchema.index({ recipientId: 1, isRead: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>("Notification", notificationSchema);