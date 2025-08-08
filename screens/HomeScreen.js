import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Dimensions,
  StatusBar,
  Pressable,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LEVELS, getDifficultyColor } from "../data/levels";
import { useApp } from "../contexts/AppProvider";
import SettingsModal from "../components/SettingsModal";
import theme from "../theme";

const windowWidth = Dimensions.get("window").width;
const LEVEL_SIZE = (windowWidth - 60) / 3; // 3 levels per row with margins

const HomeScreen = React.memo(function HomeScreen({
  onLevelSelect,
  levelProgress = {},
}) {
  const [showSettings, setShowSettings] = useState(false);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const renderStars = (stars) => {
    return (
      <View style={styles.starsContainer}>
        {[1, 2, 3].map((star) => (
          <Text
            key={star}
            style={[
              styles.star,
              {
                color:
                  star <= stars
                    ? theme.colors.starActive
                    : theme.colors.starInactive,
              },
            ]}
          >
            ⭐
          </Text>
        ))}
      </View>
    );
  };

  const renderLevel = useCallback(
    (level) => {
      const progress = levelProgress?.[level.id] || {
        unlocked: level.id === 1,
        completed: false,
        stars: 0,
      };
      const isUnlocked = progress.unlocked;
      const isCompleted = progress.completed;

      return (
        <TouchableOpacity
          key={level.id}
          style={[
            styles.levelCard,
            {
              backgroundColor: isUnlocked
                ? theme.colors.surface
                : theme.colors.locked,
              borderColor: isCompleted
                ? theme.colors.completed
                : isUnlocked
                ? getDifficultyColor(level.difficulty)
                : theme.colors.locked,
            },
          ]}
          onPress={() => isUnlocked && onLevelSelect(level)}
          disabled={!isUnlocked}
          activeOpacity={0.7}
        >
          {/* Level Image Preview */}
          <View style={styles.imageContainer}>
            <Image
              source={level.image}
              style={[styles.levelImage, { opacity: isUnlocked ? 1 : 0.3 }]}
              resizeMode="cover"
              fadeDuration={100}
              defaultSource={require("../assets/images/level1.png")}
            />
            {!isUnlocked && (
              <View style={styles.lockOverlay}>
                <Text style={styles.lockIcon}>🔒</Text>
              </View>
            )}
            {isCompleted && (
              <View style={styles.completedOverlay}>
                <Text style={styles.checkIcon}>✅</Text>
              </View>
            )}
          </View>

          {/* Level Info */}
          <View style={styles.levelInfo}>
            <Text style={styles.levelNumber}>Level {level.id}</Text>
            <Text style={[styles.levelName, { opacity: isUnlocked ? 1 : 0.5 }]}>
              {level.name}
            </Text>
            <Text
              style={[
                styles.difficulty,
                { color: getDifficultyColor(level.difficulty) },
              ]}
            >
              {level.difficulty.toUpperCase()}
            </Text>
            {isCompleted && renderStars(progress.stars)}
          </View>
        </TouchableOpacity>
      );
    },
    [levelProgress, onLevelSelect]
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerTop}>
            <Pressable
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.settingsButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="settings" size={24} color={theme.colors.text} />
            </Pressable>
            <Text style={styles.title}>🗺️ Level Select</Text>
            <View style={styles.placeholder} />
          </View>
          <Text style={styles.subtitle}>Choose your puzzle adventure!</Text>
        </View>

        <View style={styles.levelsGrid}>
          {LEVELS.map((level) => renderLevel(level))}
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>
            Complete levels to unlock new challenges!
          </Text>
        </View>
      </ScrollView>

      <SettingsModal visible={showSettings} onClose={handleCloseSettings} />
    </View>
  );
});

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  scrollContainer: {
    flex: 1,
  },
  header: {
    paddingTop: 20,
    paddingHorizontal: theme.spacing.lg,
    paddingBottom: theme.spacing.lg,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  headerTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    marginBottom: theme.spacing.sm,
  },
  settingsButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  title: {
    fontSize: theme.typography.sizes.jumbo,
    fontWeight: theme.typography.weights.extrabold,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    textAlign: "center",
    flex: 1,
  },
  placeholder: {
    width: 48, // Same width as settings button to center the title
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textLight,
    textAlign: "center",
    fontWeight: theme.typography.weights.medium,
  },
  levelsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    paddingHorizontal: theme.spacing.md,
    paddingTop: theme.spacing.lg,
  },
  levelCard: {
    width: LEVEL_SIZE,
    aspectRatio: 0.8,
    marginBottom: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    borderWidth: 3,
    ...theme.shadows.md,
    overflow: "hidden",
  },
  imageContainer: {
    flex: 1,
    position: "relative",
  },
  levelImage: {
    width: "100%",
    height: "100%",
  },
  lockOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.lockOverlay,
    justifyContent: "center",
    alignItems: "center",
  },
  lockIcon: {
    fontSize: 32,
  },
  completedOverlay: {
    position: "absolute",
    top: theme.spacing.sm,
    right: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.full,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    ...theme.shadows.sm,
  },
  checkIcon: {
    fontSize: 16,
  },
  levelInfo: {
    padding: theme.spacing.sm,
    backgroundColor: theme.colors.surface,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.tileBorder,
  },
  levelNumber: {
    fontSize: theme.typography.sizes.sm,
    fontWeight: theme.typography.weights.bold,
    color: theme.colors.text,
  },
  levelName: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.text,
    textAlign: "center",
    marginTop: 2,
    fontWeight: theme.typography.weights.medium,
  },
  difficulty: {
    fontSize: 10,
    fontWeight: theme.typography.weights.bold,
    marginTop: 2,
  },
  starsContainer: {
    flexDirection: "row",
    marginTop: theme.spacing.xs,
  },
  star: {
    fontSize: 12,
    marginHorizontal: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: theme.typography.weights.medium,
  },
});
