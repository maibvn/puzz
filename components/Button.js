import React from "react";
import {
  Pressable,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
} from "react-native";
import theme from "../theme";
import Icon from "./Icon";

/**
 * Centralized Button component with consistent theming
 * @param {string} title - Button text
 * @param {function} onPress - Press handler
 * @param {string} variant - Button variant (primary, secondary, surface, etc.)
 * @param {string} size - Button size (sm, md, lg)
 * @param {boolean} disabled - Whether button is disabled
 * @param {string} iconName - Optional icon name (Ionicons)
 * @param {string} iconPosition - Icon position (left, right)
 * @param {object} style - Additional button styles
 * @param {object} textStyle - Additional text styles
 * @param {boolean} usePressable - Use Pressable instead of TouchableOpacity
 * @param {object} pressableProps - Additional pressable props (hitSlop, etc.)
 */
export default function Button({
  title,
  onPress,
  variant = "primary",
  size = "md",
  disabled = false,
  iconName,
  iconPosition = "left",
  style,
  textStyle,
  usePressable = false,
  pressableProps = {},
  ...props
}) {
  const getButtonStyle = () => {
    const baseStyle = {
      borderRadius: theme.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
      flexDirection: iconName ? "row" : "column",
      ...theme.shadows.md,
    };

    // Size variations
    const sizeStyles = {
      sm: {
        paddingHorizontal: theme.spacing.md,
        paddingVertical: theme.spacing.sm,
        minWidth: 80,
      },
      md: {
        paddingHorizontal: theme.spacing.lg,
        paddingVertical: theme.spacing.md,
        minWidth: 120,
      },
      lg: {
        paddingHorizontal: theme.spacing.xl,
        paddingVertical: theme.spacing.lg,
        minWidth: 160,
      },
    };

    if (disabled) {
      return {
        ...baseStyle,
        ...sizeStyles[size],
        backgroundColor: theme.colors.locked,
        borderColor: theme.colors.locked,
        borderWidth: 2,
        opacity: 0.5,
        ...theme.shadows.sm,
      };
    }

    // Variant styles
    const variantStyles = {
      primary: {
        backgroundColor: theme.colors.primary,
        borderColor: theme.colors.primary,
        borderWidth: 2,
      },
      secondary: {
        backgroundColor: theme.colors.secondary,
        borderColor: theme.colors.secondary,
        borderWidth: 2,
      },
      surface: {
        backgroundColor: theme.colors.surface,
        borderColor: theme.colors.surface,
        borderWidth: 2,
      },
      success: {
        backgroundColor: theme.colors.success,
        borderColor: theme.colors.success,
        borderWidth: 2,
      },
      warning: {
        backgroundColor: theme.colors.warning,
        borderColor: theme.colors.warning,
        borderWidth: 2,
      },
      error: {
        backgroundColor: theme.colors.error,
        borderColor: theme.colors.error,
        borderWidth: 2,
      },
      outline: {
        backgroundColor: "transparent",
        borderColor: theme.colors.primary,
        borderWidth: 2,
      },
      ghost: {
        backgroundColor: "transparent",
        borderWidth: 0,
      },
    };

    return {
      ...baseStyle,
      ...sizeStyles[size],
      ...variantStyles[variant],
    };
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textLight;

    switch (variant) {
      case "outline":
      case "ghost":
        return theme.colors.text;
      case "surface":
        return theme.colors.text;
      default:
        return theme.colors.text;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return theme.typography.sizes.sm;
      case "md":
        return theme.typography.sizes.md;
      case "lg":
        return theme.typography.sizes.lg;
      default:
        return theme.typography.sizes.md;
    }
  };

  const getIconSize = () => {
    switch (size) {
      case "sm":
        return theme.iconStyles.sizes.sm;
      case "md":
        return theme.iconStyles.sizes.md;
      case "lg":
        return theme.iconStyles.sizes.lg;
      default:
        return theme.iconStyles.sizes.md;
    }
  };

  const buttonStyle = getButtonStyle();
  const textColor = getTextColor();
  const textSize = getTextSize();
  const iconSize = getIconSize();

  const content = (
    <>
      {iconName && iconPosition === "left" && (
        <Icon
          name={iconName}
          size={iconSize}
          color={textColor}
          variant="button"
          style={{ marginRight: title ? theme.spacing.sm : 0 }}
        />
      )}
      {title && (
        <Text
          style={[
            styles.buttonText,
            {
              color: textColor,
              fontSize: textSize,
              fontFamily: theme.typography.fontFamily.regular,
            },
            textStyle,
          ]}
        >
          {title}
        </Text>
      )}
      {iconName && iconPosition === "right" && (
        <Icon
          name={iconName}
          size={iconSize}
          color={textColor}
          variant="button"
          style={{ marginLeft: title ? theme.spacing.sm : 0 }}
        />
      )}
    </>
  );

  if (usePressable) {
    return (
      <Pressable
        style={({ pressed }) => [
          buttonStyle,
          pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
          style,
        ]}
        onPress={onPress}
        disabled={disabled}
        {...pressableProps}
        {...props}
      >
        {content}
      </Pressable>
    );
  }

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
      {...props}
    >
      {content}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  buttonText: {
    textAlign: "center",
    fontWeight: theme.typography.weights.regular,
  },
});

// Common button presets for consistency
export const ButtonPresets = {
  // Navigation buttons
  homeButton: (props) => (
    <Button
      iconName="home"
      variant="surface"
      size="md"
      usePressable={true}
      pressableProps={{ hitSlop: { top: 10, bottom: 10, left: 10, right: 10 } }}
      {...props}
    />
  ),

  backButton: (props) => (
    <Button
      iconName="arrow-back"
      variant="surface"
      size="md"
      usePressable={true}
      pressableProps={{ hitSlop: { top: 10, bottom: 10, left: 10, right: 10 } }}
      {...props}
    />
  ),

  closeButton: (props) => (
    <Button iconName="close" variant="surface" size="md" {...props} />
  ),

  // Action buttons
  settingsButton: (props) => (
    <Button iconName="settings" variant="surface" size="md" {...props} />
  ),

  refreshButton: (props) => (
    <Button
      iconName="refresh"
      variant="primary"
      size="md"
      style={{ backgroundColor: "#FFF" }}
      {...props}
    />
  ),

  collectionButton: (props) => (
    <Button
      iconName="images"
      variant="primary"
      size="md"
      style={{ backgroundColor: "#FFF" }}
      {...props}
    />
  ),
};
