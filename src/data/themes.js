/**
 * Product-Approved Data-Driven Visual Themes for Personalized Rakhi Gifts
 */

export const themes = [
  {
    id: "warm-memory",
    name: "Warm Memory",
    badge: "Signature Default",
    description: "Warm ivory canvas, gentle golden accents, and sacred crimson thread.",
    palette: {
      bgPrimary: "#FAF7F2",
      bgSurface: "#FFFDF9",
      bgCanvas: "#F5EFEB",
      accent: "#9B2226",
      gold: "#C69234",
      textPrimary: "#1E1B18",
      textSecondary: "#59524C",
      border: "#E5D9C8"
    },
    threadColor: "#A3242A",
    pinColor: "#D4AF37",
    fontFamily: "'Playfair Display', Georgia, serif"
  },
  {
    id: "playful-childhood",
    name: "Playful Childhood",
    badge: "Nostalgic & Bright",
    description: "Vibrant coral tones, cheerful highlights, and warm scrapbook energy.",
    palette: {
      bgPrimary: "#FFF9F5",
      bgSurface: "#FFFFFF",
      bgCanvas: "#FCEEE5",
      accent: "#D9532F",
      gold: "#E09F3E",
      textPrimary: "#261914",
      textSecondary: "#634D44",
      border: "#F5D8C7"
    },
    threadColor: "#E04828",
    pinColor: "#E09F3E",
    fontFamily: "'Playfair Display', Georgia, serif"
  },
  {
    id: "elegant-minimal",
    name: "Elegant Minimal",
    badge: "Modern & Clean",
    description: "Subtle sandstone, refined brass details, and clean editorial borders.",
    palette: {
      bgPrimary: "#F8F6F0",
      bgSurface: "#FCFBF8",
      bgCanvas: "#EFECE4",
      accent: "#6B2D3A",
      gold: "#B58A3E",
      textPrimary: "#1A1918",
      textSecondary: "#5C5954",
      border: "#DFDACF"
    },
    threadColor: "#823342",
    pinColor: "#C29B48",
    fontFamily: "'Playfair Display', Georgia, serif"
  },
  {
    id: "traditional-rakhi",
    name: "Traditional Rakhi",
    badge: "Festive & Regal",
    description: "Deep auspicious crimson, rich antique gold, and heritage festive warmth.",
    palette: {
      bgPrimary: "#FDF5F2",
      bgSurface: "#FFF9F7",
      bgCanvas: "#F7E6E0",
      accent: "#8B1E22",
      gold: "#D4AF37",
      textPrimary: "#1F1415",
      textSecondary: "#5C4648",
      border: "#EACDC5"
    },
    threadColor: "#941B1F",
    pinColor: "#D4AF37",
    fontFamily: "'Playfair Display', Georgia, serif"
  }
];

export const getThemeById = (id = 'warm-memory') => {
  return themes.find((t) => t.id === id) || themes[0];
};

export default themes;
