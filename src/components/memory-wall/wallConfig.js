/**
 * Package-Aware Configuration for 2.5D Physical Memory Wall
 * Defines visual tokens, entitlements, thread densities, and aesthetic differences
 * between BASIC (₹99), PREMIUM (₹249), and DELUXE (₹449).
 */

export const WALL_CONFIG = {
  BASIC: {
    plan: 'BASIC',
    name: 'Basic Keepsake',
    badgeText: 'Classic Memory Keepsake',
    title: 'Our Memory Wall',
    subtitle: 'A sweet collection of cherished moments, connected forever.',
    maxPhotos: 4,
    allowedVariants: ['classic'],
    captionStyle: 'none',
    threadDensity: 'light',
    threadColor: '#9B2226',
    threadOpacity: 0.8,
    threadWidth: 0.26,
    threadGlow: false,
    wallTheme: 'basic',
    frameShadow: 'basic',
    pinStyle: 'classic-brass',
    decorations: 'minimal',
    animationLevel: 'basic',
    showDecorativeCard: false,
    emptyMessage: 'Add up to 4 photos to complete your memory wall.'
  },

  PREMIUM: {
    plan: 'PREMIUM',
    name: 'Premium Memory Wall',
    badgeText: 'Interactive Memory Wall — Connected with sacred thread',
    title: 'Memories that last forever',
    subtitle: 'Hover or tap any photo frame to explore our cherished moments.',
    maxPhotos: 8,
    allowedVariants: ['classic', 'caption', 'note'],
    captionStyle: 'editorial',
    threadDensity: 'medium',
    threadColor: '#9B2226',
    threadOpacity: 0.9,
    threadWidth: 0.29,
    threadGlow: false,
    wallTheme: 'premium',
    frameShadow: 'rich',
    pinStyle: 'gold-dome',
    decorations: 'rich',
    animationLevel: 'enhanced',
    showDecorativeCard: true,
    emptyMessage: 'Add up to 8 photos with captions and sticky notes.'
  },

  DELUXE: {
    plan: 'DELUXE',
    name: 'Deluxe Keepsake Wall',
    badgeText: 'Deluxe Keepsake Wall — Handcrafted digital tribute',
    title: 'Our Keepsake Wall',
    subtitle: 'An intimate visual tribute of our unforgettable journey together.',
    maxPhotos: 8,
    allowedVariants: ['classic', 'caption', 'note'],
    captionStyle: 'premium',
    threadDensity: 'rich',
    threadColor: '#841519',
    threadOpacity: 0.96,
    threadWidth: 0.33,
    threadGlow: true,
    wallTheme: 'deluxe',
    frameShadow: 'deluxe',
    pinStyle: 'jeweled-brass',
    decorations: 'premium',
    animationLevel: 'premium',
    showDecorativeCard: true,
    emptyMessage: 'Add up to 8 photos for an exquisite handcrafted keepsake wall.'
  }
};

/**
 * Helper to normalize and resolve plan config safely
 */
export function getWallConfig(plan = 'PREMIUM') {
  const normalized = (plan || 'PREMIUM').toUpperCase();
  return WALL_CONFIG[normalized] || WALL_CONFIG.PREMIUM;
}

export default WALL_CONFIG;
