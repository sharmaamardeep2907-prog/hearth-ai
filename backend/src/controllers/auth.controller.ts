import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ApiResponseBuilder } from "../utils/response";
import { ApiError } from "../utils/errors";
import { AuthRequest } from "../types";

export class AuthController {
  static async register(req: Request, res: Response, n: NextFunction) { try { const r = await AuthService.register(req.body); ApiResponseBuilder.created(res, r); } catch (e) { n(e); } }
  static async login(req: Request, res: Response, n: NextFunction) { try { const r = await AuthService.login(req.body.email, req.body.password, req.ip, req.headers["user-agent"]); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } }
  static async refreshTokens(req: Request, res: Response, n: NextFunction) { try { if (!req.body.refreshToken) throw ApiError.badRequest(); const r = await AuthService.refreshTokens(req.body.refreshToken); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } }
  static async logout(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); await AuthService.logout(u.id, u.sessionId); ApiResponseBuilder.success(res, null, "Logged out"); } catch (e) { n(e); } }
  static async logoutAll(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); await AuthService.logoutAll(u.id); ApiResponseBuilder.success(res, null); } catch (e) { n(e); } }
  static async getProfile(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const p = await AuthService.getProfile(u.id); if (!p) throw ApiError.notFound(); ApiResponseBuilder.success(res, { user: p }); } catch (e) { n(e); } }
  static async updateProfile(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const p = await AuthService.getProfile(u.id); if (!p) throw ApiError.notFound(); if (req.body.firstName) p.firstName = req.body.firstName; if (req.body.lastName) p.lastName = req.body.lastName; await p.save(); ApiResponseBuilder.success(res, { user: p }); } catch (e) { n(e); } }
  static async changePassword(req: Request, res: Response, n: NextFunction) { try { const u = (req as AuthRequest).user; if (!u) throw ApiError.unauthorized(); const fullUser = await require("../models/user.model").User.findById(u.id).select("+password +passwordHistory"); if (!await fullUser.comparePassword(req.body.currentPassword)) throw ApiError.badRequest("Wrong password"); fullUser.password = req.body.newPassword; await fullUser.save(); ApiResponseBuilder.success(res, null, "Changed"); } catch (e) { n(e); } }
  static async forgotPassword(_req: Request, res: Response, n: NextFunction) { try { ApiResponseBuilder.success(res, null, "If email exists, reset link sent"); } catch (e) { n(e); } }
  static async googleAuth(_req: Request, res: Response) { const { config } = require("../config"); res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?client_id=${config.google.clientId}&redirect_uri=${config.google.callbackUrl}&response_type=code&scope=email%20profile`); }
  static async googleCallback(_req: Request, res: Response, n: NextFunction) { try { ApiResponseBuilder.success(res, null); } catch (e) { n(e); } }
}