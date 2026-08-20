---
name: rakhi-product
description: Product, UX, content, and business rules for the Personalized Rakhi Memory Website. Use this skill whenever designing, implementing, reviewing, or modifying user-facing product flows, gift pages, themes, pricing, content, or product behavior.
---

# Personalized Rakhi Memory Website — Product Skill

## 1. Product definition

This product is a personalized digital Raksha Bandhan gift.

The customer does not buy a generic website. They purchase a personalized memory experience rendered by one shared application.

Core concept:

> Turn sibling memories into a beautiful digital gift.

Every paid gift receives a unique public URL and QR code. The URL resolves to a stored gift record and renders the same application with that customer's content.

The product must feel:
- emotional
- premium
- personal
- playful where appropriate
- effortless to create
- mobile-first
- fast enough to share immediately

Do not make the experience feel like:
- a generic SaaS dashboard
- a form builder
- a photo gallery
- a corporate landing page
- a template marketplace

## 2. Product goals

Primary:
1. Convert visitors into paid gift creators.
2. Let a customer create a gift with minimal friction.
3. Produce a polished recipient experience.
4. Make the Memory Wall the signature visual feature.
5. Make the final reveal emotionally memorable.
6. Make sharing via URL and QR effortless.

Secondary:
- collect enough analytics to understand funnel performance
- allow owner/admin to inspect users, gifts, payments, and usage
- support multiple visual themes without duplicating product logic

## 3. Core user flow

### Creator flow

1. Landing page
2. Start creating
3. Enter sender and recipient names
4. Select relationship where needed (Brother/Sister)
5. Choose theme
6. Upload photos
7. Add optional photo captions
8. Write Rakhi message
9. Add "Why You're Special" items
10. Optionally add timeline memories
11. Optionally add sibling fun content
12. Preview gift
13. Create payment order
14. Complete payment
15. Backend verifies payment
16. Gift is activated
17. Show gift URL
18. Generate/show QR code
19. Offer WhatsApp/share action

### Recipient flow

1. Open public gift URL
2. See personalized opening
3. Experience Memory Wall
4. Read Rakhi message
5. See selected memories and reasons
6. Optionally view timeline/fun section
7. Trigger surprise reveal
8. See final Rakhi wish
9. Optionally save/share URL

## 4. Recipient-facing section order

This order is product-approved.

### Mandatory
1. Opening / Hero
2. Memory Wall
3. Rakhi Message
4. Why You're Special
5. Surprise Reveal
6. Final Rakhi Wish
7. Share / QR access

### Optional
1. Photo Captions
2. Our Memories Timeline
3. Sibling Fun / Inside Jokes
4. Background music

Optional sections should not leave awkward visual gaps when absent.

### Removed from MVP
Do not implement unless explicitly requested later:
- video messages
- voice messages
- user-uploaded music
- AI avatar/video generation
- social feed
- chat/comments
- collaboration
- complex page builder
- advanced customer accounts
- creator-to-recipient messaging
- real-time editing

## 5. Signature experience

The two most important emotional moments are:

### A. Memory Wall
The wall must immediately communicate:
- "these are our memories"
- physical photos mounted on a wall
- connected sibling story
- crafted rather than auto-generated

### B. Surprise Reveal
The visitor should feel there is a small discovery at the end.

Preferred interaction:
- envelope
- gift box
- sealed note
- hidden card
- button such as "One last thing…"

After interaction, show the final personalized message.

## 6. Memory Wall content rules

Default:
- 6–15 photos
- broad rectangular frames
- varied aspect ratios if supported
- slight random rotations
- visual depth
- thread connections
- tack/pin details
- warm wall background
- subtle shadows

Do not:
- overlap photos so much that faces are hidden
- rotate photos aggressively
- allow random placement to cover text
- use unreadable tiny photos on mobile
- make the threads look like rigid SVG diagrams
- let the wall become visually noisy

The wall should look intentionally arranged even though placement has controlled randomness.

## 7. Personalization content

Use short, natural content.

