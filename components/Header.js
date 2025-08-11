import React from "react";
import { View, Text, StyleSheet, Pressable, StatusBar } from "react-native";
import Icon from "./Icon";
import theme from "../theme";

/**
 * Centralized Header component for consistent styling across all screens
 * @param {string} title - The title to display in the center
 * @param {object} leftButton - Left button configuration { iconName, onPress, hitSlop? }
 * @param {object} rightButton - Right button configuration { iconName, onPress, hitSlop? } or custom component
 * @param {boolean} showStatusBar - Whether to show the status bar (default: false)
 * @param {object} style - Additional styles for the header container
 * @param {object} titleStyle - Additional styles for the title text
 * @param {boolean} centerTitle - Whether to center the title (default: true)
 */
export default function Header({
  title,
  leftButton,
  rightButton,
  showStatusBar = false,
  style,
  titleStyle,
  centerTitle = true,
}) {
  const renderButton = (buttonConfig, buttonStyle) => {
    if (!buttonConfig) return <View style={styles.headerSpacer} />;

    // If it's a custom component, render it directly
    if (buttonConfig.component) {
      return buttonConfig.component;
    }

    // Otherwise render as icon button
    const {
      iconName,
      onPress,
      hitSlop = { top: 10, bottom: 10, left: 10, right: 10 },
    } = buttonConfig;

    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          buttonStyle,
          pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
        ]}
        hitSlop={hitSlop}
      >
        <Icon
          name={iconName}
          size={theme.iconStyles.sizes.lg}
          variant="navigationButton"
          bright
        />
      </Pressable>
    );
  };

  return (
    <>
      {showStatusBar && <StatusBar hidden={false} />}
      {!showStatusBar && <StatusBar hidden={true} />}

      <View style={[styles.header, style]}>
        {renderButton(leftButton, styles.navigationButton)}

        <Text
          style={[
            styles.title,
            titleStyle,
            centerTitle && styles.centeredTitle,
            !centerTitle && styles.leftAlignedTitle,
          ]}
        >
          {title}
        </Text>

        {renderButton(rightButton, styles.navigationButton)}
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.md,
    paddingBottom: 12,
    backgroundColor: theme.colors.headerBackground,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
    minHeight: 60, // Ensure consistent height across screens
    // Add shadow to header
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  navigationButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.headerButtonBg, // Red background
    ...theme.shadows.sm,
    minWidth: 44, // Ensure consistent button width
    minHeight: 44, // Ensure consistent button height
    justifyContent: "center",
    alignItems: "center",
  },
  headerSpacer: {
    width: 44, // Same as button width for centering
    height: 44, // Same as button height
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    // fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.headerText,
  },
  centeredTitle: {
    textAlign: "center",
    flex: 1,
  },
  leftAlignedTitle: {
    textAlign: "left",
    flex: 1,
    marginLeft: theme.spacing.sm,
  },
});
