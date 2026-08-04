import mongoose, { Schema, Document } from "mongoose";
import { WalletTransactionType } from "../types";

export interface IWallet extends Document {
  userId: mongoose.Types.ObjectId; balance: number; currency: string; isActive: boolean;
  transactions: { transactionId: string; type: WalletTransactionType; amount: number; balanceBefore: number; balanceAfter: number; description: string; reference?: string; status: string; createdAt: Date }[];
}

const walletSchema = new Schema<IWallet>({
  userId: { type: Schema.Types.ObjectId, ref: "User", required: true, unique: true },
  balance: { type: Number, default: 0, min: 0 },
  currency: { type: String, default: "INR" },
  isActive: { type: Boolean, default: true },
  transactions: [{ transactionId: String, type: { type: String, enum: Object.values(WalletTransactionType) }, amount: Number, balanceBefore: Number, balanceAfter: Number, description: String, reference: String, status: { type: String, default: "success" }, createdAt: { type: Date, default: Date.now } }],
}, { timestamps: true });

export const Wallet = mongoose.model<IWallet>("Wallet", walletSchema);