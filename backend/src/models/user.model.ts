import mongoose, { Schema, Document } from "mongoose";
import { UserRole, AuthProvider } from "../types";
import bcrypt from "bcryptjs";
import { config } from "../config";

export interface IUser extends Document {
  email: string; password?: string; firstName: string; lastName: string; phone?: string; avatar?: string;
  role: UserRole; status: "active" | "inactive" | "suspended" | "deleted";
  provider: AuthProvider; googleId?: string; emailVerified: boolean; phoneVerified: boolean;
  twoFactorEnabled: boolean; lastLogin?: Date; loginAttempts: number; lockedUntil?: Date;
  passwordChangedAt?: Date; passwordHistory: string[]; refreshTokens: string[];
  activeSessions: string[]; loginHistory: { ip: string; device: string; timestamp: Date; successful: boolean }[];
  preferences: { language: string; timezone: string; notifications: { email: boolean; push: boolean; sms: boolean } };
  isDeleted: boolean; createdAt: Date; updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
  isPasswordUsedBefore(password: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
  password: { type: String, minlength: 8, select: false },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String, trim: true, sparse: true },
  avatar: { type: String },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
  status: { type: String, enum: ["active","inactive","suspended","deleted"], default: "active" },
  provider: { type: String, enum: Object.values(AuthProvider), default: AuthProvider.LOCAL },
  googleId: { type: String, sparse: true },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  twoFactorEnabled: { type: Boolean, default: false },
  lastLogin: { type: Date },
  loginAttempts: { type: Number, default: 0 },
  lockedUntil: { type: Date },
  passwordChangedAt: { type: Date },
  passwordHistory: { type: [String], default: [], select: false },
  refreshTokens: { type: [String], default: [], select: false },
  activeSessions: { type: [String], default: [], select: false },
  loginHistory: [{ ip: String, device: String, timestamp: { type: Date, default: Date.now }, successful: { type: Boolean, default: true } }],
  preferences: { language: { type: String, default: "en" }, timezone: { type: String, default: "Asia/Kolkata" }, notifications: { email: { type: Boolean, default: true }, push: { type: Boolean, default: true }, sms: { type: Boolean, default: false } } },
  isDeleted: { type: Boolean, default: false },
}, { timestamps: true, toJSON: { transform(_doc, ret) { delete ret.password; delete ret.refreshTokens; delete ret.passwordHistory; delete ret.__v; return ret; } } });

userSchema.pre("save", async function(next) { if (!this.isModified("password") || !this.password) return next(); this.password = await bcrypt.hash(this.password, config.security.bcryptRounds); if (this.passwordHistory.length >= 5) this.passwordHistory.shift(); this.passwordHistory.push(this.password); this.passwordChangedAt = new Date(); next(); });
userSchema.methods.comparePassword = async function(candidate: string) { if (!this.password) return false; return bcrypt.compare(candidate, this.password); };
userSchema.methods.isPasswordUsedBefore = async function(candidate: string) { for (const old of this.passwordHistory) if (await bcrypt.compare(candidate, old)) return true; return false; };

export const User = mongoose.model<IUser>("User", userSchema);