import { Notification, INotification } from "../models/notification.model";
import { NotificationChannel } from "../types";
import { appEvents, Events } from "../events";

export class NotificationService {
  static async send(data: { recipientId: string; type: string; title: string; body: string; data?: any; channels?: NotificationChannel[]; actionUrl?: string }) {
    const channels = data.channels || [NotificationChannel.IN_APP];
    const notification = new Notification({ ...data, channels, status: { inApp: "unread" } });
    await notification.save();
    appEvents.emitEvent(Events.NOTIFICATION_CREATED, { notificationId: notification._id });
    return notification;
  }

  static async getUserNotifications(userId: string, opts: { isRead?: boolean; page?: number; limit?: number } = {}) {
    const { isRead, page = 1, limit = 20 } = opts;
    const q: any = { recipientId: userId }; if (isRead !== undefined) q.isRead = isRead;
    const [notifications, total, unread] = await Promise.all([Notification.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit), Notification.countDocuments(q), Notification.countDocuments({ recipientId: userId, isRead: false })]);
    return { notifications, total, unreadCount: unread };
  }
  static async markAsRead(ids: string[], userId: string) { await Notification.updateMany({ _id: { $in: ids }, recipientId: userId }, { $set: { isRead: true, readAt: new Date(), "status.inApp": "read" } }); }
  static async markAllAsRead(userId: string) { await Notification.updateMany({ recipientId: userId, isRead: false }, { $set: { isRead: true, readAt: new Date(), "status.inApp": "read" } }); }
  static async dismiss(id: string, userId: string) { await Notification.findOneAndUpdate({ _id: id, recipientId: userId }, { $set: { isRead: true, "status.inApp": "dismissed" } }); }
}

appEvents.on(Events.BOOKING_CREATED, async (d: any) => { try { await NotificationService.send({ recipientId: d.providerId, type: "new_booking", title: "New Booking", body: "You have a new booking request.", channels: [NotificationChannel.IN_APP] }); } catch {} });