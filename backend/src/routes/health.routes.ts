import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { getHealthData } from "../middleware/error";
import { config } from "../config";

const router = Router();
router.get("/", (_req, res) => { res.status(200).json({ ...getHealthData(), environment: config.server.nodeEnv }); });
router.get("/database", (_req, res) => { const s = mongoose.connection.readyState; const m: Record<number,string> = {0:"disconnected",1:"connected",2:"connecting"}; res.status(s===1?200:503).json({ status: s===1?"healthy":"unhealthy", database: { state: m[s]||"unknown" } }); });
router.get("/ai", (_req, res) => { const e = config.features.aiEnabled && !!config.gemini.apiKey; res.status(e?200:503).json({ status: e?"healthy":"unhealthy", ai: { enabled: e } }); });
router.get("/socket", (_req, res) => { const e = config.features.socketEnabled; res.status(e?200:503).json({ status: e?"healthy":"degraded", socket: { enabled: e } }); });
export default router;