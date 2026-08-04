# 🔥 HEARTH AI

## AI-Powered Smart Service Marketplace

> **Design Philosophy:** Premium · Elegant · Minimal · Luxury · Clean · Professional · Future-Inspired

A production-grade, enterprise-ready platform connecting customers with 50,000+ verified professionals across 20+ categories using Artificial Intelligence.

---

## ✨ Tech Stack

| Layer | Technology |
|-------|-----------|
| **Framework** | Next.js 14 (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS 3.4 |
| **Animations** | Framer Motion 11 |
| **UI Primitives** | Radix UI |
| **Icons** | Lucide React |
| **Theme** | next-themes (Dark-only Premium) |
| **Notifications** | Sonner |
| **Validation** | Zod |
| **Utilities** | clsx, tailwind-merge, CVA |

---

## 🎨 Design System — "Hearth Luxe"

### Color Palette

```
--hearth-gold:     #D4952E  (Primary)
--hearth-gold-400: #E2A94A  (Light)
--hearth-copper:   #C7652E  (Accent)
--hearth-surface:  #0C0A09  (Background)
--hearth-border:   #292420  (Borders)
```

### Typography
- **Display:** Inter (weights 700-900) — Headings
- **Body:** Inter (weights 300-600) — Text

### Effects
- **Glass:** backdrop-blur + translucent backgrounds
- **Gold Glow:** Multi-layered gold box-shadows
- **Grid/Dot:** Subtle background patterns
- **Noise:** SVG noise overlay for texture
- **Shimmer:** Animated gradient sweep

---

## 📁 Project Structure

```
hearth-ai/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/page.tsx
│   │   │   └── signup/page.tsx
│   │   ├── dashboard/page.tsx      # Customer Dashboard
│   │   ├── services/page.tsx       # Browse Professionals
│   │   ├── admin/page.tsx          # Admin Dashboard
│   │   ├── pro/page.tsx            # Pro Dashboard
│   │   ├── layout.tsx              # Root Layout
│   │   └── page.tsx                # Landing Page
│   ├── components/
│   │   ├── ui/                     # Design System
│   │   ├── layout/                 # Navbar, Footer
│   │   └── sections/              # Page Sections
│   ├── data/                       # Categories Data
│   ├── lib/                        # Utilities, API, Analytics, Schema
│   ├── styles/                     # Global CSS + Design Tokens
│   └── types/                      # TypeScript Interfaces
├── backend/
│   ├── src/
│   │   ├── config/                 # App config, DB, validation
│   │   ├── controllers/            # HTTP handlers (thin)
│   │   ├── services/               # Business logic
│   │   ├── models/                 # MongoDB schemas
│   │   ├── middleware/              # Auth, RBAC, error, security
│   │   ├── routes/                 # Express routes
│   │   ├── socket/                 # Socket.IO server
│   │   ├── jobs/                   # Background job queue
│   │   ├── cron/                   # Scheduled tasks
│   │   ├── events/                 # Event emitter
│   │   ├── validators/             # Zod schemas
│   │   ├── tests/                  # Jest test suites
│   │   └── server.ts                # Entry point
│   └── package.json
├── public/
├── tailwind.config.js
└── package.json
```

---

## 🚀 Getting Started

```bash
# Frontend
npm install
npm run dev

# Backend
cd backend
npm install
cp .env.example .env
npm run seed
npm run dev
```

---

## 🎯 Service Categories (20)

Electrician · Plumber · AC Repair · Carpenter · Painter · Cleaning · Salon & Spa · Tutor · Photographer · Mechanic · Interior Designer · Home Appliances · Event Planner · Pest Control · Movers & Packers · Laptop Repair · Mobile Repair · Doctors · Lawyers · Consultants

---

## 🔧 Production Stack

- **Frontend:** Vercel (Next.js)
- **Backend:** Render (Express/Node)
- **Database:** MongoDB Atlas
- **AI:** Google Gemini
- **Payments:** Razorpay
- **Media:** Cloudinary
- **Email:** SendGrid/SMTP

---

**Built with ❤️‍🔥 for the future of service marketplaces.**