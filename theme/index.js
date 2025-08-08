// Theme configuration for Puzz game
// Pastel color palette with playful, kid-friendly design

export const colors = {
  // Primary Pastel Colors
  primary: "#FFB3E6", // Pastel Pink
  secondary: "#B3E5FF", // Pastel Blue
  accent: "#FFFFB3", // Pastel Yellow
  success: "#B3FFB3", // Pastel Green
  warning: "#FFD9B3", // Pastel Orange
  error: "#FFB3B3", // Pastel Red

  // Background Colors
  background: "#F5F0FF", // Very Light Lavender
  surface: "#FFFFFF", // Pure White
  cardBackground: "#FAFAFA", // Very Light Gray

  // Text Colors
  text: "#4A4A4A", // Soft Dark Gray
  textLight: "#8A8A8A", // Light Gray
  textWhite: "#FFFFFF", // White for dark backgrounds

  // Game-specific Colors
  tileBackground: "#FFFFFF",
  tileBorder: "#E0E0E0",
  emptySlot: "#F0F0F0",

  // Star and UI element colors
  starActive: "#FFD700", // Gold for active stars
  starInactive: "#DDD", // Gray for inactive stars
  lockOverlay: "rgba(0,0,0,0.4)", // Semi-transparent overlay

  // Effect colors for animations and special effects
  glowYellow: "rgba(255, 255, 179, 0.4)",
  glowPink: "rgba(255, 179, 230, 0.3)",
  borderYellow: "rgba(255, 255, 179, 0.4)",
  borderPink: "rgba(255, 179, 230, 0.5)",
  sparkle: "rgba(255, 255, 255, 0.1)",

  // Level Difficulty Colors (softened)
  easy: "#B3FFB3", // Pastel Green
  medium: "#FFD9B3", // Pastel Orange
  hard: "#FFB3B3", // Pastel Red
  expert: "#E6B3FF", // Pastel Purple

  // Status Colors
  locked: "#E0E0E0",
  unlocked: "#B3E5FF",
  completed: "#B3FFB3",

  // Toggle and Interactive States
  inactive: "#CCCCCC", // Gray for inactive toggles
};

export const typography = {
  // Using Fredoka One for a playful, kid-friendly look
  fontFamily: {
    regular: "FredokaOne_400Regular",
    bold: "FredokaOne_400Regular", // Fredoka One only comes in one weight
    // Fallback to system fonts if Fredoka One fails to load
    fallback: "System",
  },

  sizes: {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 24,
    xxl: 32,
    jumbo: 48,
  },

  weights: {
    regular: "400",
    medium: "500",
    semibold: "600",
    bold: "700",
    extrabold: "800",
  },
};

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const borderRadius = {
  sm: 4,
  md: 8,
  lg: 12,
  xl: 16,
  full: 999,
};

export const shadows = {
  sm: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  md: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 4,
  },
  lg: {
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 8,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
};
