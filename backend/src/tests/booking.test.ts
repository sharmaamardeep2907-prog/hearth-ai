import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { BookingService } from "../services/booking.service";
import { Provider } from "../models/provider.model";
import { BookingStatus } from "../types";

let mongod: MongoMemoryServer;

beforeAll(async () => { mongod = await MongoMemoryServer.create(); await mongoose.connect(mongod.getUri()); });
afterAll(async () => { await mongoose.disconnect(); await mongod.stop(); });
beforeEach(async () => { for (const key in mongoose.connection.collections) await mongoose.connection.collections[key].deleteMany({}); });

describe("Booking Service", () => {
  let customerId: string;
  let providerId: string;

  beforeEach(async () => {
    customerId = new mongoose.Types.ObjectId().toString();
    const p = await Provider.create({
      userId: new mongoose.Types.ObjectId(), businessName: "Test Pro", slug: "test-pro-" + Date.now(),
      category: "Electrician", isVerified: true, isActive: true,
      addresses: [{ label: "Shop", street: "T", city: "Mumbai", state: "MH", pincode: "400001", coordinates: { lat: 19, lng: 72 }, isDefault: true }],
    });
    providerId = (p._id as mongoose.Types.ObjectId).toString();
  });

  it("should create a booking", async () => {
    const b = await BookingService.create({
      customerId, providerId,
      service: { name: "Test", category: "Electrician", price: 500, priceType: "fixed", duration: 60 },
      scheduled: { date: new Date(), startTime: "10:00" },
      address: { street: "T", city: "M", state: "MH", pincode: "400001", coordinates: { lat: 19, lng: 72 } },
      pricing: { subtotal: 500, total: 500 },
    });
    expect(b.bookingId).toMatch(/^HTH-/);
    expect(b.status).toBe(BookingStatus.PENDING);
  });

  it("should reject inactive provider", async () => {
    await Provider.findByIdAndUpdate(providerId, { isActive: false });
    await expect(BookingService.create({
      customerId, providerId,
      service: { name: "T", category: "E", price: 500, priceType: "fixed", duration: 60 },
      scheduled: { date: new Date(), startTime: "10:00" },
      address: { street: "T", city: "M", state: "MH", pincode: "400001", coordinates: { lat: 19, lng: 72 } },
      pricing: { subtotal: 500, total: 500 },
    })).rejects.toThrow("not available");
  });

  it("should cancel a booking", async () => {
    const b = await BookingService.create({
      customerId, providerId,
      service: { name: "T", category: "E", price: 500, priceType: "fixed", duration: 60 },
      scheduled: { date: new Date(), startTime: "10:00" },
      address: { street: "T", city: "M", state: "MH", pincode: "400001", coordinates: { lat: 19, lng: 72 } },
      pricing: { subtotal: 500, total: 500 },
    });
    const c = await BookingService.cancel((b._id as mongoose.Types.ObjectId).toString(), "customer", "Changed mind");
    expect(c.status).toBe(BookingStatus.CANCELLED);
  });
});