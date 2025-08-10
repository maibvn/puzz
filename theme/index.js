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
  textSecondary: "#8A8A8A", // Light Gray (alias for consistency)
  textWhite: "#FFFFFF", // White for dark backgrounds

  // Header Colors
  headerBackground: "#008B8B", // Deep Teal
  headerText: "#FFFFFF", // White text for headers
  headerButtonBg: "#FF6B6B", // Red background for header buttons

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

  // Status Colors
  locked: "#E0E0E0",
  unlocked: "#B3E5FF",
  completed: "#B3FFB3",

  // Toggle and Interactive States
  inactive: "#CCCCCC", // Gray for inactive toggles

  // Bright icon colors for enhanced visibility
  iconBright: {
    home: "#FF6B9D", // Bright pink for home
    settings: "#4ECDC4", // Bright teal for settings
    collection: "#45B7D1", // Bright blue for collection
    refresh: "#96CEB4", // Bright mint for refresh
    images: "#FECA57", // Bright yellow for images
    close: "#FF9FF3", // Bright magenta for close
    diamond: "#FFD93D", // Bright gold for diamond
    trophy: "#F8B500", // Bright orange-gold for trophy
    star: "#FF6B6B", // Bright coral for star
    rarity: {
      common: "#A8E6CF", // Bright mint green
      rare: "#88D8C0", // Bright aqua
      epic: "#B19CD9", // Bright lavender
      legendary: "#FFB74D", // Bright orange
    },
  },
};

export const typography = {
  // Using Fredoka One for a playful, kid-friendly look
  fontFamily: {
    regular: "FredokaOne_400Regular",
    bold: "FredokaOne_400Regular", // Fredoka One only comes in one weight
    // Fallback to system fonts if Fredoka One fails to load
    fallback: "System",
  },

  // Common text styles with font family included
  text: {
    fontFamily: "FredokaOne_400Regular",
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

// Rarity color function - returns appropriate color for each rarity level
export const getRarityColor = (rarity) => {
  switch (rarity) {
    case "common":
      return "#9CA3AF"; // Light Gray
    case "rare":
      return "#60A5FA"; // Light Blue
    case "epic":
      return "#A78BFA"; // Light Purple
    case "legendary":
      return "#F59E0B"; // Light Gold
    default:
      return "#9CA3AF"; // Light Gray
  }
};
// export const getRarityColor = (rarity) => {
//   switch (rarity) {
//     case "common":
//       return "#D1D5DB"; // Pastel Gray
//     case "rare":
//       return "#A5D8FF"; // Pastel Blue
//     case "epic":
//       return "#CDB4FF"; // Pastel Purple
//     case "legendary":
//       return "#FFE5A5"; // Pastel Gold
//     default:
//       return "#D1D5DB"; // Pastel Gray
//   }
// };

export const iconStyles = {
  // Standard icon sizes - increased for better thumb accessibility
  sizes: {
    xs: 18, // was 12, +50%
    sm: 24, // was 16, +50%
    md: 32, // was 20, +60%
    lg: 36, // was 24, +50%
    xl: 44, // was 28, +57%
    xxl: 48, // was 32, +50%
  },

  // Common icon styles for buttons and navigation
  button: {
    marginHorizontal: 4,
  },

  navigationButton: {
    marginHorizontal: 2,
  },

  // Rarity icon styles
  rarity: {
    marginRight: 4,
  },

  // Badge icon styles (small icons in badges)
  badge: {
    marginHorizontal: 2,
  },

  // Interactive icon styles (for pressable icons)
  interactive: {
    padding: 4,
  },
};

// Shared modal styles
export const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  content: {
    backgroundColor: colors.surface,
    borderRadius: borderRadius.xl,
    padding: spacing.xl,
    alignItems: "center",
    minWidth: 280,
    maxWidth: 320,
    ...shadows.xl,
    borderWidth: 2,
    borderColor: colors.headerBackground, // Use teal border to match header
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: spacing.lg,
  },
  title: {
    fontSize: typography.sizes.xl,
    fontFamily: typography.fontFamily.regular,
    color: colors.text,
    textAlign: "center",
    flex: 1,
  },
  closeButton: {
    padding: spacing.sm,
    borderRadius: borderRadius.md,
    backgroundColor: colors.headerButtonBg,
    ...shadows.sm,
    minWidth: 40,
    minHeight: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  soundToggleRow: {
    flexDirection: "row",
    justifyContent: "space-evenly", // Use space-evenly for perfect distribution
    alignItems: "center",
    width: "100%",
    marginBottom: spacing.lg,
    paddingHorizontal: 0, // Remove any horizontal padding
  },
  soundButton: {
    borderRadius: borderRadius.lg,
    width: 60,
    height: 60,
    justifyContent: "center",
    alignItems: "center",
    paddingLeft: 0, // Ensure no left padding
    paddingRight: 0, // Ensure no right padding
    paddingTop: 0, // Ensure no top padding
    paddingBottom: 0, // Ensure no bottom padding
    marginLeft: 0, // Ensure no left margin
    marginRight: 0, // Ensure no right margin
    // Remove all margins to eliminate any offset
  },
  buttonContainer: {
    width: "100%",
    alignItems: "center",
    marginTop: spacing.md,
  },
  gameButton: {
    width: 220,
    marginBottom: spacing.md,
  },
  buttonRow: {
    width: "100%",
    marginTop: spacing.sm,
  },
};

export default {
  colors,
  typography,
  spacing,
  borderRadius,
  shadows,
  iconStyles,
  modalStyles,
  getRarityColor,
};
