import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { AuthService } from "../services/auth.service";
import { UserRole } from "../types";

let mongod: MongoMemoryServer;

beforeAll(async () => { mongod = await MongoMemoryServer.create(); await mongoose.connect(mongod.getUri()); });
afterAll(async () => { await mongoose.disconnect(); await mongod.stop(); });
beforeEach(async () => { for (const key in mongoose.connection.collections) await mongoose.connection.collections[key].deleteMany({}); });

describe("Auth Service", () => {
  describe("register", () => {
    it("should register a new user", async () => {
      const r = await AuthService.register({ email: "test@hearth.ai", password: "Test@1234", firstName: "Test", lastName: "User" });
      expect(r.user.email).toBe("test@hearth.ai");
      expect(r.user.role).toBe(UserRole.CUSTOMER);
      expect(r.tokens.accessToken).toBeDefined();
    });

    it("should reject duplicate email", async () => {
      await AuthService.register({ email: "dupe@hearth.ai", password: "Test@1234", firstName: "A", lastName: "B" });
      await expect(AuthService.register({ email: "dupe@hearth.ai", password: "Test@1234", firstName: "C", lastName: "D" })).rejects.toThrow("already registered");
    });
  });

  describe("login", () => {
    it("should login with valid credentials", async () => {
      await AuthService.register({ email: "login@hearth.ai", password: "Test@1234", firstName: "L", lastName: "U" });
      const { tokens } = await AuthService.login("login@hearth.ai", "Test@1234");
      expect(tokens.accessToken).toBeDefined();
    });

    it("should reject invalid password", async () => {
      await AuthService.register({ email: "wrong@hearth.ai", password: "Test@1234", firstName: "W", lastName: "P" });
      await expect(AuthService.login("wrong@hearth.ai", "WrongPass1")).rejects.toThrow();
    });
  });

  describe("refresh", () => {
    it("should refresh tokens and rotate", async () => {
      const { tokens } = await AuthService.register({ email: "rot@hearth.ai", password: "Test@1234", firstName: "R", lastName: "T" });
      const r = await AuthService.refreshTokens(tokens.refreshToken);
      expect(r.tokens.refreshToken).not.toBe(tokens.refreshToken);
    });

    it("should detect token reuse", async () => {
      const { tokens } = await AuthService.register({ email: "reuse@hearth.ai", password: "Test@1234", firstName: "R", lastName: "U" });
      await AuthService.refreshTokens(tokens.refreshToken);
      await expect(AuthService.refreshTokens(tokens.refreshToken)).rejects.toThrow("compromised");
    });
  });

  describe("account lockout", () => {
    it("should lock after 5 failed attempts", async () => {
      await AuthService.register({ email: "lock@hearth.ai", password: "Test@1234", firstName: "L", lastName: "T" });
      for (let i = 0; i < 5; i++) { try { await AuthService.login("lock@hearth.ai", "wrong"); } catch {} }
      await expect(AuthService.login("lock@hearth.ai", "Test@1234")).rejects.toThrow("locked");
    });
  });
});