Examples:
- "Partners in crime"
- "My forever teammate"
- "Thanks for always having my back."
- "From childhood chaos to grown-up chaos."

Avoid:
- long generated paragraphs unless requested
- generic motivational copy
- corporate wording
- repeated "Happy Raksha Bandhan" everywhere
- excessive emoji use

The customer's own words should remain the emotional center.

## 8. Theme system

Themes change visual language, not product behavior.

Initial theme candidates:
1. Warm Memory
2. Playful Childhood
3. Elegant Minimal
4. Traditional Rakhi

A theme may modify:
- background textures
- accent colors
- frame treatment
- typography pairing
- decorative elements
- thread/tack styling
- reveal animation

A theme must not require separate application code paths for core content rendering.

Use data-driven theme tokens.

## 9. Pricing model

Recommended initial pricing:

### Basic — ₹99–₹149
- Memory Wall
- Personalized message
- Basic styling
- Shareable URL

### Premium — ₹199–₹299
Primary recommended package.
- Everything in Basic
- Photo captions
- Why You're Special
- Timeline
- Theme selection
- Premium animations
- QR code

### Deluxe — ₹399–₹499
- Everything in Premium
- Sibling Fun
- enhanced reveal
- premium visual treatment
- additional photo capacity where technically supported

The UI should make Premium the obvious value choice without using manipulative dark patterns.

## 10. Public URL rules

Use a route similar to:

`/g/:slug`

Examples:
- `/g/rahul-8x92k`
- `/g/neha-3pz71`

Rules:
- slug must be unique
- slug should not expose internal DB IDs
- random suffix should be included to reduce collisions and guessing
- public gift pages should be `noindex, nofollow`
- unpublished or unpaid gifts must not become publicly accessible
- disabled/expired gifts should show a graceful state
- never expose admin APIs from the public client

## 11. Privacy rules

Gift pages contain personal photos and messages.

Therefore:
- do not index gift pages
- do not expose sensitive creator information
- do not show email/phone on recipient page unless explicitly part of content
- validate uploads
- use HTTPS
- avoid storing secrets in frontend code
- do not place payment secrets in browser bundles

## 12. Admin/owner product surface

Owner should be able to view:
- total users
- total gifts
- paid gifts
- payment revenue
- daily/weekly/monthly orders
- gift page views
- conversion funnel
- recent orders
- gift status
- payment status
- theme usage
- referral/source where available

Admin views should prioritize operational usefulness over visual novelty.

## 13. Analytics events

At minimum track:
- landing_view
- create_started
- form_completed
- preview_viewed
- payment_started
- payment_success
- payment_failed
- gift_created
- gift_viewed
- surprise_revealed
- share_clicked
- qr_generated
- whatsapp_share_clicked

Do not collect unnecessary personal data for analytics.

## 14. Content quality rules

Every section must answer one of:
- What should I feel?
- What should I remember?
- What should I discover?
- What should I do next?

Avoid sections that exist only because they are technically easy to build.

## 15. Product acceptance criteria

### Creator
- [ ] User can create a gift without creating an account unless the business later requires accounts.
- [ ] User can upload the supported photo count.
- [ ] User can remove/reorder photos where promised.
- [ ] User can enter all mandatory content.
- [ ] User can preview the gift.
- [ ] Payment completion is verified server-side.
- [ ] Successful payment results in an active gift.
- [ ] User receives/can copy a unique gift URL.
- [ ] User can obtain a QR code.

### Recipient
- [ ] Public gift URL loads correctly on mobile and desktop.
- [ ] Personalized names/content render correctly.
- [ ] Memory Wall is the dominant visual feature.
- [ ] Missing optional sections do not break layout.
- [ ] Surprise Reveal is interactive.
- [ ] Final Rakhi Wish is clearly visible.
- [ ] Gift page is not intended to be indexed by search engines.

### Product quality
- [ ] No placeholder copy remains in production.
- [ ] No broken images.
- [ ] No dead buttons.
- [ ] No layout overflow on common mobile widths.
- [ ] Refreshing a gift URL still works.
- [ ] An invalid gift slug has a designed error state.
