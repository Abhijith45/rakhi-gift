/**
 * Central Package & Entitlements Configuration
 * Single source of truth for Basic (₹99), Premium (₹249), and Deluxe (₹449) plans.
 */

export const PLAN_CONFIG = {
  BASIC: {
    id: 'BASIC',
    name: 'Basic Keepsake',
    price: 99,
    formattedPrice: '₹99',
    tagline: 'A beautiful Rakhi memory gift with 4 photos, Memory Wall & personalized letter.',
    maxPhotos: 4,
    captions: false,
    reasons: false,
    timeline: false,
    siblingFun: false,
    availableThemes: ['warm-memory'],
    defaultTheme: 'warm-memory',
    revealLevel: 'basic',
    finalWishLevel: 'basic',
    popular: false,
    badge: null
  },

  PREMIUM: {
    id: 'PREMIUM',
    name: 'Premium Memory',
    price: 249,
    formattedPrice: '₹249',
    tagline: 'A complete personalized Rakhi experience — 8 photos, captions, reasons, timeline & banter.',
    maxPhotos: 8,
    captions: true,
    reasons: true,
    timeline: true,
    siblingFun: true,
    availableThemes: ['warm-memory', 'playful-childhood', 'elegant-minimal', 'traditional-rakhi'],
    defaultTheme: 'warm-memory',
    revealLevel: 'premium',
    finalWishLevel: 'premium',
    popular: true,
    badge: 'Most Popular'
  },

  DELUXE: {
    id: 'DELUXE',
    name: 'Deluxe Keepsake',
    price: 449,
    formattedPrice: '₹449',
    tagline: 'A crafted digital keepsake with luxury gold aesthetics, jeweled pins & multi-burst reveal.',
    maxPhotos: 8,
    captions: true,
    reasons: true,
    timeline: true,
    siblingFun: true,
    availableThemes: ['warm-memory', 'playful-childhood', 'elegant-minimal', 'traditional-rakhi'],
    defaultTheme: 'warm-memory',
    revealLevel: 'deluxe',
    finalWishLevel: 'deluxe',
    popular: false,
    badge: 'Deluxe Keepsake'
  }
};

/**
 * Returns plan configuration object for a given plan ID
 */
export const getPlanConfig = (planKey = 'PREMIUM') => {
  const normalized = (planKey || 'PREMIUM').toUpperCase();
  return PLAN_CONFIG[normalized] || PLAN_CONFIG.PREMIUM;
};

/**
 * Checks whether a theme ID is allowed under the specified plan tier
 */
export const isThemeAllowedForPlan = (themeId, planKey = 'PREMIUM') => {
  const config = getPlanConfig(planKey);
  return config.availableThemes.includes(themeId);
};

export default PLAN_CONFIG;
