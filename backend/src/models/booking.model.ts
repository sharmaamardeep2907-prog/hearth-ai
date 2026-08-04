import mongoose, { Schema, Document } from "mongoose";
import { BookingStatus, PaymentStatus, BookingType } from "../types";

export interface IBooking extends Document {
  bookingId: string; customerId: mongoose.Types.ObjectId; providerId: mongoose.Types.ObjectId;
  service: { name: string; category: string; price: number; priceType: string; duration: number };
  type: BookingType; status: BookingStatus; paymentStatus: PaymentStatus;
  address: { street: string; city: string; state: string; pincode: string; coordinates: { lat: number; lng: number } };
  scheduled: { date: Date; startTime: string; endTime?: string };
  pricing: { subtotal: number; discount: number; tax: number; platformFee: number; total: number; currency: string };
  payment: { method: string; razorpayOrderId?: string; razorpayPaymentId?: string; paidAt?: Date; refundId?: string; refundAmount?: number; refundReason?: string };
  timeline: { status: string; timestamp: Date; note?: string }[];
  notes?: string;
  cancellation?: { reason: string; cancelledBy: string; cancelledAt: Date; refundEligible: boolean };
  reschedule?: { previousDate: Date; previousTime: string; newDate: Date; newTime: string; reason: string; rescheduledAt: Date }[];
  recurrence?: { pattern: string; interval: number; parentBookingId?: string };
  emergencyDetails?: { isEmergency: boolean; urgencyLevel?: string };
  tracking: { providerLocation?: { lat: number; lng: number }; startedAt?: Date; completedAt?: Date; statusHistory: { status: string; timestamp: Date }[] };
  review?: { rating: number; comment: string; createdAt: Date };
  aiSummary?: string;
  isDeleted: boolean; createdAt: Date; updatedAt: Date;
}

const bookingSchema = new Schema<IBooking>({
  bookingId: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: "User", required: true, index: true },
  providerId: { type: Schema.Types.ObjectId, ref: "Provider", required: true, index: true },
  service: { name: String, category: String, price: Number, priceType: String, duration: Number },
  type: { type: String, enum: Object.values(BookingType), default: BookingType.SCHEDULED },
  status: { type: String, enum: Object.values(BookingStatus), default: BookingStatus.PENDING, index: true },
  paymentStatus: { type: String, enum: Object.values(PaymentStatus), default: PaymentStatus.PENDING },
  address: { street: String, city: String, state: String, pincode: String, coordinates: { lat: Number, lng: Number } },
  scheduled: { date: { type: Date, required: true }, startTime: { type: String, required: true }, endTime: String },
  pricing: { subtotal: Number, discount: { type: Number, default: 0 }, tax: { type: Number, default: 0 }, platformFee: { type: Number, default: 0 }, total: Number, currency: { type: String, default: "INR" } },
  payment: { method: String, razorpayOrderId: String, razorpayPaymentId: String, paidAt: Date, refundId: String, refundAmount: Number, refundReason: String },
  timeline: [{ status: String, timestamp: { type: Date, default: Date.now }, note: String }],
  notes: String,
  cancellation: { reason: String, cancelledBy: String, cancelledAt: Date, refundEligible: Boolean },
  reschedule: [{ previousDate: Date, previousTime: String, newDate: Date, newTime: String, reason: String, rescheduledAt: Date }],
  recurrence: { pattern: String, interval: Number, parentBookingId: String },
  emergencyDetails: { isEmergency: { type: Boolean, default: false }, urgencyLevel: String },
  tracking: { providerLocation: { lat: Number, lng: Number }, startedAt: Date, completedAt: Date, statusHistory: [{ status: String, timestamp: Date }] },
  review: { rating: Number, comment: String, createdAt: Date },
  aiSummary: String,
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true });

bookingSchema.index({ customerId: 1, status: 1 });
bookingSchema.index({ providerId: 1, status: 1 });
bookingSchema.index({ "scheduled.date": 1, status: 1 });

export const Booking = mongoose.model<IBooking>("Booking", bookingSchema);