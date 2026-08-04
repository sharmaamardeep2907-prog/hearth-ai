import { Booking, IBooking } from "../models/booking.model";
import { Provider } from "../models/provider.model";
import { ApiError } from "../utils/errors";
import { BookingStatus, BookingType } from "../types";
import { appEvents, Events } from "../events";
import { v4 as uuidv4 } from "uuid";

export class BookingService {
  private static validTransitions: Record<BookingStatus, BookingStatus[]> = {
    [BookingStatus.PENDING]: [BookingStatus.ACCEPTED, BookingStatus.CANCELLED, BookingStatus.EXPIRED],
    [BookingStatus.ACCEPTED]: [BookingStatus.ASSIGNED, BookingStatus.CANCELLED],
    [BookingStatus.ASSIGNED]: [BookingStatus.ON_THE_WAY, BookingStatus.CANCELLED],
    [BookingStatus.ON_THE_WAY]: [BookingStatus.STARTED, BookingStatus.CANCELLED],
    [BookingStatus.STARTED]: [BookingStatus.PAUSED, BookingStatus.COMPLETED, BookingStatus.CANCELLED],
    [BookingStatus.PAUSED]: [BookingStatus.STARTED, BookingStatus.CANCELLED],
    [BookingStatus.COMPLETED]: [BookingStatus.REFUNDED],
    [BookingStatus.CANCELLED]: [BookingStatus.REFUNDED],
    [BookingStatus.REFUNDED]: [],
    [BookingStatus.EXPIRED]: [],
  };

  static async create(data: { customerId: string; providerId: string; service: any; scheduled: any; address: any; type?: BookingType; notes?: string; pricing: any }): Promise<IBooking> {
    const provider = await Provider.findById(data.providerId);
    if (!provider || !provider.isActive || !provider.isVerified) throw ApiError.badRequest("Provider not available");
    const booking = new Booking({ bookingId: `HTH-${Date.now().toString(36).toUpperCase()}-${uuidv4().slice(0,4).toUpperCase()}`, ...data, status: BookingStatus.PENDING, timeline: [{ status: BookingStatus.PENDING, timestamp: new Date() }] });
    await booking.save();
    appEvents.emitEvent(Events.BOOKING_CREATED, { bookingId: booking._id, customerId: data.customerId, providerId: data.providerId });
    return booking;
  }

  static async getById(id: string) { return Booking.findById(id).where({ isDeleted: false }); }

  static async getCustomerBookings(customerId: string, opts: { status?: BookingStatus; page?: number; limit?: number } = {}) {
    const { status, page = 1, limit = 20 } = opts;
    const q: any = { customerId, isDeleted: false }; if (status) q.status = status;
    const [bookings, total] = await Promise.all([Booking.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit), Booking.countDocuments(q)]);
    return { bookings, total, page, limit };
  }

  static async getProviderBookings(providerId: string, opts: { status?: BookingStatus; page?: number; limit?: number } = {}) {
    const { status, page = 1, limit = 20 } = opts;
    const q: any = { providerId, isDeleted: false }; if (status) q.status = status;
    const [bookings, total] = await Promise.all([Booking.find(q).sort({ "scheduled.date": 1 }).skip((page-1)*limit).limit(limit), Booking.countDocuments(q)]);
    return { bookings, total, page, limit };
  }

  static async updateStatus(id: string, newStatus: BookingStatus, actorId: string, actorType: string, note?: string) {
    const booking = await Booking.findById(id);
    if (!booking || booking.isDeleted) throw ApiError.notFound("Booking not found");
    if (!this.validTransitions[booking.status].includes(newStatus)) throw ApiError.badRequest(`Cannot transition from ${booking.status} to ${newStatus}`);
    booking.status = newStatus;
    booking.timeline.push({ status: newStatus, timestamp: new Date(), note });
    if (newStatus === BookingStatus.STARTED) booking.tracking.startedAt = new Date();
    if (newStatus === BookingStatus.COMPLETED) booking.tracking.completedAt = new Date();
    await booking.save();
    const events: any = { [BookingStatus.COMPLETED]: Events.BOOKING_COMPLETED, [BookingStatus.CANCELLED]: Events.BOOKING_CANCELLED };
    if (events[newStatus]) appEvents.emitEvent(events[newStatus], { bookingId: booking._id });
    return booking;
  }

  static async cancel(id: string, cancelledBy: string, reason: string) {
    const booking = await Booking.findById(id);
    if (!booking || booking.isDeleted) throw ApiError.notFound();
    if ([BookingStatus.COMPLETED, BookingStatus.CANCELLED, BookingStatus.REFUNDED].includes(booking.status)) throw ApiError.badRequest("Cannot cancel");
    booking.status = BookingStatus.CANCELLED;
    booking.cancellation = { reason, cancelledBy, cancelledAt: new Date(), refundEligible: [BookingStatus.PENDING, BookingStatus.ACCEPTED].includes(booking.status as BookingStatus) };
    booking.timeline.push({ status: BookingStatus.CANCELLED, timestamp: new Date(), note: reason });
    await booking.save();
    appEvents.emitEvent(Events.BOOKING_CANCELLED, { bookingId: booking._id });
    return booking;
  }

  static async reschedule(id: string, newDate: Date, newTime: string, reason: string) {
    const booking = await Booking.findById(id);
    if (!booking || booking.isDeleted) throw ApiError.notFound();
    booking.reschedule = [...(booking.reschedule||[]), { previousDate: booking.scheduled.date, previousTime: booking.scheduled.startTime, newDate, newTime, reason, rescheduledAt: new Date() }];
    booking.scheduled.date = newDate; booking.scheduled.startTime = newTime;
    await booking.save();
    appEvents.emitEvent(Events.BOOKING_RESCHEDULED, { bookingId: booking._id });
    return booking;
  }

  static async getAllBookings(filters: any = {}) {
    const { status, page = 1, limit = 50 } = filters;
    const q: any = { isDeleted: false }; if (status) q.status = status;
    const [bookings, total] = await Promise.all([Booking.find(q).sort({ createdAt: -1 }).skip((page-1)*limit).limit(limit), Booking.countDocuments(q)]);
    return { bookings, total, page, limit };
  }
}