import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Text } from "react-native";
import theme from "../theme";

export default function WinScreen({ width, height, image, completionStats }) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const glowAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    // Very gentle emphasis animation sequence
    Animated.sequence([
      // Initial scale up with bounce (very gentle)
      Animated.spring(scaleAnim, {
        toValue: 1.02,
        tension: 150,
        friction: 4,
        useNativeDriver: true,
      }),
      // Settle to normal size
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 200,
        friction: 10,
        useNativeDriver: true,
      }),
    ]).start();

    // Fast, subtle golden glow that doesn't obscure the image
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 0.6,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.4,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.2,
        duration: 200,
        useNativeDriver: true,
      }),
      // Fade out quickly to show clean original image
      Animated.timing(glowAnim, {
        toValue: 0,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Fast, subtle rotation effect that returns to 0
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, glowAnim, rotateAnim]);

  const renderStars = () => {
    const { stars = 0 } = completionStats || {};
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((star) => (
          <Text
            key={star}
            style={[
              styles.star,
              {
                color:
                  star <= stars ? theme.colors.accent : theme.colors.surface,
                textShadowColor:
                  star <= stars ? theme.colors.text : "transparent",
                textShadowOffset: { width: 1, height: 1 },
                textShadowRadius: 2,
              },
            ]}
          >
            ⭐
          </Text>
        ))}
      </View>
    );
  };

  const rotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "1deg"],
  });

  const reverseRotate = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "-0.5deg"],
  });

  return (
    <View style={[styles.container, { width: width, height: height }]}>
      {/* Main image with animations - positioned at top */}
      <Animated.View
        style={[
          styles.imageContainer,
          {
            width: width,
            height: width, // Square image (3x3 size)
            transform: [{ scale: scaleAnim }, { rotate: rotate }],
          },
        ]}
      >
        <Image
          source={image}
          style={[
            styles.image,
            {
              width: width,
              height: width, // Square image
            },
          ]}
          resizeMode="cover"
        />

        {/* VERY VISIBLE Glow effects - positioned ON TOP of image */}
        <Animated.View
          style={[
            styles.glowOuter,
            {
              width: width + 40, // Image width + glow
              height: width + 40, // Image height + glow (square)
              opacity: glowAnim,
              transform: [{ rotate: reverseRotate }],
            },
          ]}
        />
        <Animated.View
          style={[
            styles.glowInner,
            {
              width: width + 20, // Image width + smaller glow
              height: width + 20, // Image height + smaller glow (square)
              opacity: glowAnim,
              transform: [{ rotate }],
            },
          ]}
        />

        {/* Subtle sparkle overlay */}
        <Animated.View
          style={[
            styles.sparkleOverlay,
            {
              opacity: glowAnim,
            },
          ]}
        />
      </Animated.View>

      {/* Success message */}
      <Animated.View
        style={[
          styles.messageContainer,
          {
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        <Text style={styles.successText}>🎉 Level Complete! 🎉</Text>
        {renderStars()}
        {completionStats && (
          <Text style={styles.timeText}>Time: {completionStats.time}s</Text>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start", // Align to top instead of center
    position: "relative",
  },
  glowOuter: {
    position: "absolute",
    top: -20, // Center the glow on the image
    left: -20,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.glowYellow,
    borderWidth: 2,
    borderColor: theme.colors.borderPink,
    zIndex: 10, // Make sure it's on top
  },
  glowInner: {
    position: "absolute",
    top: -10, // Center the glow on the image
    left: -10,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.glowPink,
    borderWidth: 1,
    borderColor: theme.colors.borderYellow,
    zIndex: 9, // Make sure it's on top
  },
  imageContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: "visible", // Allow glow effects to show outside
    ...theme.shadows.lg,
    position: "relative",
  },
  image: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden", // Keep image cropped properly
  },
  sparkleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.sparkle,
    borderRadius: theme.borderRadius.lg,
  },
  messageContainer: {
    position: "absolute",
    bottom: -100,
    alignItems: "center",
  },
  successText: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.extrabold,
    color: theme.colors.accent,
    textAlign: "center",
    textShadowColor: theme.colors.text,
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
    marginBottom: theme.spacing.sm,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
  },
  star: {
    fontSize: theme.typography.sizes.xl,
    marginHorizontal: theme.spacing.xs / 2,
  },
  timeText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.semibold,
    textAlign: "center",
  },
  subText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.semibold,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
});
