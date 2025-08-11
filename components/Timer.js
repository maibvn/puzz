import React, { useState, useEffect, useRef } from "react";
import { View, Text, StyleSheet } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
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
  format = "{time}", // default to just {time} since formatting is handled below
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
    const minutes = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const seconds = (time % 60).toString().padStart(2, "0");
    return format.replace("{time}", `${minutes}:${seconds}`);
  };

  return (
    <View style={[styles.timerContainer, containerStyle]}>
      <View style={styles.timerTextWrapper}>
        <Text style={[styles.timerText, textStyle]}>
          {formatTime(currentTime)}
        </Text>
      </View>
      <Icon
        name="clock-outline"
        size={20}
        color={theme.colors.textWhite}
        style={styles.iconStyle}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  timerContainer: {
    backgroundColor: "transparent",
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    borderRadius: theme.borderRadius.full,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },
  iconStyle: {
    marginLeft: theme.spacing.sm,
  },
  timerTextWrapper: {
    minWidth: theme.spacing.xxl,
    alignItems: "flex-end",
  },
  timerText: {
    fontSize: theme.typography.sizes.sm,
    // fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textWhite,
  },
});
