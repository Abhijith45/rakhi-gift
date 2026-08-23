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
    tagline: 'A sweet digital card with 4 mounted photos & personalized Rakhi message.',
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
    tagline: 'Our most loved gift — 8 photos, captions, reasons, timeline & inside jokes.',
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
    tagline: 'The ultimate hamper — rich 2.5D visual treatment, jeweled tacks & gold trims.',
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
    badge: 'Deluxe Hamper'
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
