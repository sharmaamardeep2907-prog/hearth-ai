import jwt from "jsonwebtoken";
import crypto from "crypto";
import { config } from "../config";
import { ApiError } from "../utils/errors";
import { User, IUser } from "../models/user.model";
import { UserRole, AuthProvider } from "../types";
import { authLogger } from "../utils/logger";
import { appEvents, Events } from "../events";

export class AuthService {
  static generateAccessToken(user: IUser, sessionId: string): string {
    const signOptions: jwt.SignOptions = { expiresIn: config.jwt.accessExpiry, issuer: config.jwt.issuer, jwtid: crypto.randomUUID() };
    return jwt.sign({ sub: user._id.toString(), email: user.email, role: user.role, status: user.status, sessionId }, config.jwt.accessSecret, signOptions);
  }
  static generateRefreshToken(user: IUser, sessionId: string): string {
    const signOptions: jwt.SignOptions = { expiresIn: config.jwt.refreshExpiry, issuer: config.jwt.issuer, jwtid: crypto.randomUUID() };
    return jwt.sign({ sub: user._id.toString(), sessionId, type: "refresh" }, config.jwt.refreshSecret, signOptions);
  }
  static verifyRefreshToken(token: string): { sub: string; sessionId: string } {
    try { const d = jwt.verify(token, config.jwt.refreshSecret) as any; if (d.type !== "refresh") throw ApiError.unauthorized(); return { sub: d.sub, sessionId: d.sessionId }; }
    catch (e: any) { if (e instanceof ApiError) throw e; throw ApiError.unauthorized("Invalid refresh token"); }
  }
  static generateTokenPair(user: IUser) { const sessionId = crypto.randomUUID(); return { accessToken: this.generateAccessToken(user, sessionId), refreshToken: this.generateRefreshToken(user, sessionId), sessionId }; }

  static async register(data: { email: string; password: string; firstName: string; lastName: string; phone?: string }) {
    if (await User.findOne({ email: data.email.toLowerCase() })) throw ApiError.conflict("Email already registered");
    const user = new User({ email: data.email, password: data.password, firstName: data.firstName, lastName: data.lastName, phone: data.phone, role: UserRole.CUSTOMER, provider: AuthProvider.LOCAL });
    await user.save();
    const tokens = this.generateTokenPair(user);
    user.refreshTokens.push(tokens.refreshToken); user.activeSessions.push(tokens.sessionId); user.lastLogin = new Date(); await user.save();
    appEvents.emitEvent(Events.USER_REGISTERED, { userId: user._id });
    return { user, tokens };
  }

  static async login(email: string, password: string, ip?: string, device?: string) {
    const user = await User.findOne({ email: email.toLowerCase(), isDeleted: false }).select("+password +refreshTokens +activeSessions");
    if (!user) throw ApiError.unauthorized("Invalid email or password");
    if (user.lockedUntil && user.lockedUntil > new Date()) throw ApiError.unauthorized("Account locked");
    if (user.status !== "active") throw ApiError.forbidden(`Account is ${user.status}`);
    const match = await user.comparePassword(password);
    if (!match) { user.loginAttempts++; if (user.loginAttempts >= 5) { user.lockedUntil = new Date(Date.now() + 1800000); appEvents.emitEvent(Events.ACCOUNT_LOCKED, { userId: user._id }); } user.loginHistory.push({ ip: ip||"unknown", device: device||"unknown", timestamp: new Date(), successful: false }); await user.save(); throw ApiError.unauthorized("Invalid email or password"); }
    user.loginAttempts = 0; user.lockedUntil = undefined; user.lastLogin = new Date(); user.lastLoginIp = ip;
    const tokens = this.generateTokenPair(user);
    user.refreshTokens.push(tokens.refreshToken); user.activeSessions.push(tokens.sessionId);
    user.loginHistory.push({ ip: ip||"unknown", device: device||"unknown", timestamp: new Date(), successful: true });
    if (user.refreshTokens.length > 5) user.refreshTokens = user.refreshTokens.slice(-5);
    await user.save();
    appEvents.emitEvent(Events.USER_LOGGED_IN, { userId: user._id });
    return { user, tokens };
  }

  static async refreshTokens(oldToken: string) {
    const { sub, sessionId } = this.verifyRefreshToken(oldToken);
    const user = await User.findById(sub).select("+refreshTokens +activeSessions");
    if (!user) throw ApiError.unauthorized();
    if (!user.refreshTokens.includes(oldToken)) { user.refreshTokens = []; user.activeSessions = []; await user.save(); throw ApiError.unauthorized("Token compromised"); }
    user.refreshTokens = user.refreshTokens.filter(t => t !== oldToken);
    user.activeSessions = user.activeSessions.filter(s => s !== sessionId);
    const tokens = this.generateTokenPair(user);
    user.refreshTokens.push(tokens.refreshToken); user.activeSessions.push(tokens.sessionId);
    await user.save();
    return { user, tokens };
  }

  static async logout(userId: string, sessionId: string) {
    const user = await User.findById(userId).select("+refreshTokens +activeSessions");
    if (!user) return;
    user.refreshTokens = user.refreshTokens.filter(t => { try { return (jwt.verify(t, config.jwt.refreshSecret) as any).sessionId !== sessionId; } catch { return false; } });
    user.activeSessions = user.activeSessions.filter(s => s !== sessionId);
    await user.save();
  }

  static async logoutAll(userId: string) { await User.findByIdAndUpdate(userId, { $set: { refreshTokens: [], activeSessions: [] } }); }
  static async getProfile(userId: string) { return User.findById(userId); }
}