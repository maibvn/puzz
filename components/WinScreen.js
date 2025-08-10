import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Text } from "react-native";
import theme from "../theme";
import LightSweepEffect from "./LightSweepEffect";

export default function WinScreen({
  width,
  height,
  image,
  completionStats,
  levelName,
}) {
  const scaleAnim = useRef(new Animated.Value(0.8)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  // Star fill animations - one for each star
  const starFillAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

  // Star scale animations for bounce effect - start from 0 (invisible)
  const starScaleAnims = useRef([
    new Animated.Value(0),
    new Animated.Value(0),
    new Animated.Value(0),
  ]).current;

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

    // Animate stars filling sequentially
    const { stars = 0 } = completionStats || {};
    const starAnimations = [];

    for (let i = 0; i < Math.min(stars, 3); i++) {
      starAnimations.push(
        Animated.sequence([
          // Wait for previous stars (reduced delay for overlap)
          Animated.delay(i * 250), // 250ms delay - next star appears mid-animation of previous
          // Show star by scaling and fading in simultaneously
          Animated.parallel([
            Animated.spring(starScaleAnims[i], {
              toValue: 1,
              tension: 120,
              friction: 6,
              useNativeDriver: true,
            }),
            Animated.timing(starFillAnims[i], {
              toValue: 1,
              duration: 500, // Longer duration so stars overlap nicely
              useNativeDriver: true,
            }),
          ]),
        ])
      );
    }

    // Start all star animations
    Animated.parallel(starAnimations).start();
  }, [scaleAnim, rotateAnim, starFillAnims, starScaleAnims, completionStats]);

  const renderStars = () => {
    const { stars = 0 } = completionStats || {};

    // Create array with only earned stars for centering
    const earnedStarsArray = Array.from(
      { length: Math.min(stars, 3) },
      (_, i) => i + 1
    );

    return (
      <View style={[styles.starsContainer, { justifyContent: "center" }]}>
        {earnedStarsArray.map((star, index) => {
          return (
            <Animated.View key={star}>
              <Animated.Text
                style={[
                  styles.star,
                  {
                    color: theme.colors.starActive,
                    opacity: starFillAnims[index],
                    transform: [
                      {
                        scale: starScaleAnims[index],
                      },
                    ],
                  },
                ]}
              >
                ⭐
              </Animated.Text>
            </Animated.View>
          );
        })}
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
        {/* Light sweep effect for the winning image */}
        <LightSweepEffect />
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
        <Text style={styles.successText}>
          Great, you've got {levelName.toUpperCase()}!
        </Text>
        {renderStars()}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "flex-start", // Align to top instead of center
    position: "relative",
    padding: theme.spacing.lg,
  },
  imageContainer: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden", // Contain light sweep effect within bounds
    ...theme.shadows.lg,
    position: "relative",
  },
  image: {
    borderRadius: theme.borderRadius.lg,
    overflow: "hidden", // Keep image cropped properly
  },
  messageContainer: {
    position: "absolute",
    bottom: -120, // Moved further down to save space
    alignItems: "center",
  },
  successText: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.regular,
    color: "#FFFFFF", // White text for dark background
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
    marginBottom: theme.spacing.sm,
  },
  starsContainer: {
    flexDirection: "row",
    marginBottom: theme.spacing.xs,
  },
  star: {
    fontSize: theme.typography.sizes.jumbo, // Changed from xl (24) to jumbo (48)
    marginHorizontal: theme.spacing.sm, // Increased spacing for bigger stars
  },
  subText: {
    fontSize: theme.typography.sizes.md,
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.semibold,
    textAlign: "center",
    marginTop: theme.spacing.xs,
  },
});
