# 🔥 HEARTH AI — Backend

## Enterprise-Grade AI-Powered Service Marketplace API

**Stack:** Node.js 22 · Express.js · TypeScript · MongoDB · Socket.IO · Google Gemini AI

---

## 🏗 Architecture

```
Routes → Controllers → Services → Models → MongoDB
  + Middleware (Auth, RBAC, RateLimit, Validation, Error)
  + Events + Jobs + Cron + Socket.IO
```

---

## 🚀 Quick Start

```bash
npm install
cp .env.example .env
npm run seed     # optional
npm run dev      # Starts on :5000
npm test         # Run tests
```

---

## 🔐 Auth

POST /api/v1/auth/register, /login, /refresh, /logout, /logout-all, GET /me, PUT /profile, POST /change-password, /forgot-password, GET /google, /google/callback

Features: JWT + refresh rotation, account lockout, password history, session management, RBAC

## 🤖 AI (Gemini 2.0 Flash)

POST /ai/chat, /booking-assistant, /diagnose-image, /summarize-reviews, /smart-search, /estimate-price

## 📋 Bookings

POST /bookings, GET /customer/me, /provider/:id, /:id, PATCH /:id/status, POST /:id/cancel, /:id/reschedule

## ⭐ Reviews | 💰 Wallet | 🔔 Notifications

Full CRUD with pagination, AI summaries, provider replies, helpful votes

## 🏥 Health

GET /health, /health/database, /health/ai, /health/socket

## 🛡 Security

Helmet, CORS, Rate limiting (3 tiers), MongoDB sanitize, HPP, Input sanitization, bcrypt 12 rounds, JWT rotation

## Deployment: Render (render.yaml auto-detected)