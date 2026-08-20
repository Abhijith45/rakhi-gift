---
name: production-quality
description: Production engineering, performance, security, accessibility, reliability, and deployment rules for the Personalized Rakhi Memory Website. Use this skill whenever implementing, reviewing, testing, optimizing, or preparing the application for deployment.
---

# Production Quality Skill

## 1. Engineering principle

Build the smallest production-worthy system that can safely process:
- customer content
- private photos
- payments
- public gift pages
- administrative data
- analytics

Favor simple, observable architecture over unnecessary infrastructure.

## 2. Preferred technology stack

### Frontend
- React
- Vite
- JavaScript
- React Router
- React Three Fiber
- Three.js
- CSS / CSS Modules
- optional Framer Motion

Do not introduce TypeScript unless explicitly requested.

Do not introduce Tailwind unless explicitly requested.

### Backend
- Node.js
- Express.js
- JavaScript
- REST API

### Data
- PostgreSQL
- Prisma ORM

### Image storage
- Cloudinary or equivalent object/image CDN

### Payment
- Razorpay for India-first launch

### Hosting
Recommended:
- Frontend: Vercel
- Backend: Render or Railway
- PostgreSQL: Neon
- Images: Cloudinary

Equivalent services may be substituted if cost, availability, or reliability requires it.

## 3. Architecture

Use a clear separation:

```text
Frontend
   |
   v
REST API
   |
   +--> PostgreSQL
   |
   +--> Cloudinary
   |
   +--> Razorpay
```

The frontend must not:
- directly modify database records
- contain payment secrets
- trust a payment-success callback without server verification
- contain admin credentials

## 4. Environment variables

Never commit secrets.

Typical backend variables:

```text
DATABASE_URL
RAZORPAY_KEY_ID
RAZORPAY_KEY_SECRET
RAZORPAY_WEBHOOK_SECRET
CLOUDINARY_CLOUD_NAME
CLOUDINARY_API_KEY
CLOUDINARY_API_SECRET
JWT_SECRET
FRONTEND_URL
```

Frontend may expose only intentionally public values such as:
- public API base URL
- Razorpay public key ID where required

Never expose:
- secret keys
- DB credentials
- Cloudinary API secret
- webhook secret
- JWT signing secret

## 5. Data model principles

At minimum, plan for:

### User
Stores creator information.

### Gift
Stores personalized gift definition and publication status.

### GiftPhoto
Stores Cloudinary asset URL and presentation metadata.

### GiftMemory
Stores timeline/memory information.

### GiftReason
Stores "Why You're Special" items.

### Payment
Stores gateway identifiers, amount, currency, and status.

### GiftView / AnalyticsEvent
Stores anonymous usage events.

Keep foreign keys explicit.

Use indexes for:
- gift slug
- gift status
- payment status
- payment gateway order ID
- created_at
- gift_id on child tables

## 6. Gift lifecycle

Use explicit states.

Recommended:

```text
DRAFT
PAYMENT_PENDING
PAID
ACTIVE
DISABLED
EXPIRED
```

Rules:
- DRAFT is not publicly accessible
- PAYMENT_PENDING is not publicly accessible
- only PAID/ACTIVE gift states render publicly
- DISABLED and EXPIRED use designed states
- payment records should never be silently overwritten

## 7. URL security

Use:
`/g/:slug`

Slug requirements:
- unique
- non-sequential
- not derived from raw personal data alone
- collision-safe
- validated before DB lookup

Avoid:
`/g/123`
`/g/987654`

Prefer:
`/g/rahul-x7k29`
or a random-safe token.

Do not expose internal DB identifiers when not necessary.

## 8. Public gift endpoint

Example:

```http
GET /api/gifts/:slug
```

Return only fields required to render the gift.

Do not return:
- creator email
- phone number
- payment secrets
- admin information
- internal audit records
- unnecessary DB metadata

## 9. Payment architecture

Recommended flow:

