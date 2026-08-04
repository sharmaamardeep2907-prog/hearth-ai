import { Wallet } from "../models/wallet.model";
import { ApiError } from "../utils/errors";
import { WalletTransactionType } from "../types";
import { v4 as uuidv4 } from "uuid";
import { appEvents, Events } from "../events";

export class WalletService {
  static async getOrCreate(userId: string) {
    let wallet = await Wallet.findOne({ userId });
    if (!wallet) { wallet = new Wallet({ userId }); await wallet.save(); }
    return wallet;
  }

  static async credit(userId: string, amount: number, type: WalletTransactionType, description: string, reference?: string) {
    if (amount <= 0) throw ApiError.badRequest("Amount must be positive");
    const wallet = await this.getOrCreate(userId);
    const tx = { transactionId: `TXN-${uuidv4().slice(0,8).toUpperCase()}`, type, amount, balanceBefore: wallet.balance, balanceAfter: wallet.balance + amount, description, reference, status: "success", createdAt: new Date() };
    wallet.balance += amount; wallet.transactions.push(tx as any); await wallet.save();
    appEvents.emitEvent(Events.WALLET_CREDITED, { userId, amount, type });
    return { wallet, transaction: tx };
  }

  static async debit(userId: string, amount: number, type: WalletTransactionType, description: string, reference?: string) {
    if (amount <= 0) throw ApiError.badRequest("Amount must be positive");
    const wallet = await this.getOrCreate(userId);
    if (wallet.balance < amount) throw ApiError.badRequest("Insufficient balance");
    const tx = { transactionId: `TXN-${uuidv4().slice(0,8).toUpperCase()}`, type, amount, balanceBefore: wallet.balance, balanceAfter: wallet.balance - amount, description, reference, status: "success", createdAt: new Date() };
    wallet.balance -= amount; wallet.transactions.push(tx as any); await wallet.save();
    appEvents.emitEvent(Events.WALLET_DEBITED, { userId, amount, type });
    return { wallet, transaction: tx };
  }

  static async getBalance(userId: string) { const w = await Wallet.findOne({ userId }); return w?.balance || 0; }
  static async getTransactions(userId: string, page = 1, limit = 20) {
    const wallet = await Wallet.findOne({ userId });
    if (!wallet) return { transactions: [], balance: 0, total: 0 };
    const txs = wallet.transactions.sort((a,b) => b.createdAt.getTime() - a.createdAt.getTime()).slice((page-1)*limit, page*limit);
    return { transactions: txs, balance: wallet.balance, total: wallet.transactions.length };
  }
  static async withdraw(userId: string, amount: number) {
    if (amount < 100) throw ApiError.badRequest("Minimum withdrawal ₹100");
    return this.debit(userId, amount, WalletTransactionType.WITHDRAWAL, "Withdrawal");
  }
}