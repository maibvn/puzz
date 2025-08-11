import React from "react";
import { View, StyleSheet, Text } from "react-native";
import { AppProvider, useApp } from "./contexts/AppProvider";
import HomeScreen from "./screens/HomeScreen";
import GameScreen from "./screens/GameScreen";
import CollectionScreen from "./screens/CollectionScreen";
import RankingsScreen from "./screens/RankingsScreen";
import WinScreen from "./components/WinScreen";
import { Button } from "./components";
import theme from "./theme";
import UserScreen from "./screens/UserScreen";

const PUZZLE_SIZE = 320;
const PUZZLE_BOARD_HEIGHT = PUZZLE_SIZE + PUZZLE_SIZE / 3;

function AppContent() {
  const {
    gameState,
    currentLevel,
    setGameState,
    setCurrentLevel,
    setLastPlayedLevel,
    levelProgress,
    completionStats,
    playerLevels,
  } = useApp();

  const handleLevelSelect = (level) => {
    setCurrentLevel(level);
    setLastPlayedLevel(level); // Track the last played level
    setGameState("playing");
  };

  const handleNextLevel = () => {
    const nextLevelId = currentLevel.id + 1;
    const nextLevel = playerLevels.find((l) => l.id === nextLevelId);
    if (nextLevel && levelProgress[nextLevelId]?.unlocked) {
      setCurrentLevel(nextLevel);
      setLastPlayedLevel(nextLevel); // Update last played level
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

  if (gameState === "user") {
    return <UserScreen />;
  }
  // if (gameState === "collection") {
  //   return <CollectionScreen />;
  // }

  if (gameState === "rankings") {
    return <RankingsScreen />;
  }

  if (gameState === "won") {
    return (
      <View style={[styles.container, styles.darkContainer]}>
        <View style={styles.winContainer}>
          <WinScreen
            width={PUZZLE_SIZE}
            height={PUZZLE_BOARD_HEIGHT}
            image={currentLevel?.image}
            levelName={currentLevel?.name}
            completionStats={completionStats}
          />
          <View style={styles.winButtons}>
            <Button
              title="Next Level"
              onPress={handleNextLevel}
              variant="success"
              size="lg"
              iconName="arrow-forward"
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
  darkContainer: {
    backgroundColor: "rgba(0, 0, 0, 0.9)", // Dark background for whole app during win
  },
  winContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: theme.spacing.lg,
  },
  winButtons: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 180, // Custom large spacing to move button down
    width: "100%", // Full width to ensure centering
  },
});
