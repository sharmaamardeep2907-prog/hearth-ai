import mongoose from "mongoose";
import { MongoMemoryServer } from "mongodb-memory-server";
import { WalletService } from "../services/wallet.service";
import { WalletTransactionType } from "../types";

let mongod: MongoMemoryServer;

beforeAll(async () => { mongod = await MongoMemoryServer.create(); await mongoose.connect(mongod.getUri()); });
afterAll(async () => { await mongoose.disconnect(); await mongod.stop(); });
beforeEach(async () => { for (const key in mongoose.connection.collections) await mongoose.connection.collections[key].deleteMany({}); });

describe("Wallet Service", () => {
  const userId = new mongoose.Types.ObjectId().toString();

  it("should create wallet", async () => { const w = await WalletService.getOrCreate(userId); expect(w.balance).toBe(0); });
  it("should credit", async () => { const { wallet } = await WalletService.credit(userId, 500, WalletTransactionType.CASHBACK, "Test"); expect(wallet.balance).toBe(500); });
  it("should debit", async () => { await WalletService.credit(userId, 1000, WalletTransactionType.RECHARGE, "Fund"); const { wallet } = await WalletService.debit(userId, 300, WalletTransactionType.WITHDRAWAL, "Take"); expect(wallet.balance).toBe(700); });
  it("should reject insufficient balance", async () => { await expect(WalletService.debit(userId, 500, WalletTransactionType.WITHDRAWAL, "Over")).rejects.toThrow("Insufficient"); });
  it("should reject negative amounts", async () => { await expect(WalletService.credit(userId, -100, WalletTransactionType.CASHBACK, "Bad")).rejects.toThrow("positive"); });
});