/**
 * Configuration for Recipient-Facing Gift Sections
 * Drives package-aware presentation across BASIC (₹99), PREMIUM (₹249), and DELUXE (₹449)
 * for Hero, Memory Wall, Rakhi Message Letter, Why You're Special, Memory Timeline,
 * Sibling Fun, Surprise Reveal, Final Wish, and Keepsake Share.
 */

export const GIFT_SECTION_CONFIG = {
  BASIC: {
    plan: 'BASIC',
    // Hero configuration
    hero: {
      eyebrow: 'Your Rakhi Memory',
      badgeClass: 'badge-basic',
      accentLevel: 'minimal',
      showScrollCue: true,
      containerMaxWidth: '760px'
    },
    // Message Letter configuration
    message: {
      tierName: 'classic-letter',
      sealType: 'classic-seal',
      paperTone: 'warm-paper',
      showGildedBorder: false,
      signoffStyle: 'classic'
    },
    // Why You're Special section (HIDDEN for Basic)
    whySpecial: {
      enabled: false
    },
    // Memory Timeline (HIDDEN for Basic)
    timeline: {
      enabled: false
    },
    // Sibling Fun / Inside Jokes (HIDDEN for Basic)
    siblingFun: {
      enabled: false
    },
    // Surprise Reveal (Supported if gift has surprise content)
    surprise: {
      enabled: true,
      tierName: 'classic-envelope',
      envelopeTone: 'classic',
      sealType: 'classic-red',
      confettiDensity: 'standard'
    },
    // Final Rakhi Wish
    finalWish: {
      tierName: 'classic-wish',
      showGildedBorder: false,
      blessingStyle: 'warm-classic'
    },
    // Keepsake Share & QR
    share: {
      tierName: 'classic-share',
      showDownloadQr: true,
      showWhatsApp: true
    }
  },

  PREMIUM: {
    plan: 'PREMIUM',
    // Hero configuration
    hero: {
      eyebrow: 'A Personalized Raksha Bandhan Tribute',
      badgeClass: 'badge-premium',
      accentLevel: 'editorial',
      showScrollCue: true,
      containerMaxWidth: '820px'
    },
    // Message Letter configuration
    message: {
      tierName: 'crafted-letter',
      sealType: 'gold-wax-seal',
      paperTone: 'fine-stationery',
      showGildedBorder: false,
      signoffStyle: 'editorial'
    },
    // Why You're Special section
    whySpecial: {
      enabled: true,
      eyebrow: 'THE SIBLING BOND',
      title: "Reasons You're My Person",
      subtitle: 'The little things, quiet moments, and unforgettable quirks that make you irreplaceable.',
      cardStyle: 'editorial',
      accentColor: 'var(--color-rakhi-red)'
    },
    // Memory Timeline
    timeline: {
      enabled: true,
      eyebrow: 'OUR JOURNEY TOGETHER',
      title: 'Moments Through The Years',
      subtitle: 'From childhood chaos to lifelong friendship — each milestone connected by love.',
      threadStyle: 'crimson-silk',
      cardStyle: 'polaroid-milestone'
    },
    // Sibling Fun / Inside Jokes
    siblingFun: {
      enabled: true,
      eyebrow: 'INSIDE JOKES & BANTER',
      title: 'Our Sibling Superlatives',
      subtitle: 'The unwritten rules, shared quirks, and hilarious truths only we understand.',
      cardStyle: 'playful-editorial'
    },
    // Surprise Reveal
    surprise: {
      enabled: true,
      tierName: 'crafted-envelope',
      envelopeTone: 'fine-gold',
      sealType: 'gold-embossed',
      confettiDensity: 'rich'
    },
    // Final Rakhi Wish
    finalWish: {
      tierName: 'editorial-wish',
      showGildedBorder: false,
      blessingStyle: 'festive-gold'
    },
    // Keepsake Share & QR
    share: {
      tierName: 'editorial-share',
      showDownloadQr: true,
      showWhatsApp: true
    }
  },

  DELUXE: {
    plan: 'DELUXE',
    // Hero configuration
    hero: {
      eyebrow: 'Your Handcrafted Rakhi Keepsake',
      badgeClass: 'badge-deluxe',
      accentLevel: 'luxury',
      showScrollCue: true,
      containerMaxWidth: '860px'
    },
    // Message Letter configuration
    message: {
      tierName: 'keepsake-parchment',
      sealType: 'royal-ruby-seal',
      paperTone: 'luxury-parchment',
      showGildedBorder: true,
      signoffStyle: 'handcrafted'
    },
    // Why You're Special section
    whySpecial: {
      enabled: true,
      eyebrow: 'TIMELESS MEMORIES',
      title: "Things I'll Always Remember About You",
      subtitle: 'A curated tribute to the laughter, protection, and unbreakable loyalty we share.',
      cardStyle: 'deluxe-keepsake',
      accentColor: '#8E1616'
    },
    // Memory Timeline
    timeline: {
      enabled: true,
      eyebrow: 'A TIMELESS CHRONICLE',
      title: 'Our Journey Across The Years',
      subtitle: 'A handcrafted chronicle of the milestones, laughter, and unbreakable bonds we share.',
      threadStyle: 'dual-gold-crimson',
      cardStyle: 'deluxe-gilded-milestone'
    },
    // Sibling Fun / Inside Jokes
    siblingFun: {
      enabled: true,
      eyebrow: 'THE SACRED SIBLING CODE',
      title: 'Inside Jokes & Sibling Superlatives',
      subtitle: 'A celebration of the hilarious chaos, fierce loyalty, and unwritten sibling contracts.',
      cardStyle: 'deluxe-gilded-banter'
    },
    // Surprise Reveal
    surprise: {
      enabled: true,
      tierName: 'deluxe-keepsake-envelope',
      envelopeTone: 'luxury-parchment',
      sealType: 'royal-ruby-gold',
      confettiDensity: 'deluxe-multiburst'
    },
    // Final Rakhi Wish
    finalWish: {
      tierName: 'deluxe-keepsake-wish',
      showGildedBorder: true,
      blessingStyle: 'royal-keepsake'
    },
    // Keepsake Share & QR
    share: {
      tierName: 'deluxe-share',
      showDownloadQr: true,
      showWhatsApp: true
    }
  }
};

/**
 * Helper to safely resolve section config for a given plan
 */
export function getGiftSectionConfig(plan = 'PREMIUM') {
  const normalized = (plan || 'PREMIUM').toUpperCase();
  return GIFT_SECTION_CONFIG[normalized] || GIFT_SECTION_CONFIG.PREMIUM;
}

export default GIFT_SECTION_CONFIG;
