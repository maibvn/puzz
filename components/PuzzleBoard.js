import React from "react";
import { View, StyleSheet } from "react-native";
import Tile from "./Tile";
import theme from "../theme";

export default function PuzzleBoard({
  tiles,
  onTileDrag,
  size,
  image,
  emptySlotTile,
}) {
  const gridSize = 3;
  const tileSize = size / gridSize;

  // Check if a tile can move in any direction (adjacent to empty space)
  const canMove = (row, col) => {
    // Check if any adjacent position is empty (null)
    const directions = [
      [row - 1, col], // up
      [row + 1, col], // down
      [row, col - 1], // left
      [row, col + 1], // right
    ];

    for (const [targetRow, targetCol] of directions) {
      // Check within 3x3 grid
      if (targetRow >= 0 && targetRow < 3 && targetCol >= 0 && targetCol < 3) {
        if (tiles[targetRow][targetCol] === null) {
          return true;
        }
      }
      // Check external empty slot at [3][2]
      if (targetRow === 3 && targetCol === 2 && emptySlotTile === null) {
        return true;
      }
    }

    return false;
  };

  // For external empty slot: check if it can move back to grid
  const canMoveFromEmptySlot = () => {
    // Can move up to [2][2] if it's empty
    return emptySlotTile !== null && tiles[2][2] === null;
  };

  return (
    <View
      style={[styles.boardContainer, { width: size, height: size + tileSize }]}
    >
      {/* Puzzle Grid: render all 9 tiles in 3 rows */}
      <View style={[styles.board, { width: size, height: size }]}>
        {tiles.map((row, rowIdx) => (
          <View key={`row-${rowIdx}`} style={{ flexDirection: "row" }}>
            {row.map((tile, colIdx) => {
              // If tile is null, render a transparent placeholder
              if (tile === null) {
                return (
                  <View
                    key={`${rowIdx}-${colIdx}`}
                    style={{
                      width: tileSize,
                      height: tileSize,
                      backgroundColor: "transparent",
                      margin: 1,
                    }}
                  />
                );
              }

              return (
                <Tile
                  key={`${rowIdx}-${colIdx}`}
                  tile={tile}
                  isEmpty={false}
                  size={tileSize}
                  image={image}
                  gridSize={gridSize}
                  canMove={canMove(rowIdx, colIdx)}
                  onMove={(direction) => {
                    onTileDrag(rowIdx, colIdx, direction);
                  }}
                />
              );
            })}
          </View>
        ))}
      </View>

      {/* 4th row: only show empty slot at [3][2] */}
      <View
        style={{
          flexDirection: "row",
          width: size,
          height: tileSize,
          position: "absolute",
          top: size,
          backgroundColor: "transparent", // Transparent background for the entire 4th row
        }}
      >
        {/* Hidden/transparent cells for [3][0] and [3][1] - completely transparent */}
        <View
          style={{
            width: tileSize,
            height: tileSize,
            backgroundColor: "transparent",
            margin: 1,
          }}
        />
        <View
          style={{
            width: tileSize,
            height: tileSize,
            backgroundColor: "transparent",
            margin: 1,
          }}
        />
        {/* Container for [3][2] with white background */}
        <View
          style={{
            width: tileSize,
            height: tileSize,
            backgroundColor: theme.colors.surface, // White background only for [3][2]
            margin: 1,
            // borderBottomRightRadius: theme.borderRadius.md,
            overflow: "hidden",
            ...theme.shadows.sm,
          }}
        >
          <Tile
            key="empty-3-2"
            tile={emptySlotTile}
            isEmpty={emptySlotTile === null}
            size={tileSize}
            image={image}
            gridSize={gridSize}
            canMove={emptySlotTile !== null ? canMoveFromEmptySlot() : false}
            onMove={(direction) => {
              onTileDrag(3, 2, direction);
            }}
            style={{
              backgroundColor: "transparent",
            }}
          />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boardContainer: {
    position: "relative",
    alignSelf: "center",
  },
  board: {
    flexDirection: "column",
    backgroundColor: theme.colors.surface, // White background
    // borderRadius: theme.borderRadius.md,
    overflow: "hidden",
    ...theme.shadows.md,
  },
});
