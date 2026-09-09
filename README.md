# 🎁 Rakhi Memory Keepsake — Personalized Digital Gift Platform

A modern, production-grade personalized digital gift web application for **Raksha Bandhan**. Allows brothers and sisters to craft interactive keepsakes featuring an animated **3D Connected Memory Wall** (Three.js & React Three Fiber), a personalized letter sealed with wax, memory timeline chapters, personalized reasons, sibling fun banter, a secret surprise reveal, and seamless payment integration with **Razorpay**.

---

## 🌟 Key Features

- **🧵 3D Connected Memory Wall**: Interactive Three.js / React Three Fiber corkboard scene with realistic photo frames, pushpins, braided sacred threads, subtle camera physics, and custom mobile touch support.
- **🎨 4 Curated Aesthetic Themes**:
  - **Warm Memory**: Terracotta, warm amber, and golden threads.
  - **Playful Childhood**: Coral, sky blue, and vibrant festive vibes.
  - **Elegant Minimal**: Charcoal, champagne gold, and clean luxury typography.
  - **Traditional Rakhi**: Deep royal crimson, marigold saffron, and ornate gilded accents.
- **💎 3 Package Tiers**:
  - **Basic Keepsake (₹99)**: Up to 4 photos on 3D wall, wax seal letter, private link & QR card.
  - **Premium Memory (₹249)**: Up to 8 photos with captions/dates, Why You're Special list, Memory Timeline milestones, Sibling Fun banter, and all 4 themes.
  - **Deluxe Keepsake (₹449)**: Luxury gold aesthetic, jeweled tacks, extended timeline, and multi-burst confetti celebration.
- **🔒 Production Security & Privacy**:
  - Unique collision-safe public slugs (`/g/:slug`).
  - Search engine crawlers blocked from private gifts (`robots.txt` & dynamic `noindex,nofollow`).
  - Server-authoritative pricing and HMAC-SHA256 Razorpay signature & webhook verification.
  - In-memory sliding-window rate limiting on auth, payments, and gift drafts.
  - Sensitive credential & PII redaction in structured production logs.
- **📊 Admin Portal & Analytics**: Protected administrative dashboard (`/admin`) tracking conversion funnel, sales revenue, gift statuses, and anonymous event metrics.

---

## 🛠️ Technology Stack

| Layer | Technology |
| :--- | :--- |
| **Frontend Framework** | React 18, Vite 6, React Router DOM 6 |
| **3D Graphics & Motion** | Three.js, React Three Fiber (`@react-three/fiber`), Canvas Confetti |
| **Icons & QR** | Lucide React, QRCode |
| **Styling & Design System** | Vanilla CSS with CSS Custom Properties / Design Tokens |
| **Backend API** | Node.js (ESM), Express.js |
| **Database & ORM** | PostgreSQL, Prisma ORM |
| **Media Storage** | Cloudinary CDN (with local fallback) |
| **Payment Gateway** | Razorpay (Orders API, Signature Verification & Webhooks) |
| **DevOps & Containers** | Docker (Multi-stage build), GitHub Actions CI/CD |

---

## 📂 Project Structure

```text
rakhi-gift/
├── .github/workflows/ci.yml       # GitHub Actions CI/CD Pipeline
├── .agents/skills/                # Domain intelligence skills (Rakhi product, 3D wall, production)
├── public/
│   ├── favicon.svg                # Application Favicon
│   ├── robots.txt                 # SEO & crawler privacy directives
│   └── sitemap.xml                # Search engine sitemap
├── server/
│   ├── config/
│   │   ├── cloudinary.js          # Cloudinary CDN client & uploader
│   │   ├── prisma.js              # PostgreSQL client via Prisma ORM
│   │   └── razorpay.js            # Razorpay orders, pricing & signature verification
│   ├── controllers/
│   │   ├── adminController.js     # Admin authentication & dashboard data
│   │   ├── analyticsController.js # Anonymous funnel metrics
│   │   ├── giftController.js      # Gift creation, photo uploads & public gift API
│   │   └── paymentController.js   # Razorpay order, verification & webhooks
│   ├── middleware/
│   │   ├── authMiddleware.js      # JWT authentication for admin routes
│   │   ├── rateLimitMiddleware.js # Sliding-window rate limiters
│   │   └── requestIdMiddleware.js # Request correlation ID (X-Request-ID)
│   ├── prisma/
│   │   ├── schema.prisma          # PostgreSQL relational data schema
│   │   └── migrations/            # Version-controlled database migrations
│   ├── routes/                    # Express REST route definitions
│   ├── tests/
│   │   ├── smoke/                 # 14-point production smoke test suite
│   │   └── integration/           # Razorpay webhook & PostgreSQL integration tests
│   ├── utils/
│   │   ├── deterministicLayout.js # Mathematical photo & pin placement on 3D wall
│   │   ├── jwt.js                 # Admin token signing & verification
│   │   ├── logger.js              # Structured logger with secret redaction
│   │   └── slugGenerator.js       # Collision-safe readable slug generator
│   ├── env.js                     # Early ESM environment loader
│   └── index.js                   # Express application entry point
├── src/
│   ├── components/
│   │   ├── common/                # Shared UI primitives (Button, Icon, ErrorBoundary)
│   │   ├── creator/               # Gift builder steps & controls
│   │   │   ├── image-upload/      # Multi-photo uploader, cropper & reorder cards
│   │   │   ├── personalize/       # Timeline, Why Special & Sibling Fun editors
│   │   │   └── steps/             # Modularized step components (Details, Message, etc.)
│   │   ├── gift/                  # Public gift presentation sections
│   │   ├── landing/               # Marketing landing page sections
│   │   ├── layout/                # Header, Footer & Legal layout
│   │   └── memory-wall/           # 3D canvas, thread network & polaroid frames
│   ├── config/                    # Single Source of Truth (Plans, Themes, Steps)
│   ├── hooks/                     # Custom React hooks (state, drafts, navigation, theme)
│   ├── pages/                     # Routed pages (Landing, Creator, Public Gift, Admin, Legal)
│   ├── router/                    # Re-export layer for react-router-dom
│   ├── services/                  # Backend API client & analytics tracker
│   ├── styles/                    # Global CSS, animations & theme token variables
│   ├── App.jsx                    # Root component with routing table
│   └── main.jsx                   # React DOM root entry
├── Dockerfile                     # Multi-stage production container image
├── package.json                   # NPM dependencies and scripts
└── vite.config.js                 # Vite bundler configuration & chunk splitting
```

