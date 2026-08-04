import { logger } from "../utils/logger";

interface Job<T = unknown> { id: string; name: string; data: T; status: string; attempts: number; maxAttempts: number; createdAt: Date; }

class JobQueue {
  private queue: Job[] = [];
  private processing = false;
  private activeJobs = 0;
  private maxConcurrent = 3;

  async add<T>(name: string, data: T, maxAttempts = 3): Promise<Job<T>> {
    const job: Job<T> = { id: `job_${Date.now()}_${Math.random().toString(36).slice(2,8)}`, name, data, status: "pending", attempts: 0, maxAttempts, createdAt: new Date() };
    this.queue.push(job as Job); this.processQueue(); return job;
  }

  private async processQueue(): Promise<void> {
    if (this.processing) return; this.processing = true;
    while (this.queue.length > 0 && this.activeJobs < this.maxConcurrent) {
      const job = this.queue.shift()!; this.activeJobs++;
      this.executeJob(job).finally(() => { this.activeJobs--; });
    }
    this.processing = false;
  }

  private async executeJob(job: Job): Promise<void> {
    job.status = "processing"; job.attempts++;
    try {
      if (job.name === "send-email") { const { EmailService } = require("../services/email.service"); await EmailService.send(job.data); }
      else if (job.name === "booking-reminder") { const { NotificationService } = require("../services/notification.service"); const bk = require("../models/booking.model").Booking.findById(job.data.bookingId); if (bk) await NotificationService.send({ recipientId: job.data.userId, type: "reminder", title: "Upcoming", body: "Booking reminder" }); }
      job.status = "completed";
    } catch (error: any) {
      if (job.attempts < job.maxAttempts) { this.queue.push(job); setTimeout(() => this.processQueue(), 5000 * job.attempts); }
      else { job.status = "failed"; logger.error(`Job failed: ${job.name}`); }
    }
  }

  getStats() { return { pending: this.queue.length, active: this.activeJobs }; }
}

export const jobQueue = new JobQueue();