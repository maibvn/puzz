import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import theme from "../theme";

/**
 * Timer component for tracking elapsed time
 * @param {Date|number} startTime - When the timer should start counting from
 * @param {function} onTimeUpdate - Callback fired when time updates (optional)
 * @param {string} format - Display format (optional, defaults to "⏱️ {time}s")
 * @param {object} containerStyle - Custom styles for container (optional)
 * @param {object} textStyle - Custom styles for text (optional)
 * @param {boolean} paused - Whether the timer should be paused (optional)
 */
export default function Timer({
  startTime,
  onTimeUpdate,
  format = "⏱️ {time}s",
  containerStyle,
  textStyle,
  paused = false,
}) {
  const [currentTime, setCurrentTime] = useState(0);
  const isInitialMount = useRef(true);

  useEffect(() => {
    if (!startTime || paused) return;

    let interval = null;

    interval = setInterval(() => {
      const newTime = Math.floor((Date.now() - startTime) / 1000);
      setCurrentTime((prevTime) => {
        if (prevTime !== newTime) {
          return newTime;
        }
        return prevTime;
      });

      // Call the callback outside of setState to avoid render cycle issues
      if (onTimeUpdate) {
        onTimeUpdate(newTime);
      }
    }, 1000);

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime, onTimeUpdate, paused]);

  // Reset timer when startTime changes
  useEffect(() => {
    if (startTime) {
      // Calculate the current time immediately instead of starting from 0
      const currentTimeValue = Math.floor((Date.now() - startTime) / 1000);
      setCurrentTime(currentTimeValue);
      // Don't call callback on initial mount to avoid render cycle
      if (onTimeUpdate && !isInitialMount.current) {
        onTimeUpdate(currentTimeValue);
      }
      isInitialMount.current = false;
    }
  }, [startTime, onTimeUpdate]);

  const formatTime = (time) => {
    return format.replace("{time}", time.toString());
  };

  return (
    <View style={[styles.timerContainer, containerStyle]}>
      <Text style={[styles.timerText, textStyle]}>
        {formatTime(currentTime)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: theme.colors.accent,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.xs,
    borderRadius: theme.borderRadius.full,
    ...theme.shadows.sm,
  },
  timerText: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
});
