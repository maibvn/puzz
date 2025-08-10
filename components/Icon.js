import React from "react";
import { Ionicons } from "@expo/vector-icons";
import theme from "../theme";

/**
 * Centralized Icon component using Ionicons with theme colors and styles
 * @param {string} name - Ionicon name
 * @param {number} size - Icon size (defaults to md from theme)
 * @param {string} color - Icon color (defaults to theme.colors.text)
 * @param {string} variant - Style variant (button, navigation, rarity, badge, interactive)
 * @param {boolean} bright - Use bright colors from theme
 * @param {object} style - Additional styles
 * @param {object} ...props - Other Ionicons props
 */
export default function Icon({
  name,
  size,
  color,
  variant,
  bright = false,
  style,
  ...props
}) {
  // Get size from theme if not specified
  const iconSize = size || theme.iconStyles.sizes.sm;

  // Get bright color if specified
  let iconColor = color;
  if (!color) {
    if (variant === "navigationButton") {
      iconColor = theme.colors.headerText; // Use white for navigation buttons
    } else if (bright && theme.colors.iconBright[name]) {
      iconColor = theme.colors.iconBright[name];
    } else {
      iconColor = theme.colors.text;
    }
  }

  // Get variant styles if specified
  const variantStyle = variant ? theme.iconStyles[variant] : {};

  // Combine styles
  const combinedStyle = [variantStyle, style].filter(Boolean);

  return (
    <Ionicons
      name={name}
      size={iconSize}
      color={iconColor}
      style={combinedStyle}
      {...props}
    />
  );
}

// Common icon presets for consistency
export const IconPresets = {
  // Navigation icons
  home: (props) => (
    <Icon name="home" variant="navigationButton" bright {...props} />
  ),
  back: (props) => (
    <Icon name="arrow-back" variant="navigationButton" bright {...props} />
  ),
  close: (props) => (
    <Icon name="close" variant="navigationButton" bright {...props} />
  ),

  // Action icons
  settings: (props) => (
    <Icon name="settings" variant="navigationButton" bright {...props} />
  ),
  refresh: (props) => (
    <Icon name="refresh" variant="navigationButton" bright {...props} />
  ),

  // Content icons
  images: (props) => (
    <Icon name="images" variant="navigationButton" bright {...props} />
  ),
  diamond: (props) => <Icon name="diamond" variant="badge" bright {...props} />,

  // Rarity icons with specific bright colors
  rarityCommon: (props) => (
    <Icon
      name="radio-button-off-outline"
      variant="rarity"
      color={theme.colors.iconBright.rarity.common}
      {...props}
    />
  ),
  rarityRare: (props) => (
    <Icon
      name="diamond-outline"
      variant="rarity"
      color={theme.colors.iconBright.rarity.rare}
      {...props}
    />
  ),
  rarityEpic: (props) => (
    <Icon
      name="star"
      variant="rarity"
      color={theme.colors.iconBright.rarity.epic}
      {...props}
    />
  ),
  rarityLegendary: (props) => (
    <Icon
      name="trophy"
      variant="rarity"
      color={theme.colors.iconBright.rarity.legendary}
      {...props}
    />
  ),
}; // Helper function to get rarity icon
export const getRarityIcon = (rarity, props = {}) => {
  switch (rarity) {
    case "common":
      return <IconPresets.rarityCommon {...props} />;
    case "rare":
      return <IconPresets.rarityRare {...props} />;
    case "epic":
      return <IconPresets.rarityEpic {...props} />;
    case "legendary":
      return <IconPresets.rarityLegendary {...props} />;
    default:
      return <IconPresets.rarityCommon {...props} />;
  }
};

// Helper function to get rarity icon name (for compatibility)
export const getRarityIconName = (rarity) => {
  switch (rarity) {
    case "common":
      return "radio-button-off-outline";
    case "rare":
      return "diamond-outline";
    case "epic":
      return "star";
    case "legendary":
      return "trophy";
    default:
      return "radio-button-off-outline";
  }
};
