/**
 * Unified Theme Engine Configuration for Personalized Rakhi Gift
 * Defines the complete visual identity, color tokens, typography,
 * wall styles, frames, pins, and threads for all 4 themes.
 */

export const THEMES = {
  WARM_MEMORY: 'warm-memory',
  PLAYFUL_CHILDHOOD: 'playful-childhood',
  ELEGANT_MINIMAL: 'elegant-minimal',
  TRADITIONAL_RAKHI: 'traditional-rakhi'
};

export const ALLOWED_THEME_IDS = Object.values(THEMES);

export const THEME_CONFIG = {
  [THEMES.WARM_MEMORY]: {
    id: THEMES.WARM_MEMORY,
    name: 'Warm Memory',
    badge: 'Signature Default',
    tagline: 'Cozy, nostalgic, handcrafted family memories',
    description: 'Warm ivory canvas, gentle golden accents, and sacred crimson thread.',
    fonts: {
      heading: "'Playfair Display', Georgia, serif",
      body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      accent: "'Playfair Display', Georgia, italic",
      fontFamily: "'Playfair Display', Georgia, serif"
    },
    colors: {
      bgPrimary: '#FAF7F2',
      bgSurface: '#FFFDF9',
      bgCanvas: '#F5EFEB',
      bgCard: '#FFFDF9',
      bgElevated: '#FFFFFF',
      textPrimary: '#1E1B18',
      textSecondary: '#59524C',
      textMuted: '#8C827A',
      accent: '#9B2226',
      accentHover: '#7D1B1E',
      accentLight: '#FBF0EF',
      accentMuted: 'rgba(155, 34, 38, 0.08)',
      accentSecondary: '#D96B43',
      gold: '#C69234',
      goldLight: '#FDF6E2',
      goldDark: '#8F6517',
      goldMuted: 'rgba(198, 146, 52, 0.12)',
      border: '#E5D9C8',
      borderSubtle: '#EFE6D8',
      borderGold: '#D4AF37',
      shadowTone: 'rgba(45, 30, 15, 0.08)',
      cardShadow: '0 8px 24px -4px rgba(45, 30, 15, 0.08), 0 2px 6px -1px rgba(45, 30, 15, 0.04)'
    },
    wall: {
      threadColor: '#A3242A',
      threadGlow: 'rgba(163, 36, 42, 0.45)',
      pinColor: '#D4AF37',
      pinHighlight: '#FFF8C6',
      frameBg: '#FFFDF9',
      frameBorder: '#E5D9C8',
      wallOverlayTone: 'rgba(250, 247, 242, 0.02)'
    },
    decorations: {
      sealBg: 'linear-gradient(135deg, #B5282D 0%, #83181B 100%)',
      sealBorder: '#D4AF37',
      sealText: '#FFFDF9',
      tagBg: '#FBF0EF',
      tagColor: '#9B2226',
      tagBorder: 'rgba(155, 34, 38, 0.15)',
      accentGlow: 'rgba(155, 34, 38, 0.15)',
      pattern: 'warm-paper'
    }
  },

  [THEMES.PLAYFUL_CHILDHOOD]: {
    id: THEMES.PLAYFUL_CHILDHOOD,
    name: 'Playful Childhood',
    badge: 'Nostalgic & Bright',
    tagline: 'Shared childhood memories, laughter, and inside jokes',
    description: 'Vibrant coral tones, cheerful highlights, and warm scrapbook energy.',
    fonts: {
      heading: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      accent: "'Outfit', 'Plus Jakarta Sans', sans-serif",
      fontFamily: "'Outfit', sans-serif"
    },
    colors: {
      bgPrimary: '#FFF9F5',
      bgSurface: '#FFFFFF',
      bgCanvas: '#FCEEE5',
      bgCard: '#FFFFFF',
      bgElevated: '#FFFFFF',
      textPrimary: '#261914',
      textSecondary: '#634D44',
      textMuted: '#947B72',
      accent: '#D9532F',
      accentHover: '#BA3E1C',
      accentLight: '#FFF0EA',
      accentMuted: 'rgba(217, 83, 47, 0.08)',
      accentSecondary: '#2A8F94',
      gold: '#E09F3E',
      goldLight: '#FFF4DE',
      goldDark: '#996312',
      goldMuted: 'rgba(224, 159, 62, 0.14)',
      border: '#F5D8C7',
      borderSubtle: '#FAECE3',
      borderGold: '#E09F3E',
      shadowTone: 'rgba(55, 30, 20, 0.07)',
      cardShadow: '0 8px 24px -4px rgba(60, 30, 15, 0.08), 0 2px 8px -1px rgba(60, 30, 15, 0.04)'
    },
    wall: {
      threadColor: '#E04828',
      threadGlow: 'rgba(224, 72, 40, 0.5)',
      pinColor: '#E09F3E',
      pinHighlight: '#FFE7B3',
      frameBg: '#FFFFFF',
      frameBorder: '#F2D2BF',
      wallOverlayTone: 'rgba(255, 245, 238, 0.05)'
    },
    decorations: {
      sealBg: 'linear-gradient(135deg, #E65A35 0%, #BD3B17 100%)',
      sealBorder: '#E09F3E',
      sealText: '#FFFFFF',
      tagBg: '#FFF0EA',
      tagColor: '#D9532F',
      tagBorder: 'rgba(217, 83, 47, 0.18)',
      accentGlow: 'rgba(217, 83, 47, 0.18)',
      pattern: 'playful-dots'
    }
  },

  [THEMES.ELEGANT_MINIMAL]: {
    id: THEMES.ELEGANT_MINIMAL,
    name: 'Elegant Minimal',
    badge: 'Modern & Clean',
    tagline: 'Quiet, sophisticated, and timeless editorial luxury',
    description: 'Subtle sandstone, refined brass details, and clean editorial borders.',
    fonts: {
      heading: "'Cinzel', Georgia, serif",
      body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      accent: "'Cinzel', Georgia, serif",
      fontFamily: "'Cinzel', Georgia, serif"
    },
    colors: {
      bgPrimary: '#F8F6F0',
      bgSurface: '#FCFBF8',
      bgCanvas: '#EFECE4',
      bgCard: '#FCFBF8',
      bgElevated: '#FFFFFF',
      textPrimary: '#171615',
      textSecondary: '#5C5954',
      textMuted: '#8A8680',
      accent: '#6B2D3A',
      accentHover: '#521F2A',
      accentLight: '#F5ECEE',
      accentMuted: 'rgba(107, 45, 58, 0.08)',
      accentSecondary: '#4A5568',
      gold: '#B58A3E',
      goldLight: '#F7F1E4',
      goldDark: '#78571F',
      goldMuted: 'rgba(181, 138, 62, 0.12)',
      border: '#DFDACF',
      borderSubtle: '#EBE7DE',
      borderGold: '#C29B48',
      shadowTone: 'rgba(25, 25, 24, 0.06)',
      cardShadow: '0 8px 24px -4px rgba(25, 25, 24, 0.06), 0 2px 6px -1px rgba(25, 25, 24, 0.03)'
    },
    wall: {
      threadColor: '#7A2E3D',
      threadGlow: 'rgba(122, 46, 61, 0.4)',
      pinColor: '#C29B48',
      pinHighlight: '#F5E6BE',
      frameBg: '#FCFBF8',
      frameBorder: '#DFDACF',
      wallOverlayTone: 'rgba(240, 238, 232, 0.04)'
    },
    decorations: {
      sealBg: 'linear-gradient(135deg, #7A2E3D 0%, #4D1A24 100%)',
      sealBorder: '#C29B48',
      sealText: '#FCFBF8',
      tagBg: '#F5ECEE',
      tagColor: '#6B2D3A',
      tagBorder: 'rgba(107, 45, 58, 0.15)',
      accentGlow: 'rgba(107, 45, 58, 0.12)',
      pattern: 'clean-sand'
    }
  },

  [THEMES.TRADITIONAL_RAKHI]: {
    id: THEMES.TRADITIONAL_RAKHI,
    name: 'Traditional Rakhi',
    badge: 'Festive & Regal',
    tagline: 'Traditional Indian warmth with modern regal execution',
    description: 'Deep auspicious crimson, rich antique gold, and heritage festive warmth.',
    fonts: {
      heading: "'Marcellus', 'Playfair Display', serif",
      body: "'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, sans-serif",
      accent: "'Marcellus', 'Playfair Display', serif",
      fontFamily: "'Marcellus', serif"
    },
    colors: {
      bgPrimary: '#FDF5F2',
      bgSurface: '#FFF9F7',
      bgCanvas: '#F7E6E0',
      bgCard: '#FFF9F7',
      bgElevated: '#FFFFFF',
      textPrimary: '#1F1415',
      textSecondary: '#5C4648',
      textMuted: '#8F7578',
      accent: '#8B1E22',
      accentHover: '#6E1417',
      accentLight: '#FAEBE9',
      accentMuted: 'rgba(139, 30, 34, 0.09)',
      accentSecondary: '#D9602B',
      gold: '#D4AF37',
      goldLight: '#FCF7E6',
      goldDark: '#8F7118',
      goldMuted: 'rgba(212, 175, 55, 0.15)',
      border: '#EACDC5',
      borderSubtle: '#F4DDD6',
      borderGold: '#D4AF37',
      shadowTone: 'rgba(45, 20, 22, 0.08)',
      cardShadow: '0 8px 24px -4px rgba(45, 20, 22, 0.09), 0 2px 6px -1px rgba(45, 20, 22, 0.04)'
    },
    wall: {
      threadColor: '#941B1F',
      threadGlow: 'rgba(148, 27, 31, 0.55)',
      pinColor: '#D4AF37',
      pinHighlight: '#FFF5BD',
      frameBg: '#FFF9F7',
      frameBorder: '#EACDC5',
      wallOverlayTone: 'rgba(253, 245, 242, 0.04)'
    },
    decorations: {
      sealBg: 'linear-gradient(135deg, #A12227 0%, #6E1215 100%)',
      sealBorder: '#D4AF37',
      sealText: '#FFFDF9',
      tagBg: '#FAEBE9',
      tagColor: '#8B1E22',
      tagBorder: 'rgba(139, 30, 34, 0.2)',
      accentGlow: 'rgba(139, 30, 34, 0.2)',
      pattern: 'regal-warm'
    }
  }
};

