import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  Pressable,
  StatusBar,
} from "react-native";
import {
  Button,
  ButtonPresets,
  Header,
  Icon,
  PuzzleBoard,
  Timer,
  PauseModal,
} from "../components";
import { getStarsForTime } from "../data/levels";
import { useApp } from "../contexts/AppProvider";
import theme from "../theme";

const windowWidth = Dimensions.get("window").width;
const PUZZLE_SIZE = Math.min(windowWidth - 32, 320);
const PUZZLE_BOARD_HEIGHT = PUZZLE_SIZE + PUZZLE_SIZE / 3;
const BOARD_SIZE = 3;

export default function GameScreen() {
  const {
    currentLevel,
    setGameState,
    playMoveSound,
    playVictorySound,
    handleLevelComplete,
  } = useApp();

  // Game-specific state
  const [startTime, setStartTime] = useState(Date.now());
  const [currentTime, setCurrentTime] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [pauseStartTime, setPauseStartTime] = useState(null); // Track when pause started
  const [timerKey, setTimerKey] = useState(0); // Key to force timer reset only when needed
  const [tiles, setTiles] = useState([
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
  ]);
  const [emptySlotTile, setEmptySlotTile] = useState(null);

  // Initialize game when component mounts
  useEffect(() => {
    setStartTime(Date.now());
    setPauseStartTime(null);
    setIsPaused(false);
    setCurrentTime(0);
    setTimerKey((prev) => prev + 1); // Force timer reset
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

  const handleTimeUpdate = useCallback((time) => {
    setCurrentTime(time);
  }, []);

  const handlePause = useCallback(() => {
    setPauseStartTime(Date.now());
    setIsPaused(true);
  }, []);

  const handleResume = useCallback(() => {
    if (pauseStartTime) {
      // Calculate how long we were paused
      const pauseDuration = Date.now() - pauseStartTime;
      // Adjust the start time to account for the pause
      setStartTime((prevStartTime) => prevStartTime + pauseDuration);
      setPauseStartTime(null);
    }
    setIsPaused(false);
  }, [pauseStartTime]);

  const handleRestart = useCallback(() => {
    setIsPaused(false);
    setStartTime(Date.now());
    setPauseStartTime(null);
    setTimerKey((prev) => prev + 1); // Force timer reset
    setTiles([
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
    ]);
    setEmptySlotTile(null);
    // Auto shuffle for gameplay
    setTimeout(() => handleShuffle(), 100);
  }, []);

  const handleHomeFromPause = useCallback(() => {
    setIsPaused(false);
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

  const handleMove = (newTiles, emptySlot) => {
    const isWinning = checkWin(newTiles, emptySlot);

    if (isWinning) {
      playVictorySound();
      handleLevelCompleteLocal();
    } else {
      playMoveSound();
    }
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
      handleMove(newTiles, movedTile);
      return;
    }

    // Check if moving from empty slot back to grid
    if (row === 3 && col === 2 && emptySlotTile !== null) {
      if (direction === "up" && newTiles[2][2] === null) {
        newTiles[2][2] = emptySlotTile;
        setTiles(newTiles);
        setEmptySlotTile(null);
        handleMove(newTiles, null);
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
        handleMove(newTiles, emptySlotTile);
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
      <Header
        title={`Level ${currentLevel?.id}`}
        leftButton={{
          iconName: "pause",
          onPress: handlePause,
        }}
        rightButton={{
          component: (
            <Timer
              key={`${currentLevel?.id}-${timerKey}`}
              startTime={startTime}
              onTimeUpdate={handleTimeUpdate}
              paused={isPaused}
              containerStyle={styles.timerContainer}
            />
          ),
        }}
      />

      <View style={styles.gameArea}>
        <View style={styles.gameContainer}>
          <PuzzleBoard
            tiles={tiles}
            onTileDrag={isPaused ? null : handleTileDrag}
            size={PUZZLE_SIZE}
            image={currentLevel?.image}
            emptySlotTile={emptySlotTile}
          />
        </View>
      </View>

      <View style={styles.footer}>
        <Button
          title="Shuffle Tiles"
          onPress={handleShuffle}
          variant="warning"
          size="md"
        />
      </View>

      {/* Pause Modal */}
      <PauseModal
        visible={isPaused}
        onResume={handleResume}
        onRestart={handleRestart}
        onHome={handleHomeFromPause}
        onClose={handleResume}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  timerContainer: {
    // Custom timer container styles if needed
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
    backgroundColor: "transparent", // Transparent background
    // borderRadius: theme.borderRadius.lg,
    // ...theme.shadows.lg,
    overflow: "hidden",
  },
  footer: {
    paddingBottom: 60,
    paddingHorizontal: 40,
    alignItems: "center",
    backgroundColor: theme.colors.background,
  },
});
