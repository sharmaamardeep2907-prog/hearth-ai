import { registerSchema, createBookingSchema, createReviewSchema, walletWithdrawSchema } from "../validators";

describe("Validators", () => {
  it("should validate register", () => { expect(() => registerSchema.parse({ email: "t@h.ai", password: "Test@1234", firstName: "A", lastName: "B" })).not.toThrow(); });
  it("should reject weak password", () => { expect(() => registerSchema.parse({ email: "t@h.ai", password: "short", firstName: "A", lastName: "B" })).toThrow(); });
  it("should validate booking", () => { expect(() => createBookingSchema.parse({ providerId: "abc", service: { name: "T", category: "E", price: 500 }, scheduled: { date: "2026-01-01", startTime: "10:00" }, address: { street: "S", city: "C", state: "S", pincode: "P" }, pricing: { subtotal: 500, total: 500 } })).not.toThrow(); });
  it("should validate review", () => { expect(() => createReviewSchema.parse({ bookingId: "abc", rating: 5, comment: "Great service!" })).not.toThrow(); });
  it("should reject rating >5", () => { expect(() => createReviewSchema.parse({ bookingId: "abc", rating: 6, comment: "Invalid" })).toThrow(); });
  it("should validate withdrawal", () => { expect(() => walletWithdrawSchema.parse({ amount: 500 })).not.toThrow(); });
  it("should reject amount <100", () => { expect(() => walletWithdrawSchema.parse({ amount: 50 })).toThrow(); });
});