/**
 * Validate and sanitize theme identifier
 */
export const validateTheme = (themeId) => {
  if (themeId && ALLOWED_THEME_IDS.includes(themeId)) {
    return themeId;
  }
  return THEMES.WARM_MEMORY;
};

/**
 * Get full theme configuration object with safe fallback
 */
export const getThemeConfig = (themeId) => {
  const validId = validateTheme(themeId);
  return THEME_CONFIG[validId] || THEME_CONFIG[THEMES.WARM_MEMORY];
};

/**
 * Generate complete CSS variables dictionary for a given theme
 */
export const getThemeCssVariables = (themeId) => {
  const theme = getThemeConfig(themeId);
  const { colors, fonts, wall, decorations } = theme;

  return {
    '--gift-bg': colors.bgPrimary,
    '--gift-surface': colors.bgSurface,
    '--gift-canvas': colors.bgCanvas,
    '--gift-card': colors.bgCard,
    '--gift-elevated': colors.bgElevated,
    '--gift-text': colors.textPrimary,
    '--gift-text-secondary': colors.textSecondary,
    '--gift-text-muted': colors.textMuted,
    '--gift-accent': colors.accent,
    '--gift-accent-hover': colors.accentHover,
    '--gift-accent-light': colors.accentLight,
    '--gift-accent-muted': colors.accentMuted,
    '--gift-accent-secondary': colors.accentSecondary,
    '--gift-gold': colors.gold,
    '--gift-gold-light': colors.goldLight,
    '--gift-gold-dark': colors.goldDark,
    '--gift-gold-muted': colors.goldMuted,
    '--gift-border': colors.border,
    '--gift-border-subtle': colors.borderSubtle,
    '--gift-border-gold': colors.borderGold,
    '--gift-shadow-tone': colors.shadowTone,
    '--gift-card-shadow': colors.cardShadow,

    '--gift-font-heading': fonts.heading,
    '--gift-font-body': fonts.body,
    '--gift-font-accent': fonts.accent,

    '--gift-thread': wall.threadColor,
    '--gift-thread-glow': wall.threadGlow,
    '--gift-pin': wall.pinColor,
    '--gift-pin-highlight': wall.pinHighlight,
    '--gift-frame-bg': wall.frameBg,
    '--gift-frame-border': wall.frameBorder,

    '--gift-seal-bg': decorations.sealBg,
    '--gift-seal-border': decorations.sealBorder,
    '--gift-seal-text': decorations.sealText,
    '--gift-tag-bg': decorations.tagBg,
    '--gift-tag-color': decorations.tagColor,
    '--gift-tag-border': decorations.tagBorder,
    '--gift-accent-glow': decorations.accentGlow,

    // Legacy backwards-compatibility variables
    '--bg-primary': colors.bgPrimary,
    '--bg-surface': colors.bgSurface,
    '--color-rakhi-red': colors.accent,
    '--color-gold': colors.gold,
    '--text-primary': colors.textPrimary,
    '--text-secondary': colors.textSecondary,
    '--font-serif': fonts.heading,
    '--font-sans': fonts.body
  };
};

/**
 * Array of themes for UI pickers and selectors
 */
export const themeList = Object.values(THEME_CONFIG);

export default THEME_CONFIG;
