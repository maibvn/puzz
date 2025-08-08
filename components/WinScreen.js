import React, { useEffect, useRef } from "react";
import { View, Image, StyleSheet, Animated, Text } from "react-native";

export default function WinScreen({ width, height, image }) {
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

    // Very visible golden glow pulse effect
    Animated.sequence([
      Animated.timing(glowAnim, {
        toValue: 1,
        duration: 400,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.7,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(glowAnim, {
        toValue: 0.5,
        duration: 400,
        useNativeDriver: true,
      }),
    ]).start();

    // Faster, subtle rotation effect that returns to 0
    Animated.sequence([
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 600,
        useNativeDriver: true,
      }),
      Animated.timing(rotateAnim, {
        toValue: 0,
        duration: 600,
        useNativeDriver: true,
      }),
    ]).start();
  }, [scaleAnim, glowAnim, rotateAnim]);

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

        {/* Sparkle overlay */}
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
        <Text style={styles.successText}>🎉 Perfect! 🎉</Text>
        <Text style={styles.subText}>Puzzle Completed!</Text>
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
    borderRadius: 20,
    backgroundColor: "gold", // Solid bright gold
    borderWidth: 5,
    borderColor: "yellow",
    zIndex: 10, // Make sure it's on top
  },
  glowInner: {
    position: "absolute",
    top: -10, // Center the glow on the image
    left: -10,
    borderRadius: 15,
    backgroundColor: "yellow", // Solid bright yellow
    borderWidth: 3,
    borderColor: "gold",
    zIndex: 9, // Make sure it's on top
  },
  imageContainer: {
    borderRadius: 10,
    overflow: "visible", // Allow glow effects to show outside
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 8,
    },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    elevation: 12,
    position: "relative",
  },
  image: {
    borderRadius: 10,
    overflow: "hidden", // Keep image cropped properly
  },
  sparkleOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 10,
  },
  messageContainer: {
    position: "absolute",
    bottom: -80,
    alignItems: "center",
  },
  successText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "gold",
    textAlign: "center",
    textShadowColor: "#000",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 3,
  },
  subText: {
    fontSize: 16,
    color: "#666",
    fontWeight: "600",
    textAlign: "center",
    marginTop: 4,
  },
});
