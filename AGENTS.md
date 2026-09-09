# 🤖 AGENTS.md — AI Agent Guidelines & Architecture Manual

This document provides architectural context, development constraints, and engineering protocols for AI agents and developers modifying the **Personalized Rakhi Memory Platform**.

---

## 🎯 Project Overview & Philosophy

The application is a personalized digital gift platform for **Raksha Bandhan**, enabling users to craft an interactive memory keepsake for their siblings. 

### Core Product Experiences
1. **Creator Flow (`/create`)**: Multi-step builder with live interactive preview, package selection, photo cropping/uploading, editorial letter writing, memory timeline chapters, reasons, banter, theme customization, and Razorpay checkout.
2. **Public Gift Keepsake (`/g/:slug`)**: High-touch recipient experience featuring the **3D Connected Memory Wall**, interactive wax seal opening, milestone timeline, reasons cards, inside jokes, secret promise voucher reveal, and keepsake download/QR sharing.
3. **Admin Dashboard (`/admin`)**: Protected metrics portal for sales, conversion funnels, and gift management.

---

## 🏗️ Architecture & Authority Model

```text
[ React 18 + Three.js (Vite) ]
              │
              │ REST API (X-Request-ID, Rate Limited)
              ▼
[ Express.js Backend Server ]
   ├── Prisma ORM ──────► [ PostgreSQL Database ]
   ├── Razorpay SDK ────► [ Payment Gateway ]
   └── Cloudinary SDK ──► [ Image CDN ]
```

### 1. Server Authority Rules (CRITICAL)
- **Pricing Authority**: The frontend NEVER calculates or dictates the payment amount. The backend strictly determines amounts in `server/config/razorpay.js` based on the plan (`BASIC`: ₹99, `PREMIUM`: ₹249, `DELUXE`: ₹449).
- **Slug Generation**: Public slugs (`/g/:slug`) are ONLY assigned by the backend upon verified payment confirmation.
- **Gift State Activation**: A gift transitions to `ACTIVE` only after cryptographic HMAC-SHA256 signature verification or verified webhook confirmation. Client callbacks are never trusted alone.
- **Privacy & Sanitization**: The public gift endpoint (`/api/gifts/public/:slug`) must NEVER return creator emails, payment secrets, internal database IDs, or audit metadata.

### 2. Gift Lifecycle States
```text
DRAFT  ──►  PAYMENT_PENDING  ──►  PAID / ACTIVE  ──►  DISABLED / EXPIRED
```
- `DRAFT`: Unpublished draft stored in local storage and backend. Cannot be accessed via `/g/:slug`.
- `PAYMENT_PENDING`: Razorpay order generated, awaiting checkout completion.
- `ACTIVE`: Paid and publicly accessible to the recipient.
- `DISABLED`: Deactivated by admin or creator.

---

## 🧩 Domain Skills Reference

Always consult the specialized project skills in `.agents/skills/` before modifying respective domains:

| Skill | Directory | Responsibility |
| :--- | :--- | :--- |
| **rakhi-product** | [`.agents/skills/rakhi-product/SKILL.md`](.agents/skills/rakhi-product/SKILL.md) | Product scope, package entitlements, UX copy, themes, pricing rules, and acceptance criteria. |
| **3d-memory-wall** | [`.agents/skills/3d-memory-wall/SKILL.md`](.agents/skills/3d-memory-wall/SKILL.md) | Three.js / React Three Fiber scene, deterministic frame layouts, thread network math, shaders, touch physics, and mobile performance. |
| **production-quality** | [`.agents/skills/production-quality/SKILL.md`](.agents/skills/production-quality/SKILL.md) | Security, rate limiting, logging, error handling, PostgreSQL indexes, Cloudinary transformations, and CI/CD. |

---

## 📐 Engineering Constraints & Best Practices

### 1. Frontend & UI
- **Styling**: Use **Vanilla CSS** with predefined CSS Custom Properties in [`src/styles/tokens.css`](src/styles/tokens.css) and [`src/styles/theme-tokens.css`](src/styles/theme-tokens.css). **Do NOT introduce Tailwind CSS** unless explicitly instructed.
- **Languages**: Use standard JavaScript / JSX. **Do NOT introduce TypeScript** unless explicitly requested.
- **Routing**: Use `react-router-dom` (via [`src/router/index.jsx`](src/router/index.jsx)).
- **Component Modularity**: Avoid monolithic components. Creator steps must live in [`src/components/creator/steps/`](src/components/creator/steps/).
- **Config as SSOT**: Plan limits, step sequences, and themes must be consumed from [`src/config/`](src/config/) (`planConfig.js`, `themeConfig.js`, `stepConfig.js`).

### 2. 3D Memory Wall Performance
- Must remain deterministic: Layout coordinates, photo tilts, and thread connection points must use mathematical hashing ([`layoutUtils.js`](src/components/memory-wall/layoutUtils.js)), never `Math.random()` during render.
- Keep polygon counts low; share geometry instances across polaroid frames.
- Support reduced-motion mode (`prefers-reduced-motion`) and mobile touch orbit controls cleanly.

### 3. Backend & Security
- **Logging**: Use [`server/utils/logger.js`](server/utils/logger.js) for all logging. Never use raw `console.log` for runtime exceptions. Sensitive keys (`password`, `secret`, `signature`, `token`) are automatically redacted.
- **Rate Limiting**: Preserve and enforce limiters in [`server/middleware/rateLimitMiddleware.js`](server/middleware/rateLimitMiddleware.js) on auth, payment, and gift draft endpoints.
- **Request Tracing**: All requests must retain `X-Request-ID` via [`server/middleware/requestIdMiddleware.js`](server/middleware/requestIdMiddleware.js).
- **Error Responses**: All API errors must follow the standard envelope:
  ```json
  {
    "success": false,
    "error": {
      "code": "ERROR_CODE",
      "message": "User-friendly sanitized message"
    }
  }
  ```

---

## 🧪 Testing & Verification Protocol

Before completing any feature, bug fix, or refactor:

1. **Verify Client Build**:
   ```bash
   npm run build
   ```
   Ensure Vite transforms all modules cleanly without bundle errors.

2. **Verify Node Syntax**:
   ```bash
   node -c server/index.js
   ```

3. **Run Smoke & Integration Tests**:
   ```bash
   npm run test:smoke
   ```

4. **Verify SEO & Privacy**:
   - Ensure private gift pages maintain `noindex, nofollow` meta tags.
   - Verify [`public/robots.txt`](public/robots.txt) blocks `/g/`, `/admin/`, and `/api/`.
