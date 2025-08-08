import React, { useState } from "react";
import {
  SafeAreaView,
  Text,
  StyleSheet,
  Button,
  Dimensions,
} from "react-native";
import PuzzleBoard from "./components/PuzzleBoard";
import WinScreen from "./components/WinScreen";
import { View } from "react-native";
import { shuffle } from "./utils/shuffle";

const BOARD_SIZE = 3;
const windowWidth = Dimensions.get("window").width;
const PUZZLE_SIZE = Math.min(windowWidth - 32, 320);
const PUZZLE_BOARD_HEIGHT = PUZZLE_SIZE + PUZZLE_SIZE / 3; // 3x3 grid + 1 extra row (3x4 total)
const puzzleImage = require("./assets/images/puzzle.jpg"); // Change to your image filename

function getInitialTiles() {
  // 3x3 grid, numbered 0-7, last is null (empty)
  let arr = Array.from({ length: BOARD_SIZE * BOARD_SIZE - 1 }, (_, i) => i);
  arr.push(null);
  let tiles = [];
  for (let r = 0; r < BOARD_SIZE; r++) {
    tiles.push(arr.slice(r * BOARD_SIZE, (r + 1) * BOARD_SIZE));
  }
  return tiles;
}

export default function App() {
  // 3x3 grid, all 9 tiles present, no nulls
  const [tiles, setTiles] = useState([
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]);
  // Track which tile is currently in the external empty slot at [3][2] (null means slot is empty)
  const [emptySlotTile, setEmptySlotTile] = useState(null);
  const [won, setWon] = useState(false);

  // Check if puzzle is solved
  const checkWin = (currentTiles, currentEmptySlotTile) => {
    // Win condition: all tiles in correct positions and empty slot is empty
    const correctTiles = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];

    // Check if tiles match correct positions
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (currentTiles[row][col] !== correctTiles[row][col]) {
          return false;
        }
      }
    }

    // Check if external empty slot is empty
    return currentEmptySlotTile === null;
  };

  // Full sliding puzzle logic
  const handleTileDrag = (row, col, direction) => {
    const newTiles = tiles.map((arr) => arr.slice());

    // Check if moving from grid to empty slot at [3][2]
    if (
      row === 2 &&
      col === 2 &&
      direction === "down" &&
      emptySlotTile === null
    ) {
      // Move tile from [2,2] to empty slot at [3,2]
      const movedTile = newTiles[2][2];
      newTiles[2][2] = null; // Create empty space in grid
      setTiles(newTiles);
      setEmptySlotTile(movedTile);

      // Check for win condition
      if (checkWin(newTiles, movedTile)) {
        setWon(true);
      }
      return;
    }

    // Check if moving from empty slot back to grid
    if (row === 3 && col === 2 && emptySlotTile !== null) {
      if (direction === "up" && newTiles[2][2] === null) {
        // Move tile from empty slot back to [2,2]
        newTiles[2][2] = emptySlotTile;
        setTiles(newTiles);
        setEmptySlotTile(null);

        // Check for win condition
        if (checkWin(newTiles, null)) {
          setWon(true);
        }
        return;
      }
    }

    // Handle movement within the 3x3 grid
    let targetRow = row;
    let targetCol = col;

    if (direction === "up") targetRow = row - 1;
    else if (direction === "down") targetRow = row + 1;
    else if (direction === "left") targetCol = col - 1;
    else if (direction === "right") targetCol = col + 1;

    // Check if target position is valid and empty
    if (targetRow >= 0 && targetRow < 3 && targetCol >= 0 && targetCol < 3) {
      if (newTiles[targetRow][targetCol] === null) {
        // Move tile to empty space
        newTiles[targetRow][targetCol] = newTiles[row][col];
        newTiles[row][col] = null;
        setTiles(newTiles);

        // Check for win condition
        if (checkWin(newTiles, emptySlotTile)) {
          setWon(true);
        }
      }
    }
  };

  const handleShuffle = () => {
    // Create a test scenario: move tile 8 to empty slot, leaving [2][2] empty
    setTiles([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, null], // Empty space at [2][2]
    ]);
    setEmptySlotTile(8); // Tile 8 is now in the external slot
    setWon(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>🧩 Puzz</Text>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.gameContainer}>
          {won ? (
            <WinScreen
              width={PUZZLE_SIZE}
              height={PUZZLE_BOARD_HEIGHT}
              image={puzzleImage}
            />
          ) : (
            <PuzzleBoard
              tiles={tiles}
              onTileDrag={handleTileDrag}
              size={PUZZLE_SIZE}
              image={puzzleImage}
              emptySlotTile={emptySlotTile}
            />
          )}
        </View>
      </View>

      <View style={styles.footer}>
        <Button title="Shuffle" onPress={handleShuffle} />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fafafa",
  },
  header: {
    paddingTop: 40,
    paddingBottom: 10,
    alignItems: "center",
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
  },
  gameArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  gameContainer: {
    position: "relative",
    width: PUZZLE_SIZE,
    height: PUZZLE_BOARD_HEIGHT,
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 40,
    alignItems: "center",
  },
});
