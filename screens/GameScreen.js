import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import PuzzleBoard from "../components/PuzzleBoard";
import PastelButton from "../components/PastelButton";
import { getStarsForTime } from "../data/levels";
import { useApp } from "../contexts/AppProvider";
import theme from "../theme";

const windowWidth = Dimensions.get("window").width;
const PUZZLE_SIZE = Math.min(windowWidth - 32, 320);
const PUZZLE_BOARD_HEIGHT = PUZZLE_SIZE + PUZZLE_SIZE / 3;
const BOARD_SIZE = 3;

export default function GameScreen() {
  const { currentLevel, setGameState, playMoveSound, handleLevelComplete } =
    useApp();

  // Game-specific state
  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);
  const [tiles, setTiles] = useState([
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]);
  const [emptySlotTile, setEmptySlotTile] = useState(null);

  // Timer effect
  useEffect(() => {
    let interval = null;
    if (startTime) {
      interval = setInterval(() => {
        const newTime = Math.floor((Date.now() - startTime) / 1000);
        setCurrentTime((prevTime) => {
          return prevTime !== newTime ? newTime : prevTime;
        });
      }, 1000);
    }
    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [startTime]);

  // Initialize game when component mounts
  useEffect(() => {
    setStartTime(Date.now());
    setCurrentTime(0);
    setTiles([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ]);
    setEmptySlotTile(null);
    // Auto shuffle for gameplay
    setTimeout(() => handleShuffle(), 100);
  }, [currentLevel]);

  const handleBackToLevels = useCallback(() => {
    setGameState("levelSelect");
  }, [setGameState]);

  // Check if puzzle is solved
  const checkWin = (currentTiles, currentEmptySlotTile) => {
    const correctTiles = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ];

    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (currentTiles[row][col] !== correctTiles[row][col]) {
          return false;
        }
      }
    }

    return currentEmptySlotTile === null;
  };

  const handleLevelCompleteLocal = () => {
    const completionTime = Math.floor((Date.now() - startTime) / 1000);
    const stars = getStarsForTime(completionTime);

    const stats = handleLevelComplete(completionTime, stars);
    setGameState("won");
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
      const movedTile = newTiles[2][2];
      newTiles[2][2] = null;
      setTiles(newTiles);
      setEmptySlotTile(movedTile);
      playMoveSound();

      if (checkWin(newTiles, movedTile)) {
        handleLevelCompleteLocal();
      }
      return;
    }

    // Check if moving from empty slot back to grid
    if (row === 3 && col === 2 && emptySlotTile !== null) {
      if (direction === "up" && newTiles[2][2] === null) {
        newTiles[2][2] = emptySlotTile;
        setTiles(newTiles);
        setEmptySlotTile(null);
        playMoveSound();

        if (checkWin(newTiles, null)) {
          handleLevelCompleteLocal();
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

    if (targetRow >= 0 && targetRow < 3 && targetCol >= 0 && targetCol < 3) {
      if (newTiles[targetRow][targetCol] === null) {
        newTiles[targetRow][targetCol] = newTiles[row][col];
        newTiles[row][col] = null;
        setTiles(newTiles);
        playMoveSound();

        if (checkWin(newTiles, emptySlotTile)) {
          handleLevelCompleteLocal();
        }
      }
    }
  };

  const handleShuffle = () => {
    setTiles([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, null],
    ]);
    setEmptySlotTile(8);
  };

  if (!currentLevel) {
    return null;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <View style={styles.header}>
        <Pressable
          onPress={handleBackToLevels}
          style={({ pressed }) => [
            styles.backButton,
            pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          android_ripple={{ color: "rgba(255,255,255,0.2)", borderless: false }}
        >
          <Ionicons name="home" size={24} color={theme.colors.text} />
        </Pressable>
        <Text style={styles.title}>
          Level {currentLevel?.id} - {currentLevel?.name}
        </Text>
        <View style={styles.timerContainer}>
          <Text style={styles.timerText}>⏱️ {currentTime}s</Text>
        </View>
      </View>

      <View style={styles.gameArea}>
        <View style={styles.gameContainer}>
          <PuzzleBoard
            tiles={tiles}
            onTileDrag={handleTileDrag}
            size={PUZZLE_SIZE}
            image={currentLevel?.image}
            emptySlotTile={emptySlotTile}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <PastelButton
          title="Shuffle Tiles"
          onPress={handleShuffle}
          variant="warning"
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    position: "relative",
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  backButton: {
    position: "absolute",
    left: 20,
    padding: 12,
    backgroundColor: theme.colors.secondary,
    borderRadius: theme.borderRadius.md,
    ...theme.shadows.sm,
    justifyContent: "center",
    alignItems: "center",
    minWidth: 48,
    minHeight: 48,
  },
  title: {
    fontSize: theme.typography.sizes.lg,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "center",
    flex: 1,
    color: theme.colors.text,
  },
  timerContainer: {
    position: "absolute",
    top: 10,
    right: 20,
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
  gameArea: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.md,
  },
  gameContainer: {
    position: "relative",
    width: PUZZLE_SIZE,
    height: PUZZLE_BOARD_HEIGHT,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.lg,
    overflow: "hidden",
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 40,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
  },
});
