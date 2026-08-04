import { logger } from "../utils/logger";

const requiredEnvVars = [
  { key: "NODE_ENV", required: true, fallback: "development", description: "Environment" },
  { key: "PORT", required: true, fallback: "5000", description: "Server port" },
  { key: "MONGODB_URI", required: true, description: "MongoDB connection URI" },
  { key: "JWT_ACCESS_SECRET", required: true, description: "JWT access secret" },
  { key: "JWT_REFRESH_SECRET", required: true, description: "JWT refresh secret" },
];

const optionalEnvVars = [
  { key: "GEMINI_API_KEY", required: false, description: "Gemini AI" },
  { key: "RAZORPAY_KEY_ID", required: false, description: "Razorpay" },
  { key: "CLOUDINARY_CLOUD_NAME", required: false, description: "Cloudinary" },
  { key: "SMTP_HOST", required: false, description: "Email" },
];

export function validateEnvironment(): { valid: boolean; warnings: string[]; errors: string[] } {
  const errors: string[] = [];
  const warnings: string[] = [];
  for (const ev of requiredEnvVars) {
    if (!process.env[ev.key]) {
      if (ev.fallback !== undefined) { process.env[ev.key] = ev.fallback; warnings.push(`${ev.key} using fallback: "${ev.fallback}"`); }
      else errors.push(`❌ Missing: ${ev.key} (${ev.description})`);
    }
  }
  for (const ev of optionalEnvVars) {
    if (!process.env[ev.key]) warnings.push(`⚠️  Optional not set: ${ev.key} (${ev.description})`);
  }
  if (errors.length > 0) { logger.error("Environment validation FAILED", { errors }); console.error(errors.join("\n")); return { valid: false, warnings, errors }; }
  if (warnings.length > 0) { console.warn(warnings.join("\n")); }
  return { valid: true, warnings, errors };
}