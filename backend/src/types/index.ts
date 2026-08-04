export enum UserRole { GUEST = "guest", CUSTOMER = "customer", PROVIDER = "provider", ADMIN = "admin", SUPER_ADMIN = "super_admin" }
export enum BookingStatus { PENDING = "pending", ACCEPTED = "accepted", ASSIGNED = "assigned", ON_THE_WAY = "on_the_way", STARTED = "started", PAUSED = "paused", COMPLETED = "completed", CANCELLED = "cancelled", REFUNDED = "refunded", EXPIRED = "expired" }
export enum PaymentStatus { PENDING = "pending", PAID = "paid", FAILED = "failed", REFUNDED = "refunded" }
export enum BookingType { INSTANT = "instant", SCHEDULED = "scheduled", EMERGENCY = "emergency", PACKAGE = "package", RECURRING = "recurring", GROUP = "group" }
export enum NotificationChannel { PUSH = "push", EMAIL = "email", SMS = "sms", WHATSAPP = "whatsapp", IN_APP = "in_app" }
export enum AuthProvider { LOCAL = "local", GOOGLE = "google" }
export enum WalletTransactionType { CREDIT = "credit", DEBIT = "debit", CASHBACK = "cashback", REFERRAL = "referral", REWARD = "reward", RECHARGE = "recharge", WITHDRAWAL = "withdrawal" }

export interface AuthenticatedUser { id: string; email: string; role: UserRole; status: string; sessionId: string; }
export interface AuthRequest extends Request { user?: AuthenticatedUser; requestId?: string; correlationId?: string; }

declare global { namespace Express { interface Request { user?: AuthenticatedUser; requestId?: string; correlationId?: string; } } }