```text
Create gift draft
        ↓
Create Razorpay order on backend
        ↓
Return order information to frontend
        ↓
Open checkout
        ↓
Payment completed
        ↓
Backend verifies signature/webhook
        ↓
Payment = PAID
        ↓
Gift = ACTIVE
        ↓
Generate/return public URL
```

Never use client-side success alone to activate a paid gift.

Handle:
- failed payment
- abandoned checkout
- duplicate webhook
- duplicate order submission
- delayed webhook
- already-paid order

Payment state changes must be idempotent.

## 10. Image upload security

Validate:
- MIME type
- extension
- file size
- dimensions where necessary

Do not trust only browser validation.

Recommended limits for MVP:
- 15 photos per gift
- configurable max file size per image
- reject unsupported media types

Use Cloudinary transformations for:
- width
- quality
- format
- thumbnail
- responsive derivatives

Do not persist huge originals indefinitely unless business policy requires it.

## 11. API design

Keep API small.

Possible endpoints:

```text
POST   /api/gifts/draft
PATCH  /api/gifts/:id
POST   /api/gifts/:id/photos
DELETE /api/gifts/:id/photos/:photoId

POST   /api/payments/order
POST   /api/payments/verify
POST   /api/payments/webhook

GET    /api/gifts/:slug
GET    /api/gifts/:slug/qr
```

Admin:

```text
POST   /api/admin/auth/login
GET    /api/admin/dashboard
GET    /api/admin/gifts
GET    /api/admin/payments
GET    /api/admin/analytics
```

Adapt endpoint names to the actual codebase rather than forcing these exact paths.

## 12. Validation

Use server-side validation for:
- names
- content lengths
- array limits
- IDs
- slug
- payment amounts
- upload metadata

Reject malformed data with predictable responses.

Prefer structured errors:

```js
{
  success: false,
  error: {
    code: "INVALID_GIFT",
    message: "Gift could not be loaded."
  }
}
```

Do not leak stack traces to users.

## 13. Authentication

Creator account login is not mandatory for initial purchase flow.

Admin must be protected.

Recommended MVP admin:
- secure password authentication
- HTTP-only secure cookie or equally robust session strategy
- rate limiting on login
- logout
- authorization middleware

Do not store admin passwords in plaintext.

## 14. Rate limiting

Protect:
- admin login
- gift creation
- payment order creation
- payment verification
- public gift API if abuse appears

Do not over-engineer rate limiting before observing real traffic.

## 15. Analytics

Separate business analytics from technical logs.

Track business events such as:

```text
landing_view
create_started
form_completed
preview_viewed
payment_started
payment_success
payment_failed
gift_created
gift_viewed
surprise_revealed
share_clicked
whatsapp_share_clicked
```

Store:
- event name
- timestamp
- gift ID when relevant
- anonymous session ID where useful
- source/referrer where useful
- device category where useful

Avoid collecting unnecessary personal data.

## 16. Analytics dashboard

Minimum owner metrics:

### Sales
- total orders
- successful payments
- total revenue
- average order value

### Funnel
- landing views
- create starts
- previews
- payments started
- payments successful

### Product
- gifts created
- gifts viewed
- surprise reveals
- shares
- QR generation

### Breakdown
- theme popularity
- date/time trends
- acquisition source where available

## 17. SEO rules

Marketing pages may be indexed.

Individual gift pages should normally be:

```html
<meta name="robots" content="noindex,nofollow" />
```

Also consider:
- canonical for marketing pages
- sitemap for marketing pages
- robots.txt
- Open Graph metadata for landing page
- separate metadata strategy for gift pages

Do not expose private gift content in structured data.

## 18. Accessibility

Minimum requirements:
- semantic HTML
- keyboard navigation
- visible focus state
- accessible buttons
- alt text
- sufficient color contrast
- reduced-motion support
- form labels/errors

3D must enhance content, not replace it.

## 19. Responsive design

Test at least:
- 320px
- 360px
- 390px
- 430px
- 768px
- 1024px
- 1280px+

Do not simply shrink desktop.

