# 🚀 HEARTH AI — Production Deployment Guide

## Architecture
```
Vercel (Next.js) → Render (Express/Node) → MongoDB Atlas
                        ↓
        Gemini AI | Razorpay | Cloudinary
```

## Step 1: MongoDB Atlas
1. Create cluster at mongodb.com/atlas (AWS Mumbai)
2. Create user, whitelist 0.0.0.0/0
3. Copy connection string

## Step 2: Backend (Render)
1. Create Web Service → Root: backend → Build: `npm install && npm run build` → Start: `npm start`
2. Set env vars: NODE_ENV=production, MONGODB_URI, JWT_ACCESS_SECRET, JWT_REFRESH_SECRET, CORS_ORIGIN=https://hearth.ai
3. Add optional: GEMINI_API_KEY, RAZORPAY_*, CLOUDINARY_*, SMTP_*

## Step 3: Frontend (Vercel)
1. Import repo → Framework: Next.js
2. Set: NEXT_PUBLIC_API_URL=https://api.hearth.ai/api/v1, NEXT_PUBLIC_GA4_ID, NEXT_PUBLIC_CLARITY_ID
3. Domain: hearth.ai

## Step 4: Third-Party
- Gemini: ai.google.dev → API key
- Maps: Console → enable Geocoding/Directions/Places
- Razorpay: razorpay.com → keys + webhook: api.hearth.ai/api/v1/webhooks/razorpay
- Cloudinary: cloud name + keys
- Email: SendGrid → SMTP config

## Verify
```bash
curl https://api.hearth.ai/health
curl -X POST https://api.hearth.ai/api/v1/auth/register -H "Content-Type: application/json" -d '{"email":"t@h.ai","password":"Test@1234","firstName":"T","lastName":"U"}'
```

## Cost Estimate: ~$107/mo (Vercel Pro $20 + Render Standard $25 + Atlas M10 $57 + AI ~$5)