/**
 * Re-export themes and theme helpers from centralized config
 */
import { THEME_CONFIG, getThemeConfig, themeList, validateTheme } from '../config/themeConfig.js';

export const themes = themeList.map((t) => ({
  id: t.id,
  name: t.name,
  badge: t.badge,
  tagline: t.tagline,
  description: t.description,
  palette: {
    bgPrimary: t.colors.bgPrimary,
    bgSurface: t.colors.bgSurface,
    bgCanvas: t.colors.bgCanvas,
    accent: t.colors.accent,
    gold: t.colors.gold,
    textPrimary: t.colors.textPrimary,
    textSecondary: t.colors.textSecondary,
    border: t.colors.border
  },
  threadColor: t.wall.threadColor,
  pinColor: t.wall.pinColor,
  fontFamily: t.fonts.heading
}));

export const getThemeById = (id = 'warm-memory') => {
  return themes.find((t) => t.id === validateTheme(id)) || themes[0];
};

export { THEME_CONFIG, getThemeConfig, validateTheme };

export default themes;