Create responsive compositions intentionally.

## 20. Performance requirements

Frontend:
- optimize images
- lazy-load noncritical content
- avoid large dependencies without justification
- code-split where useful
- avoid unnecessary renders
- keep 3D render cost under control

Target:
- fast first contentful experience
- responsive interactions on mid-range Android devices
- stable layout
- minimal main-thread blocking

The Memory Wall is the highest-risk performance feature and should be profiled on mobile.

## 21. Error handling

Implement designed states for:
- invalid gift URL
- gift not found
- disabled gift
- expired gift
- payment failed
- upload failed
- image failed
- network error
- server unavailable
- WebGL unsupported

Never show raw exception messages to customers.

## 22. Logging

Backend logs should capture:
- request ID where practical
- endpoint
- status code
- error category
- payment event ID/order ID where appropriate
- upload failures
- unexpected exceptions

Do not log:
- payment secrets
- passwords
- private keys
- unnecessary personal content
- full private messages/images

## 23. Deployment

### Frontend
- build with production environment variables
- configure SPA route fallback for `/g/:slug`
- verify direct navigation and refresh
- configure HTTPS
- configure custom domain

### Backend
- production environment variables
- database migration/deploy process
- health endpoint
- error handling
- CORS restricted to known frontend origins
- webhook endpoint accessible publicly and securely verified

### Database
- production migration workflow
- indexes reviewed
- backup/recovery plan appropriate to the chosen provider

## 24. Testing

At minimum:

### Unit
- slug generation
- price calculations
- gift state transitions
- payment verification helpers
- deterministic wall placement

### Integration
- create gift
- upload photo metadata
- payment order creation
- payment verification
- public gift lookup

### E2E / manual
- complete creator flow
- failed payment
- successful payment
- open public URL
- refresh public URL
- mobile Memory Wall
- surprise reveal
- QR scan
- admin login/dashboard

## 25. Code quality

Prefer:
- small components
- clear module boundaries
- explicit names
- reusable utilities
- centralized API client
- centralized validation
- environment configuration
- consistent error handling

Avoid:
- giant components
- magic constants everywhere
- duplicated API logic
- duplicated theme markup
- random values during render
- dead dependencies
- commented-out abandoned code

## 26. Production acceptance criteria

### Reliability
- [ ] Public gift URL works after refresh.
- [ ] Invalid slugs have a proper state.
- [ ] Payment flow is server-verified.
- [ ] Duplicate payment callbacks are handled safely.
- [ ] Upload failures don't corrupt gift records.
- [ ] Optional content can be absent without errors.

### Security
- [ ] No secrets in client bundle.
- [ ] Admin routes are protected.
- [ ] Gift API exposes only required fields.
- [ ] Upload validation exists on server.
- [ ] Gift pages are noindex/nofollow.
- [ ] HTTPS is enabled.

### Performance
- [ ] Images are optimized.
- [ ] 3D rendering is profiled on mobile.
- [ ] No unnecessary render loop.
- [ ] No avoidable layout shift.
- [ ] Main landing page loads quickly.
- [ ] Gift page remains usable on weaker devices.

### Accessibility
- [ ] Keyboard navigation works.
- [ ] Focus is visible.
- [ ] Buttons have meaningful labels.
- [ ] Reduced-motion mode works.
- [ ] Text remains readable without 3D effects.

### Deployment
- [ ] Production environment variables are configured.
- [ ] Database migrations are reproducible.
- [ ] Webhook is verified.
- [ ] SPA routes work on direct navigation.
- [ ] Health endpoint works.
- [ ] Production build completes without warnings that indicate real issues.

## 27. Definition of done

A feature is not done when it merely renders.

It is done only when:
1. happy path works
2. failure state exists
3. mobile behavior works
4. data is validated
5. loading state is intentional
6. accessibility is considered
7. performance is acceptable
8. no secrets are exposed
9. console/server logs have no unexpected errors
10. the feature matches the product rules in `rakhi-product`
