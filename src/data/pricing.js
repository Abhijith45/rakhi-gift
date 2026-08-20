/**
 * Pricing Tiers Data (Phase 1 Visual Preview)
 */

export const pricingTiers = [
  {
    id: "basic",
    name: "Basic Gift",
    price: "₹99",
    tagline: "A heartfelt digital card for simple, sweet memories.",
    popular: false,
    ctaText: "Create Basic Gift",
    features: [
      { text: "Interactive 3D Memory Wall (up to 6 photos)", included: true },
      { text: "Personalized Rakhi message", included: true },
      { text: "Private shareable gift link", included: true },
      { text: "Warm Memory theme", included: true },
      { text: "Photo captions & dates", included: false },
      { text: "'Why You're Special' section", included: false },
      { text: "Surprise envelope reveal", included: false },
      { text: "Printable high-res QR code card", included: false }
    ]
  },
  {
    id: "premium",
    name: "Premium Memory",
    price: "₹249",
    tagline: "Our most loved gift — a complete emotional digital keepsake.",
    popular: true,
    badge: "Most Popular",
    ctaText: "Create Premium Gift",
    features: [
      { text: "Full 3D Memory Wall (up to 12 photos)", included: true },
      { text: "Personalized Rakhi message & sign-off", included: true },
      { text: "Private shareable gift link & instant WhatsApp share", included: true },
      { text: "All 4 Visual Themes (Warm, Minimal, Playful, Traditional)", included: true },
      { text: "Photo captions & custom dates", included: true },
      { text: "'Why You're Special' personalized list", included: true },
      { text: "Interactive Surprise Envelope Reveal", included: true },
      { text: "Printable high-res QR code card", included: true }
    ]
  },
  {
    id: "deluxe",
    name: "Deluxe Keepsake",
    price: "₹449",
    tagline: "The ultimate sibling tribute with extended timeline and audio.",
    popular: false,
    ctaText: "Create Deluxe Gift",
    features: [
      { text: "Expanded 3D Memory Wall (up to 20 photos)", included: true },
      { text: "All Premium features included", included: true },
      { text: "Interactive 'Our Sibling Journey' Timeline", included: true },
      { text: "Inside Jokes & Sibling Quiz section", included: true },
      { text: "Curated ambient background melodies", included: true },
      { text: "Custom gift opening animation sequence", included: true },
      { text: "Lifetime cloud backup & downloadable archive", included: true },
      { text: "Priority creator assistance", included: true }
    ]
  }
];
