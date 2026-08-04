import { ApiError } from "../utils/errors";

describe("ApiError", () => {
  it("badRequest", () => { const e = ApiError.badRequest("Bad"); expect(e.statusCode).toBe(400); expect(e.errorCode).toBe("BAD_REQUEST"); });
  it("unauthorized", () => { expect(ApiError.unauthorized().statusCode).toBe(401); });
  it("notFound", () => { expect(ApiError.notFound().statusCode).toBe(404); });
  it("validation details", () => { const e = ApiError.validation([{ field: "email", message: "Invalid" }]); expect(e.details).toBeDefined(); });
  it("internal is non-operational", () => { expect(ApiError.internal().isOperational).toBe(false); });
});