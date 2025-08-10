import React from "react";
import { View, Image, StyleSheet, PanResponder } from "react-native";
import theme from "../theme";

export default function Tile({
  tile,
  size,
  image,
  gridSize,
  isEmpty,
  onMove, // (direction) => void
  canMove, // boolean
  style, // Additional styles to apply
  backgroundColor, // Override background color
}) {
  // Create pan responder fresh each render to capture current canMove state
  const panResponder = PanResponder.create({
    onStartShouldSetPanResponder: () => canMove,
    onMoveShouldSetPanResponder: () => canMove,
    onPanResponderRelease: (evt, gestureState) => {
      if (!canMove) return;
      const { dx, dy } = gestureState;
      if (Math.abs(dx) > Math.abs(dy)) {
        if (dx > 30) {
          onMove && onMove("right");
        } else if (dx < -30) {
          onMove && onMove("left");
        }
      } else {
        if (dy > 30) {
          onMove && onMove("down");
        } else if (dy < -30) {
          onMove && onMove("up");
        }
      }
    },
  });

  if (isEmpty) {
    return (
      <View
        style={[
          {
            margin: 1,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: theme.borderRadius.sm,
            width: size,
            height: size,
            backgroundColor: backgroundColor || theme.colors.emptySlot,
          },
          style, // Apply additional styles last
        ]}
      />
    );
  }

  // tile is 0..8, map to row/col in the original grid
  const row = Math.floor(tile / gridSize);
  const col = tile % gridSize;

  return (
    <View
      {...panResponder.panHandlers}
      style={[
        styles.tile,
        {
          width: size,
          height: size,
          backgroundColor: backgroundColor || theme.colors.tileBackground,
          overflow: "hidden",
          // Enhanced depth styling
          shadowColor: "#000",
          shadowOffset: {
            width: 2,
            height: 4,
          },
          shadowOpacity: 0.25,
          shadowRadius: 4,
          elevation: 8, // Android shadow
          borderWidth: 1,
          borderTopColor: "rgba(255, 255, 255, 0.3)", // Light highlight on top
          borderLeftColor: "rgba(255, 255, 255, 0.3)", // Light highlight on left
          borderBottomColor: "rgba(0, 0, 0, 0.1)", // Subtle shadow on bottom
          borderRightColor: "rgba(0, 0, 0, 0.1)", // Subtle shadow on right
        },
        style, // Apply additional styles
      ]}
    >
      {/* Inner content container for additional depth */}
      <View
        style={{
          width: "100%",
          height: "100%",
          borderRadius: theme.borderRadius.sm - 1, // Slightly smaller radius
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.1,
          shadowRadius: 1,
          elevation: 2,
        }}
      >
        {/* Image with inset shadow effect */}
        <View
          style={{
            width: "100%",
            height: "100%",
            overflow: "hidden",
          }}
        >
          <Image
            source={image}
            style={{
              width: size * gridSize,
              height: size * gridSize,
              position: "absolute",
              left: -col * size,
              top: -row * size,
            }}
            resizeMode="cover"
          />
          {/* Inset shadow overlay for depth */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              // Inner shadow effect using gradients simulation
              borderWidth: 1,
              borderColor: "transparent",
              // Top and left inner highlight
              borderTopColor: "rgba(255, 255, 255, 0.2)",
              borderLeftColor: "rgba(255, 255, 255, 0.2)",
              // Bottom and right inner shadow
              shadowColor: "#000",
              shadowOffset: {
                width: -1,
                height: -1,
              },
              shadowOpacity: 0.3,
              shadowRadius: 2,
              elevation: 0, // No elevation for inner shadow
            }}
          />
          {/* Additional subtle vignette effect */}
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: "rgba(0, 0, 0, 0.05)", // Very subtle darkening
              borderRadius: theme.borderRadius.sm - 2,
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    margin: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: theme.borderRadius.sm,
    backgroundColor: theme.colors.tileBackground,
  },
});
