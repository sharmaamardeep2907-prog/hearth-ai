import mongoose, { Schema, Document } from "mongoose";
import { UserRole, AuthProvider } from "../types";
import bcrypt from "bcryptjs";
import { config } from "../config";

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: UserRole;
  status: "active" | "inactive" | "suspended" | "deleted";
  provider: AuthProvider;
  googleId?: string;
  emailVerified: boolean;
  phoneVerified: boolean;
  refreshTokens: string[];
  lastLogin?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, select: false },
  firstName: { type: String, required: true, trim: true },
  lastName: { type: String, required: true, trim: true },
  phone: { type: String },
  avatar: { type: String },
  role: { type: String, enum: Object.values(UserRole), default: UserRole.CUSTOMER },
  status: { type: String, enum: ["active","inactive","suspended","deleted"], default: "active" },
  provider: { type: String, enum: Object.values(AuthProvider), default: AuthProvider.LOCAL },
  googleId: { type: String },
  emailVerified: { type: Boolean, default: false },
  phoneVerified: { type: Boolean, default: false },
  refreshTokens: [{ type: String }],
  lastLogin: { type: Date },
}, { timestamps: true });

userSchema.index({ email: 1 });
userSchema.index({ role: 1, status: 1 });

export const User = mongoose.model<IUser>("User", userSchema);
