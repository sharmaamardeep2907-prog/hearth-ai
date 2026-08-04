import EventEmitter from "events";
import { logger } from "../utils/logger";

class AppEventEmitter extends EventEmitter {
  private static instance: AppEventEmitter;
  private constructor() { super(); this.setMaxListeners(50); }
  static getInstance() { if (!AppEventEmitter.instance) AppEventEmitter.instance = new AppEventEmitter(); return AppEventEmitter.instance; }
  emitEvent(event: string, data: unknown) { this.emit(event, data); }
}

export const appEvents = AppEventEmitter.getInstance();

export const Events = {
  USER_REGISTERED: "user:registered", USER_LOGGED_IN: "user:logged_in", USER_LOGGED_OUT: "user:logged_out", ACCOUNT_LOCKED: "user:account_locked",
  BOOKING_CREATED: "booking:created", BOOKING_CONFIRMED: "booking:confirmed", BOOKING_STARTED: "booking:started", BOOKING_COMPLETED: "booking:completed", BOOKING_CANCELLED: "booking:cancelled", BOOKING_RESCHEDULED: "booking:rescheduled",
  PAYMENT_SUCCESS: "payment:success", PAYMENT_FAILED: "payment:failed", REFUND_PROCESSED: "payment:refunded",
  WALLET_CREDITED: "wallet:credited", WALLET_DEBITED: "wallet:debited",
  REVIEW_CREATED: "review:created",
  NOTIFICATION_CREATED: "notification:created",
};