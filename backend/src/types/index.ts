import { Request } from "express";

export interface AuthenticatedUser {
  id: string;
  email: string;
  role: UserRole;
  status: string;
  sessionId: string;
}

export enum UserRole {
  GUEST = "guest",
  CUSTOMER = "customer",
  PROVIDER = "provider",
  ADMIN = "admin",
  SUPER_ADMIN = "super_admin",
}

export enum AuthProvider {
  LOCAL = "local",
  GOOGLE = "google",
}

export enum BookingStatus {
  PENDING = "pending",
  ACCEPTED = "accepted",
  ASSIGNED = "assigned",
  ON_THE_WAY = "on_the_way",
  STARTED = "started",
  COMPLETED = "completed",
  CANCELLED = "cancelled",
}

export enum PaymentStatus {
  PENDING = "pending",
  PAID = "paid",
  REFUNDED = "refunded",
  FAILED = "failed",
}

export enum BookingType {
  SCHEDULED = "scheduled",
  INSTANT = "instant",
  EMERGENCY = "emergency",
}

export enum WalletTransactionType {
  CREDIT = "credit",
  DEBIT = "debit",
}

export enum NotificationChannel {
  EMAIL = "email",
  PUSH = "push",
  SMS = "sms",
  IN_APP = "in_app",
}

export interface AuthRequest extends Request {
  user?: AuthenticatedUser;
  requestId?: string;
  correlationId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthenticatedUser;
      requestId?: string;
      correlationId?: string;
    }
  }
}
