import { Router } from "express";
import { authenticate } from "../middleware/auth";
import { WalletService } from "../services/wallet.service";
import { ApiResponseBuilder } from "../utils/response";

const router = Router();
router.use(authenticate);
router.get("/balance", async (req, res, n) => { try { const b = await WalletService.getBalance(req.user!.id); ApiResponseBuilder.success(res, { balance: b }); } catch (e) { n(e); } });
router.get("/transactions", async (req, res, n) => { try { const { page=1, limit=20 } = req.query; const r = await WalletService.getTransactions(req.user!.id, +page, +limit); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } });
router.post("/withdraw", async (req, res, n) => { try { const r = await WalletService.withdraw(req.user!.id, req.body.amount); ApiResponseBuilder.success(res, r); } catch (e) { n(e); } });
export default router;