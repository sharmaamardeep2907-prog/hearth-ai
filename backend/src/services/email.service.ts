import nodemailer from "nodemailer";
import { config } from "../config";
import { logger } from "../utils/logger";

let transporter: nodemailer.Transporter | null = null;

function getTransporter(): nodemailer.Transporter {
  if (!transporter) {
    if (config.smtp.user && config.smtp.pass) {
      transporter = nodemailer.createTransport({ host: config.smtp.host, port: config.smtp.port, secure: config.smtp.secure, auth: { user: config.smtp.user, pass: config.smtp.pass } });
    } else {
      transporter = { sendMail: async (opts: any) => { logger.info("📧 MOCK EMAIL", { to: opts.to, subject: opts.subject }); return { messageId: `mock-${Date.now()}` }; } } as any;
    }
  }
  return transporter;
}

export class EmailService {
  static async send(opts: { to: string; subject: string; html: string }) {
    try {
      await getTransporter().sendMail({ from: config.smtp.from, ...opts });
      return true;
    } catch (e: any) { logger.error("Email failed", { error: e.message }); return false; }
  }
}