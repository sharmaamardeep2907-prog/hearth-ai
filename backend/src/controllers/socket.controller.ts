import { Request, Response } from "express";
import { getIO } from "../socket";

export class SocketController {
  static getStatus(_req: Request, res: Response) {
    const io = getIO();
    res.json({ success: true, socket: { active: !!io, clientsCount: io?.engine?.clientsCount || 0 } });
  }
}