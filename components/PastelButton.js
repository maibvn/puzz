import React from "react";
import { TouchableOpacity, Text, StyleSheet } from "react-native";
import theme from "../theme";

export default function PastelButton({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  style,
}) {
  const getButtonStyle = () => {
    if (disabled) {
      return {
        backgroundColor: theme.colors.locked,
        borderColor: theme.colors.locked,
      };
    }

    switch (variant) {
      case "primary":
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
      case "secondary":
        return {
          backgroundColor: theme.colors.secondary,
          borderColor: theme.colors.secondary,
        };
      case "success":
        return {
          backgroundColor: theme.colors.success,
          borderColor: theme.colors.success,
        };
      case "warning":
        return {
          backgroundColor: theme.colors.warning,
          borderColor: theme.colors.warning,
        };
      default:
        return {
          backgroundColor: theme.colors.primary,
          borderColor: theme.colors.primary,
        };
    }
  };

  const getTextColor = () => {
    if (disabled) return theme.colors.textLight;
    return theme.colors.text;
  };

  return (
    <TouchableOpacity
      style={[
        styles.button,
        getButtonStyle(),
        style,
        disabled && styles.disabled,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={0.7}
    >
      <Text style={[styles.buttonText, { color: getTextColor() }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    paddingHorizontal: theme.spacing.lg,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.xl,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
    ...theme.shadows.md,
  },
  buttonText: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "center",
  },
  disabled: {
    opacity: 0.5,
    ...theme.shadows.sm, // Reduced shadow for disabled state
  },
});
