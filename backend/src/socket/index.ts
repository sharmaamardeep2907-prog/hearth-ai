import { Server as HttpServer } from "http";
import { Server as SocketServer, Socket } from "socket.io";
import jwt from "jsonwebtoken";
import { config } from "../config";
import { socketLogger } from "../utils/logger";

interface AuthSocket extends Socket { userId?: string; userRole?: string; }
let io: SocketServer | null = null;

export function initSocketIO(httpServer: HttpServer): SocketServer {
  io = new SocketServer(httpServer, { cors: { origin: config.security.corsOrigin, methods: ["GET","POST"], credentials: true }, pingTimeout: 60000, pingInterval: 25000 });
  io.use((socket: AuthSocket, next) => {
    try {
      const token = socket.handshake.auth.token || socket.handshake.query.token;
      if (!token) return next(new Error("Auth required"));
      const decoded = jwt.verify(token as string, config.jwt.accessSecret) as any;
      socket.userId = decoded.sub; socket.userRole = decoded.role;
      next();
    } catch { next(new Error("Invalid token")); }
  });
  io.on("connection", (socket: AuthSocket) => {
    socketLogger.info(`Socket connected: ${socket.userId}`);
    if (socket.userId) socket.join(`user:${socket.userId}`);
    socket.on("chat:join", (roomId: string) => socket.join(`chat:${roomId}`));
    socket.on("chat:message", (data: any) => socket.to(`chat:${data.roomId}`).emit("chat:message", { ...data.message, senderId: socket.userId }));
    socket.on("booking:track", (id: string) => socket.join(`booking:${id}`));
    socket.on("booking:location", (data: any) => io?.to(`booking:${data.bookingId}`).emit("booking:location-update", { lat: data.lat, lng: data.lng }));
    socket.on("disconnect", () => { socketLogger.info(`Disconnected: ${socket.userId}`); });
  });
  socketLogger.info("Socket.IO initialized");
  return io;
}
export function getIO() { return io; }
export function sendToUser(userId: string, event: string, data: unknown) { if (io) io.to(`user:${userId}`).emit(event, data); }