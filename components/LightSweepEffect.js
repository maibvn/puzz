import React, { useRef, useEffect } from "react";
import { View, Animated } from "react-native";
import theme from "../theme";

const LightSweepEffect = () => {
  const sweepAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          // Reset to starting position
          Animated.timing(sweepAnim, {
            toValue: -1,
            duration: 0, // Instant reset
            useNativeDriver: true,
          }),
          Animated.delay(200), // Much shorter wait before starting
          // Sweep from left to right
          Animated.timing(sweepAnim, {
            toValue: 1,
            duration: 1500, // Slower sweep - 1.5 seconds (was 800ms)
            useNativeDriver: true,
          }),
          Animated.delay(800), // Longer wait before repeating (was 300ms)
        ])
      ).start();
    };
    animate();
  }, [sweepAnim]);

  return (
    <>
      {/* Sweeping light effect */}
      <Animated.View
        style={[
          styles.lightSweep,
          {
            transform: [
              {
                translateX: sweepAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-250, 250], // Wider sweep range
                }),
              },
            ],
            opacity: sweepAnim.interpolate({
              inputRange: [-1, -0.3, 0, 0.3, 1],
              outputRange: [0, 0.9, 1, 0.9, 0], // Higher peak opacity and smoother fade
            }),
          },
        ]}
      />
    </>
  );
};

const styles = {
  lightSweep: {
    position: "absolute",
    top: 0, // Start from the very top of the card
    bottom: 0, // Extend to the very bottom of the card
    left: -60, // Start outside the card
    width: 60, // Thinner light sweep
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Much brighter white light
    borderRadius: theme.borderRadius.lg,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20, // Bigger glow
    elevation: 15,
    transform: [{ skewX: "-15deg" }], // Less angled for better visibility
    // Add a gradient effect
    opacity: 0.8,
  },
};

export default LightSweepEffect;
