import React from "react";
import { View, Image, StyleSheet, PanResponder } from "react-native";

export default function Tile({
  tile,
  size,
  image,
  gridSize,
  isEmpty,
  onMove, // (direction) => void
  rowIdx,
  colIdx,
  canMove, // boolean
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
          styles.tile,
          {
            width: size,
            height: size,
            backgroundColor: "#fafafa",
            borderWidth: 2,
            borderColor: "#aaa",
            borderStyle: "dashed",
            justifyContent: "center",
            alignItems: "center",
          },
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
          overflow: "hidden",
        },
      ]}
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
    </View>
  );
}

const styles = StyleSheet.create({
  tile: {
    margin: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
});
