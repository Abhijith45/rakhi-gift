import { useMemo } from 'react';
import { getThemeConfig, getThemeCssVariables, validateTheme } from '../config/themeConfig.js';

/**
 * Custom hook to resolve and consume theme configuration & CSS variables
 * @param {string} rawThemeId - The theme identifier (e.g. 'warm-memory', 'playful-childhood')
 * @returns {{ themeId: string, theme: object, cssVariables: object }}
 */
export function useGiftTheme(rawThemeId) {
  const themeId = useMemo(() => validateTheme(rawThemeId), [rawThemeId]);
  const theme = useMemo(() => getThemeConfig(themeId), [themeId]);
  const cssVariables = useMemo(() => getThemeCssVariables(themeId), [themeId]);

  return {
    themeId,
    theme,
    cssVariables
  };
}

export default useGiftTheme;
