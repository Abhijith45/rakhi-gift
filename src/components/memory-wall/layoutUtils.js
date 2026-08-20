/**
 * Deterministic Layout Presets and Thread Calculation for 2.5D Physical Memory Wall
 * Calibrated for distinct non-overlapping photo placement, refined sticky notes, and organic spacing.
 */

export const STICKY_NOTES = [
  { text: "Partners in crime ♡", rot: -4.5 },
  { text: "My forever friend ♡", rot: 3.2 },
  { text: "Always have each other ♡", rot: -2.8 },
  { text: "Some bonds are meant to be celebrated forever ♡", rot: 1.5, isQuote: true }
];

/**
 * Desktop Layout Presets (Percentages relative to the wire grid container)
 * Designed with smaller frame widths (16-19%) to ensure zero overlapping.
 */
export const DESKTOP_LAYOUTS = {
  // 6 Photos Layout (3 top, 3 bottom - well spaced)
  6: [
    { top: 10, left: 8, rot: -3.0, width: 19, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 12, left: 40, rot: 2.0, width: 19.5, variant: 'classic' },
    { top: 9, left: 72, rot: -2.2, width: 18.5, variant: 'classic' },
    { top: 52, left: 10, rot: 2.5, width: 19, variant: 'caption' },
    { top: 54, left: 41, rot: -2.0, width: 19.5, variant: 'classic' },
    { top: 50, left: 72, rot: 2.8, width: 18.5, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' }
  ],
  // 8 Photos Layout (Matches the Reference Composition precisely)
  8: [
    // Top Row: 4 frames nicely spaced
    { top: 7, left: 4, rot: -3.0, width: 18.5, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 12, left: 28, rot: 2.2, width: 18.5, variant: 'classic' },
    { top: 8, left: 52, rot: -1.8, width: 18.5, variant: 'classic' },
    { top: 6, left: 76, rot: 3.0, width: 18, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' },
    // Bottom Row: 4 frames distinctly separated, leaving generous open center for quote
    { top: 50, left: 5, rot: 2.8, width: 18, variant: 'caption' },
    { top: 48, left: 26, rot: -2.0, width: 18, variant: 'classic' },
    { top: 46, left: 57, rot: 2.4, width: 18, variant: 'note', noteText: 'My forever friend ♡', notePos: 'bottom' },
    { top: 52, left: 78, rot: -2.5, width: 17.5, variant: 'caption' }
  ],
  // 10 Photos Layout
  10: [
    { top: 6, left: 3, rot: -2.8, width: 16.5, variant: 'note', noteText: 'Partners in crime ♡', notePos: 'left' },
    { top: 9, left: 22, rot: 1.8, width: 16.5, variant: 'classic' },
    { top: 5, left: 43, rot: -2.0, width: 17, variant: 'classic' },
    { top: 8, left: 63, rot: 2.5, width: 16.5, variant: 'classic' },
    { top: 5, left: 81, rot: -2.5, width: 16, variant: 'note', noteText: 'Always have each other ♡', notePos: 'right' },
    { top: 48, left: 4, rot: 2.4, width: 16.5, variant: 'caption' },
    { top: 46, left: 24, rot: -1.5, width: 16.5, variant: 'classic' },
    { top: 47, left: 44, rot: 2.0, width: 16.5, variant: 'note', noteText: 'My forever friend ♡', notePos: 'bottom' },
    { top: 45, left: 64, rot: -2.2, width: 16.5, variant: 'caption' },
    { top: 49, left: 81, rot: 1.8, width: 16, variant: 'caption' }
  ]
};

/**
 * Mobile Layout Presets (Percentages for 2-column organic staggered composition)
 */
export const MOBILE_LAYOUTS = {
  default: (index, total) => {
    const isLeft = index % 2 === 0;
    const row = Math.floor(index / 2);
    const rowHeight = 88 / Math.ceil(total / 2);

    const baseTop = 4 + row * rowHeight + (isLeft ? 0 : 3);
    const baseLeft = isLeft ? 5 : 52;
    const rot = (isLeft ? -1 : 1) * (1.5 + (index % 3) * 0.6);

    return {
      top: baseTop,
      left: baseLeft,
      rot,
      width: 43,
      variant: index === 0 || index === 3 ? 'caption' : 'classic'
    };
  }
};

/**
 * Curated Thread Connections (Pin to pin paths inspired by the reference)
 */
export const DEFAULT_THREAD_CONNECTIONS = {
  6: [
    [0, 1], [1, 2], [0, 3], [1, 4], [2, 5], [3, 4], [4, 5]
  ],
  8: [
    [0, 1], [1, 2], [2, 3], [0, 4], [1, 5], [2, 6], [3, 7], [4, 5], [5, 6], [6, 7], [1, 6], [2, 5]
  ],
  10: [
    [0, 1], [1, 2], [2, 3], [3, 4], [0, 5], [1, 6], [2, 7], [3, 8], [4, 9], [5, 6], [6, 7], [7, 8], [8, 9]
  ]
};

/**
 * Helper to get layout for a specific photo array
 */
export function getWallLayout(photos = [], isMobile = false) {
  const count = photos.length;

  if (isMobile) {
    return photos.map((p, idx) => {
      const pos = MOBILE_LAYOUTS.default(idx, count);
      return {
        ...p,
        ...pos,
        caption: p.caption || (pos.variant === 'caption' ? p.title : null)
      };
    });
  }

  // Select closest desktop layout
  let preset = DESKTOP_LAYOUTS[8];
  if (count <= 6) preset = DESKTOP_LAYOUTS[6];
  else if (count >= 10) preset = DESKTOP_LAYOUTS[10];

  return photos.map((p, idx) => {
    const layoutConfig = preset[idx % preset.length];
    return {
      ...p,
      top: layoutConfig.top,
      left: layoutConfig.left,
      rot: layoutConfig.rot,
      width: layoutConfig.width,
      variant: p.frameVariant || layoutConfig.variant || (p.caption ? 'caption' : 'classic'),
      noteText: p.noteText || layoutConfig.noteText,
      notePos: layoutConfig.notePos || 'left',
      caption: p.caption || (layoutConfig.variant === 'caption' ? p.title : null)
    };
  });
}

/**
 * Returns thread pairings for the photo list
 */
export function getThreadConnections(photoCount = 8) {
  if (photoCount <= 6) return DEFAULT_THREAD_CONNECTIONS[6];
  if (photoCount <= 8) return DEFAULT_THREAD_CONNECTIONS[8];
  return DEFAULT_THREAD_CONNECTIONS[10];
}
