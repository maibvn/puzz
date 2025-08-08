import React from "react";
import { View, StyleSheet } from "react-native";
import { AppProvider, useApp } from "./contexts/AppProvider";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import WinScreen from "./components/WinScreen";
import PastelButton from "./components/PastelButton";
import { LEVELS } from "./data/levels";
import theme from "./theme";

const PUZZLE_SIZE = 320;
const PUZZLE_BOARD_HEIGHT = PUZZLE_SIZE + PUZZLE_SIZE / 3;

function AppContent() {
  const {
    gameState,
    currentLevel,
    setGameState,
    setCurrentLevel,
    levelProgress,
    completionStats,
  } = useApp();

  const handleLevelSelect = (level) => {
    setCurrentLevel(level);
    setGameState("playing");
  };

  const handlePlayAgain = () => {
    if (currentLevel) {
      setGameState("playing");
    }
  };

  const handleNextLevel = () => {
    const nextLevelId = currentLevel.id + 1;
    const nextLevel = LEVELS.find((l) => l.id === nextLevelId);
    if (nextLevel && levelProgress[nextLevelId]?.unlocked) {
      setCurrentLevel(nextLevel);
      setGameState("playing");
    } else {
      setGameState("levelSelect");
    }
  };

  const handleBackToLevels = () => {
    setGameState("levelSelect");
  };

  if (gameState === "levelSelect") {
    return (
      <HomeScreen
        onLevelSelect={handleLevelSelect}
        levelProgress={levelProgress}
      />
    );
  }

  if (gameState === "playing") {
    return <GameScreen onBackToLevels={handleBackToLevels} />;
  }

  if (gameState === "won") {
    return (
      <View style={styles.container}>
        <View style={styles.winContainer}>
          <WinScreen
            width={PUZZLE_SIZE}
            height={PUZZLE_BOARD_HEIGHT}
            image={currentLevel?.image}
            completionStats={completionStats}
          />
          <View style={styles.winButtons}>
            <PastelButton
              title="Play Again"
              onPress={handlePlayAgain}
              variant="primary"
              style={{ marginRight: theme.spacing.md }}
            />
            <PastelButton
              title="Next Level"
              onPress={handleNextLevel}
              variant="success"
              style={{ marginRight: theme.spacing.md }}
            />
          </View>
        </View>
      </View>
    );
  }

  return null;
}

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  winContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  winButtons: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginTop: theme.spacing.xxl,
    flexWrap: "wrap",
  },
});
