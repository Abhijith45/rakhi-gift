/**
 * Deterministic Layout Presets and Thread Calculation for 2.5D Physical Memory Wall
 * Supports package-aware placements for BASIC (1-4 photos), PREMIUM (5-8 photos), and DELUXE (5-8 photos).
 * Calibrated specifically for authentic corkboard wallpapers across Desktop, Tablet, and Mobile viewports.
 */

import { getWallConfig } from './wallConfig.js';

export const STICKY_NOTES = [
  { text: "Partners in crime ♡", rot: -4.5 },
  { text: "My forever friend ♡", rot: 3.2 },
  { text: "Always have each other ♡", rot: -2.8 },
  { text: "Some bonds are meant to be celebrated forever ♡", rot: 1.5, isQuote: true }
];

/**
 * Desktop Layout Presets (Percentages relative to the wallpaper corkboard container)
 * Calibrated for wide landscape board (16:10 / 16:11 aspect ratio).
 * Keeps safe margin padding inside borders, botanical leaves, wax seals, and decorative corners.
 */
export const DESKTOP_LAYOUTS = {
  1: [
    { top: 25, left: 36.5, rot: -1.5, width: 27, variant: 'classic' }
  ],

  2: [
    { top: 23, left: 20, rot: -2.2, width: 25, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 26, left: 54, rot: 2.0, width: 25, variant: 'classic' }
  ],

  3: [
    { top: 18, left: 16, rot: -2.0, width: 23.5, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 14, left: 58, rot: 1.8, width: 23.5, variant: 'classic' },
    { top: 50, left: 37, rot: -2.2, width: 23.5, variant: 'note', noteText: 'Always have each other ♡', notePos: 'bottom' }
  ],

  4: [
    { top: 18, left: 18, rot: -2.2, width: 22, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 15, left: 56, rot: 2.0, width: 22, variant: 'classic' },
    { top: 50, left: 22, rot: 1.8, width: 22, variant: 'caption' },
    { top: 48, left: 58, rot: -2.0, width: 22, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' }
  ],

  5: [
    { top: 20, left: 14, rot: -2.5, width: 20, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 12, left: 40, rot: 1.8, width: 20, variant: 'classic' },
    { top: 18, left: 66, rot: -2.0, width: 20, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' },
    { top: 52, left: 25, rot: 2.0, width: 20, variant: 'caption' },
    { top: 48, left: 55, rot: -1.8, width: 20, variant: 'caption' }
  ],

  6: [
    { top: 21, left: 13.5, rot: -2.2, width: 19, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 12, left: 40.5, rot: 1.8, width: 19, variant: 'classic' },
    { top: 17, left: 67.5, rot: -1.8, width: 19, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' },
    { top: 52, left: 15.5, rot: 2.0, width: 19, variant: 'caption' },
    { top: 55, left: 41.5, rot: -1.8, width: 19, variant: 'classic' },
    { top: 46, left: 67.5, rot: 2.2, variant: 'caption' }
  ],

  7: [
    { top: 22, left: 13, rot: -2.2, width: 18, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 22.5, left: 33.5, rot: 1.8, width: 18, variant: 'classic' },
    { top: 11, left: 53.5, rot: -1.8, width: 18, variant: 'classic' },
    { top: 18, left: 71, rot: 2.2, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' },
    { top: 50, left: 19, rot: 2.0, width: 18, variant: 'caption' },
    { top: 56, left: 42, rot: -1.8, width: 18, variant: 'classic' },
    { top: 65, left: 65, rot: 2.0, width: 18, variant: 'caption' }
  ],

  8: [
    // Top Row: 4 frames
    { top: 24, left: 13.75, rot: -1.75, width: 17.5, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 24.5, left: 33, rot: 1.8, width: 17.5, variant: 'classic' },
    { top: 11.5, left: 50.5, rot: -1.8, width: 17.5, variant: 'classic' },
    { top: 19.75, left: 69, rot: 2.2, width: 17.5, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' },
    // Bottom Row: 4 frames
    { top: 50, left: 16.5, rot: 2.2, width: 17.5, variant: 'caption' },
    { top: 60.5, left: 34, rot: -1.8, width: 17.5, variant: 'classic' },
    { top: 47, left: 52.5, rot: 2.0, width: 17.5, variant: 'note', noteText: 'My forever friend ♡', notePos: 'bottom' },
    { top: 44, left: 71, rot: -2.2, width: 17.5, variant: 'caption' }
  ]
};

/**
 * Tablet Layout Presets (Percentages calibrated for squarish / portrait tablet corkboards ~0.78 - 0.90 ratio)
 * Provides comfortable breathing room from all 4 borders.
 */
export const TABLET_LAYOUTS = {
  1: [
    { top: 25, left: 27, rot: -1.5, width: 46, variant: 'classic' }
  ],

  2: [
    { top: 18, left: 27, rot: -2.0, width: 46, variant: 'classic' },
    { top: 50, left: 27, rot: 2.0, width: 46, variant: 'classic' }
  ],

  3: [
    { top: 12, left: 29, rot: -1.8, width: 42, variant: 'classic' },
    { top: 46, left: 10, rot: 2.0, width: 38, variant: 'classic' },
    { top: 48, left: 52, rot: -1.8, width: 38, variant: 'classic' }
  ],

  4: [
    { top: 14, left: 11, rot: -2.0, width: 36.5, variant: 'classic' },
    { top: 23.5, left: 52.5, rot: 1.8, width: 36.5, variant: 'classic' },
    { top: 46, left: 26, rot: 5.8, width: 36.5, variant: 'classic' },
    { top: 70.5, left: 30.5, rot: -3.0, width: 36.5, variant: 'classic' }
  ],

  5: [
    { top: 10, left: 11, rot: -2.0, width: 35.5, variant: 'caption' },
    { top: 12.5, left: 53.5, rot: 1.8, width: 35.5, variant: 'classic' },
    { top: 34, left: 32, rot: -1.5, width: 35.5, variant: 'classic' },
    { top: 58, left: 11, rot: 2.0, width: 35.5, variant: 'caption' },
    { top: 60.5, left: 53.5, rot: -1.8, width: 35.5, variant: 'classic' }
  ],

  6: [
    { top: 9, left: 11, rot: -2.0, width: 35.5, variant: 'caption' },
    { top: 11.5, left: 53.5, rot: 1.8, width: 35.5, variant: 'classic' },
    { top: 34, left: 11, rot: 1.8, width: 35.5, variant: 'caption' },
    { top: 36.5, left: 53.5, rot: -1.8, width: 35.5, variant: 'classic' },
    { top: 59, left: 11, rot: -1.8, width: 35.5, variant: 'classic' },
    { top: 61.5, left: 53.5, rot: 2.0, width: 35.5, variant: 'caption' }
  ],

  7: [
    { top: 8, left: 11, rot: -2.0, width: 34.5, variant: 'caption' },
    { top: 10.5, left: 54.5, rot: 1.8, width: 34.5, variant: 'classic' },
    { top: 28, left: 11, rot: 1.8, width: 34.5, variant: 'caption' },
    { top: 30.5, left: 54.5, rot: -1.8, width: 34.5, variant: 'classic' },
    { top: 48, left: 11, rot: -1.8, width: 34.5, variant: 'classic' },
    { top: 50.5, left: 54.5, rot: 2.0, width: 34.5, variant: 'caption' },
    { top: 70.5, left: 32.5, rot: 1.5, width: 34.5, variant: 'caption' }
  ],

  8: [
    // Row 1
    { top: 8, left: 26, rot: -2.0, width: 25, variant: 'caption' },
    { top: 9.5, left: 56.5, rot: 9, width: 25, variant: 'classic' },
    // Row 2
    { top: 30.25, left: 8.5, rot: 1.8, width: 25, variant: 'caption' },
    { top: 30.5, left: 34.5, rot: -1.8, width: 25, variant: 'classic' },
    { top: 32, left: 61, rot: -1.8, width: 25, variant: 'classic' },
    // Row 3
    { top: 52, left: 25, rot: -3.0, width: 25, variant: 'caption' },
    { top: 53.5, left: 54.5, rot: 2.0, width: 25, variant: 'caption' },
    // Row 4
    { top: 73.5, left: 36.5, rot: 3.0, width: 25, variant: 'classic' }
  ]
};

/**
 * Mobile Layout Presets (Percentages calibrated for tall portrait mobile corkboards ~0.50 - 0.56 ratio)
 * Keeps safe margins from borders and leaves ample vertical breathing room.
 */
export const MOBILE_LAYOUTS = {
  1: [
    { top: 25, left: 18, rot: -1.5, width: 64, variant: 'classic' }
  ],

  2: [
    { top: 16, left: 19, rot: -2.0, width: 62, variant: 'classic' },
    { top: 50, left: 19, rot: 2.0, width: 62, variant: 'classic' }
  ],

  3: [
    { top: 12, left: 21, rot: -2.0, width: 58, variant: 'classic' },
    { top: 38, left: 21, rot: 1.8, width: 58, variant: 'classic' },
    { top: 64, left: 21, rot: -1.8, width: 58, variant: 'classic' }
  ],

  4: [
    { top: 8, left: 22, rot: -2.0, width: 40, variant: 'classic' },
    { top: 26.5, left: 44, rot: 2.0, width: 40, variant: 'classic' },
    { top: 45, left: 15.5, rot: 2.0, width: 40, variant: 'classic' },
    { top: 63.5, left: 36, rot: 9.0, width: 40, variant: 'classic' }
  ],

  5: [
    { top: 9, left: 9, rot: -2.0, width: 39, variant: 'caption' },
    { top: 11.5, left: 52, rot: 2.0, width: 39, variant: 'classic' },
    { top: 34, left: 30.5, rot: -1.8, width: 39, variant: 'classic' },
    { top: 57, left: 9, rot: 2.0, width: 39, variant: 'caption' },
    { top: 59.5, left: 52, rot: -2.0, width: 39, variant: 'classic' }
  ],

  6: [
    { top: 8, left: 9, rot: -2.0, width: 39, variant: 'caption' },
    { top: 10.5, left: 52, rot: 2.0, width: 39, variant: 'classic' },
    { top: 33, left: 9, rot: 2.0, width: 39, variant: 'classic' },
    { top: 35.5, left: 52, rot: -1.8, width: 39, variant: 'caption' },
    { top: 58, left: 9, rot: -1.8, width: 39, variant: 'classic' },
    { top: 60.5, left: 52, rot: 2.0, width: 39, variant: 'classic' }
  ],

  7: [
    { top: 7.5, left: 9, rot: -2.0, width: 38, variant: 'caption' },
    { top: 10, left: 53, rot: 2.0, width: 38, variant: 'classic' },
    { top: 26.5, left: 9, rot: 2.0, width: 38, variant: 'classic' },
    { top: 29, left: 53, rot: -1.8, width: 38, variant: 'caption' },
    { top: 45.5, left: 9, rot: -1.8, width: 38, variant: 'classic' },
    { top: 48, left: 53, rot: 2.0, width: 38, variant: 'classic' },
    { top: 65, left: 31, rot: 1.8, width: 38, variant: 'caption' }
  ],

  8: [
    // Row 1
    { top: 7, left: 37, rot: 5.0, width: 28, variant: 'caption' },
    // Row 2
    { top: 23, left: 15, rot: -1.0, width: 28, variant: 'classic' },
    { top: 24.5, left: 49.5, rot: 2.0, width: 28, variant: 'classic' },
    // Row 3
    { top: 39, left: 16, rot: -1.8, width: 28, variant: 'classic' },
    { top: 42.5, left: 51, rot: -1.8, width: 28, variant: 'caption' },
    // Row 4
    { top: 55.75, left: 23, rot: 8.0, width: 28, variant: 'caption' },
    { top: 61.5, left: 55, rot: 5.0, width: 28, variant: 'classic' },
    // Row 5
    { top: 81, left: 37.5, rot: -2.0, width: 28, variant: 'classic' }
  ]
};

/**
 * Curated Thread Connections (Pin to pin paths per photo count, layout, and plan tier)
 */
export const DESKTOP_THREAD_CONNECTIONS = {
  1: [],
  2: [
    [0, 1]
  ],
  3: [
    [0, 1], [0, 2], [1, 2]
  ],
  4: [
    [0, 1], [2, 3], [0, 2], [1, 3], [0, 3]
  ],
  5: [
    [0, 1], [1, 2], [0, 3], [1, 3], [1, 4], [2, 4], [3, 4]
  ],
  6: [
    [0, 1], [1, 2],
    [0, 3], [1, 3], [1, 4], [2, 4], [2, 5],
    [3, 4], [4, 5]
  ],
  7: [
    [0, 1], [1, 2], [2, 3], [0, 4], [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [4, 5], [5, 6]
  ],
  8: [
    [0, 1], [1, 2], [2, 3],
    [0, 4], [1, 4], [1, 5], [2, 5], [2, 6], [3, 6], [3, 7],
    [4, 5], [5, 6], [6, 7]
  ]
};

// 2-Column Vertical Thread Lattice (for Tablet & Mobile 2-column layouts)
export const COLUMN_THREAD_CONNECTIONS = {
  1: [],
  2: [
    [0, 1]
  ],
  3: [
    [0, 1], [0, 2], [1, 2]
  ],
  4: [
    [0, 1], [2, 3], [0, 2], [1, 3], [0, 3], [1, 2]
  ],
  5: [
    [0, 1], [0, 2], [1, 2], [2, 3], [2, 4], [3, 4]
  ],
  6: [
    // Horizontal row links
    [0, 1], [2, 3], [4, 5],
    // Vertical column links
    [0, 2], [1, 3], [2, 4], [3, 5],
    // Cross diagonals
    [0, 3], [1, 2], [2, 5], [3, 4]
  ],
  7: [
    [0, 1], [2, 3], [4, 5],
    [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 6],
    [0, 3], [1, 2], [2, 5], [3, 4]
  ],
  8: [
    // Horizontal row links
    [0, 1], [2, 3], [4, 5], [6, 7],
    // Vertical column links
    [0, 2], [1, 3], [2, 4], [3, 5], [4, 6], [5, 7],
    // Cross diagonals
    [0, 3], [1, 2], [2, 5], [3, 4], [4, 7], [5, 6]
  ]
};

/**
 * Helper to compute positioned photos for a given photo array, viewport, and plan
 */
export function getWallLayout(photos = [], viewport = 'desktop', plan = 'PREMIUM') {
  const config = getWallConfig(plan);
  const permittedPhotos = photos.slice(0, config.maxPhotos);
  const count = permittedPhotos.length;

  if (count === 0) return [];

  const resolvedViewport = typeof viewport === 'string'
    ? viewport
    : (viewport ? 'mobile' : 'desktop');

  const presetKey = Math.min(8, Math.max(1, count));
  let preset;
  if (resolvedViewport === 'mobile') {
    preset = MOBILE_LAYOUTS[presetKey] || MOBILE_LAYOUTS[8];
  } else if (resolvedViewport === 'tablet') {
    preset = TABLET_LAYOUTS[presetKey] || TABLET_LAYOUTS[8];
  } else {
    preset = DESKTOP_LAYOUTS[presetKey] || DESKTOP_LAYOUTS[8];
  }

  return permittedPhotos.map((p, idx) => {
    const layoutConfig = preset[idx % preset.length];

    // Resolve variant based on plan entitlements
    let variant = 'classic';
    if (config.allowedVariants.includes('caption') && (p.frameVariant === 'caption' || layoutConfig.variant === 'caption' || p.caption)) {
      variant = 'caption';
    } else if (config.allowedVariants.includes('note') && (p.frameVariant === 'note' || layoutConfig.variant === 'note')) {
      variant = 'note';
    }

    // Force classic variant if Basic plan
    if (config.plan === 'BASIC') {
      variant = 'classic';
    }

    return {
      ...p,
      top: layoutConfig.top,
      left: layoutConfig.left,
      rot: layoutConfig.rot,
      width: layoutConfig.width,
      variant,
      noteText: variant === 'note' ? (p.noteText || layoutConfig.noteText) : null,
      notePos: layoutConfig.notePos || 'left',
      caption: config.plan === 'BASIC' ? null : (p.caption || (variant === 'caption' ? p.title : null))
    };
  });
}

/**
 * Returns thread pairings for the photo list, plan tier, and viewport
 */
export function getThreadConnections(photoCount = 8, plan = 'PREMIUM', viewport = 'desktop') {
  const normalizedPlan = (plan || 'PREMIUM').toUpperCase();
  const count = Math.min(8, Math.max(0, photoCount));

  if (count <= 1) return [];

  const resolvedViewport = typeof viewport === 'string'
    ? viewport
    : (viewport ? 'mobile' : 'desktop');

  if (resolvedViewport === 'desktop') {
    return DESKTOP_THREAD_CONNECTIONS[count] || DESKTOP_THREAD_CONNECTIONS[8];
  }

  return COLUMN_THREAD_CONNECTIONS[count] || COLUMN_THREAD_CONNECTIONS[8];
}

export default {
  DESKTOP_LAYOUTS,
  TABLET_LAYOUTS,
  MOBILE_LAYOUTS,
  getWallLayout,
  getThreadConnections
};
