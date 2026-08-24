/**
 * Standardized Pricing Tiers Data
 * Perfectly aligned with approved product entitlements:
 * - Basic: ₹99 (Up to 4 photos, Memory Wall, Rakhi Message, QR & Share)
 * - Premium: ₹249 (Up to 8 photos, Captions, Why Special, Timeline, Sibling Fun, 4 Themes)
 * - Deluxe: ₹449 (Up to 8 photos, Enhanced Memory Wall, Luxury Gold Aesthetics, Enhanced Reveal)
 */

export const pricingTiers = [
  {
    id: "basic",
    name: "Basic Keepsake",
    price: "₹99",
    tagline: "A beautiful Rakhi memory gift for simple, heartfelt moments.",
    popular: false,
    ctaText: "Create Basic Gift",
    features: [
      { text: "3D Connected Memory Wall (up to 4 photos)", included: true },
      { text: "Personalized Rakhi letter with wax seal", included: true },
      { text: "Private permanent gift link & QR code card", included: true },
      { text: "Signature Warm Memory visual theme", included: true },
      { text: "Instant WhatsApp & link sharing", included: true },
      { text: "Photo captions & custom dates", included: false },
      { text: "Why You're Special personalized list", included: false },
      { text: "Memory Timeline & Sibling Fun banter", included: false }
    ]
  },
  {
    id: "premium",
    name: "Premium Memory",
    price: "₹249",
    tagline: "A complete personalized Rakhi experience — our most loved gift.",
    popular: true,
    badge: "Most Popular",
    ctaText: "Create Premium Gift",
    features: [
      { text: "3D Connected Memory Wall (up to 8 photos)", included: true },
      { text: "Per-photo captions & custom dates", included: true },
      { text: "Personalized Rakhi letter with wax seal", included: true },
      { text: "Why You're Special personalized reasons (3–5 items)", included: true },
      { text: "Memory Timeline milestone chapters", included: true },
      { text: "Sibling Fun inside jokes & superlatives", included: true },
      { text: "All 4 Visual Themes (Warm, Minimal, Playful, Traditional)", included: true },
      { text: "Interactive sealed Surprise Promise & QR card", included: true }
    ]
  },
  {
    id: "deluxe",
    name: "Deluxe Keepsake",
    price: "₹449",
    tagline: "A crafted digital keepsake with luxury gold aesthetics.",
    popular: false,
    badge: "Deluxe Keepsake",
    ctaText: "Create Deluxe Gift",
    features: [
      { text: "All Premium personalization features included", included: true },
      { text: "3D Connected Memory Wall (up to 8 photos)", included: true },
      { text: "Enhanced Memory Wall with jeweled tacks & gold trims", included: true },
      { text: "Gilded wax seal letter & luxury visual presentation", included: true },
      { text: "Extended Memory Timeline (up to 8 milestones)", included: true },
      { text: "Enhanced Surprise Reveal with multi-burst celebration", included: true },
      { text: "All 4 Visual Themes & custom accents", included: true },
      { text: "Private permanent gift link & printable QR card", included: true }
    ]
  }
];

export default pricingTiers;