---

## 🚀 Quick Start (Local Development)

### 1. Prerequisites
- **Node.js**: `v20.x` or higher (see [`.nvmrc`](.nvmrc))
- **PostgreSQL**: Local instance or cloud database (e.g. Neon, Supabase)
- **NPM**: `v10.x`+

### 2. Installation
Clone the repository and install all dependencies:
```bash
git clone https://github.com/Abhijith45/rakhi-gift.git
cd rakhi-gift
npm install
```

### 3. Environment Setup
Configure your frontend and backend environment files:

#### Frontend (`.env` in root)
```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=rzp_test_sampleKeyId123456
```

#### Backend (`server/.env`)
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000
DATABASE_URL="postgresql://postgres:password@localhost:5432/rakhi_gift_db"

# Admin Authentication
ADMIN_EMAIL=admin@rakhigift.me
ADMIN_PASSWORD_HASH=$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi
JWT_SECRET=super_secure_jwt_secret_dev_2026

# Cloudinary Storage
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Razorpay Payments
RAZORPAY_KEY_ID=rzp_test_sampleKeyId123456
RAZORPAY_KEY_SECRET=your_razorpay_secret
RAZORPAY_WEBHOOK_SECRET=your_webhook_secret
```

### 4. Database Setup
Generate the Prisma client and apply database migrations:
```bash
npm run db:generate
npm run db:migrate
```

### 5. Running the Application
Run both the Vite client (Port 3000) and Express server (Port 5000) concurrently:
```bash
npm run dev
```

Or run them individually:
- Client only: `npm run dev:client`
- Server only: `npm run dev:server`

Visit `http://localhost:3000` in your browser.

---

## 📜 Available NPM Scripts

| Script | Purpose |
| :--- | :--- |
| `npm run dev` | Starts client and server concurrently via `concurrently` |
| `npm run dev:client` | Starts Vite development server at `http://localhost:3000` |
| `npm run dev:server` | Starts Express backend server at `http://localhost:5000` |
| `npm run build` | Compiles and optimizes production client bundle to `dist/` |
| `npm run preview` | Previews the production build locally |
| `npm run start` | Runs production server (`node server/index.js`) |
| `npm run db:generate` | Generates `@prisma/client` from `schema.prisma` |
| `npm run db:migrate` | Deploys pending PostgreSQL migrations |
| `npm run test:smoke` | Runs the 14-point production deployment smoke test |

---

## 🧪 Testing & Verification

### Run Smoke Test Suite
Validates health endpoints, route gating, server pricing authority, cryptographic payment verification, and webhook idempotency:
```bash
npm run test:smoke
```

### Run Payment & Webhook Integration Test
```bash
node server/tests/integration/paymentIntegrationTest.js
```

### Run Database Integration Test
```bash
node server/tests/integration/dbSmokeTest.js
```

---

## 🌐 API Overview

| Method | Endpoint | Description | Auth / Rate Limit |
| :--- | :--- | :--- | :--- |
| `GET` | `/health` | Server & database health status | Public |
| `POST` | `/api/gifts` | Create new gift draft | `giftDraftLimiter` (25/15m) |
| `GET` | `/api/gifts/public/:slug` | Retrieve public active gift by slug | Public (Sanitized) |
| `POST` | `/api/gifts/:id/photos` | Upload photos to gift draft | `giftDraftLimiter` |
| `POST` | `/api/payments/create-order`| Create Razorpay payment order | `paymentLimiter` (15/15m) |
| `POST` | `/api/payments/verify` | Verify payment signature & activate gift | `paymentLimiter` (15/15m) |
| `POST` | `/api/payments/webhook` | Authoritative Razorpay webhook handler | HMAC-SHA256 Verified |
| `GET` | `/api/payments/:orderId/status`| Poll payment & gift readiness status | Public |
| `POST` | `/api/admin/login` | Admin authentication | `authLimiter` (5/15m) |
| `GET` | `/api/admin/dashboard` | Admin metrics, gift list & sales data | JWT Protected |
| `POST` | `/api/analytics/event` | Anonymous user event tracking | Public |

---

## 🚢 Deployment Guidelines

- **Frontend**: Deploy on [Vercel](https://vercel.com) or [Netlify](https://netlify.com) pointing to `dist/`. SPA rewrites are pre-configured in [`vercel.json`](vercel.json) and [`netlify.toml`](netlify.toml).
- **Backend**: Deploy to [Render](https://render.com), [Railway](https://railway.app), or AWS ECS via the included [`Dockerfile`](Dockerfile).
- **Database**: Provision PostgreSQL via [Neon](https://neon.tech) or Supabase and provide `DATABASE_URL` with `?sslmode=require`.
- **Domain & SSL**: Configure custom domain with strict HTTPS. Ensure `FRONTEND_URL` and `PUBLIC_APP_URL` environment variables match your production domain.
