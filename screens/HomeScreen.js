import React, { useCallback, useState, useEffect, useRef } from "react";
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
  Animated,
} from "react-native";
import { ButtonPresets, Header, Icon, LightSweepEffect } from "../components";
import { useApp } from "../contexts/AppProvider";
import SettingsModal from "../components/SettingsModal";
import theme, { getRarityColor } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const LEVEL_SIZE = (windowWidth - 60) / 3; // 3 levels per row with margins

// Simplified Animated Sparkle Component
const AnimatedSparkle = React.memo(
  ({ delay = 0, size = 12, color = "#FFD700" }) => {
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
      const animate = () => {
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: true,
          }),
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: true,
          }),
        ]).start(() => animate());
      };

      animate();
    }, [fadeAnim, delay]);

    return (
      <Animated.View
        style={[
          styles.sparkle,
          {
            opacity: fadeAnim,
          },
        ]}
      >
        <Text style={[styles.sparkleText, { fontSize: size, color }]}>✨</Text>
      </Animated.View>
    );
  }
);

// Optimized Level Image Component with lazy loading
const LevelImage = React.memo(({ level, isUnlocked, style }) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <Image
      source={level.image}
      style={[styles.levelImage, style, !imageLoaded && { opacity: 0 }]}
      resizeMode="cover"
      fadeDuration={200}
      onLoad={() => setImageLoaded(true)}
      // Use lower quality for locked levels to save memory
      resizeMethod={isUnlocked ? "resize" : "scale"}
    />
  );
});
// Simplified Glowing Silhouette Component
const GlowingSilhouette = React.memo(({ image, glowColor = "#FFD700" }) => {
  const glowAnim = useRef(new Animated.Value(0.4)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.4,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [glowAnim]);

  return (
    <View style={styles.silhouetteContainer}>
      {/* Single animated silhouette layer */}
      <Animated.View
        style={[
          styles.glowLayer,
          {
            opacity: glowAnim,
            shadowColor: glowColor,
            shadowOpacity: 0.6,
            shadowRadius: 15,
            elevation: 8,
          },
        ]}
      >
        <Image
          source={image}
          style={[
            styles.silhouetteImage,
            {
              tintColor: glowColor,
              opacity: 0.7,
            },
          ]}
          resizeMode="cover"
        />
      </Animated.View>
    </View>
  );
});

// Optimized Level Card Component
const LevelCard = React.memo(
  ({
    level,
    progress,
    isUnlocked,
    isCompleted,
    isCurrentLevel,
    borderColor,
    onPress,
  }) => {
    const renderStars = useCallback((stars) => {
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
    }, []);

    return (
      <TouchableOpacity
        style={[
          styles.levelCard,
          {
            backgroundColor: isUnlocked
              ? theme.colors.surface
              : theme.colors.locked,
            borderColor: borderColor,
            borderWidth: 4,
            borderStyle: "solid",
          },
        ]}
        onPress={onPress}
        disabled={!isUnlocked}
        activeOpacity={0.7}
      >
        {/* Level Image Preview */}
        <View style={styles.imageContainer}>
          <LevelImage
            level={level}
            isUnlocked={isUnlocked}
            style={{
              opacity: isUnlocked ? 1 : 0.4,
              ...(isUnlocked
                ? {}
                : {
                    tintColor: "rgba(128, 128, 128, 0.8)",
                    transform: [{ scale: 0.95 }],
                  }),
            }}
          />
          {!isUnlocked && (
            <View style={styles.lockOverlay}>
              <View style={styles.blurEffect} />

              {/* Reduced Animated Sparkles - Only 3 sparkles */}
              <View style={styles.sparklesContainer}>
                <View
                  style={[styles.sparklePosition, { top: "20%", left: "15%" }]}
                >
                  <AnimatedSparkle delay={0} size={10} />
                </View>
                <View
                  style={[styles.sparklePosition, { top: "40%", right: "20%" }]}
                >
                  <AnimatedSparkle delay={800} size={8} color="#FFF" />
                </View>
                <View
                  style={[
                    styles.sparklePosition,
                    { bottom: "25%", left: "25%" },
                  ]}
                >
                  <AnimatedSparkle delay={1600} size={12} />
                </View>
              </View>

              {/* Glowing Silhouette */}
              <View style={styles.mysteryContent}>
                <GlowingSilhouette
                  image={level.image}
                  glowColor={getRarityColor(level.rarity)}
                />

                {/* Mystery Text */}
                <View style={styles.mysteryTextContainer}>
                  <Icon
                    name="diamond"
                    size={theme.iconStyles.sizes.sm}
                    variant="badge"
                    bright
                  />
                  <Text style={styles.mysteryText}>MYSTERY</Text>
                </View>
              </View>
            </View>
          )}
        </View>

        {/* Stars positioned in the middle between image and level info */}
        {isCompleted && (
          <View style={styles.starsMiddleContainer}>
            <View style={styles.starsRow}>{renderStars(progress.stars)}</View>
          </View>
        )}

        {/* Level Info */}
        <View
          style={[
            styles.levelInfo,
            { backgroundColor: `${theme.colors.surface}CC` },
          ]}
        >
          <Text
            style={[
              styles.rarity,
              {
                color: isUnlocked
                  ? getRarityColor(level.rarity)
                  : theme.colors.textLight,
                opacity: isUnlocked ? 1 : 0.6,
              },
            ]}
          >
            {isUnlocked ? level.rarity.toUpperCase() : "LOCKED"}
          </Text>
          <Text style={styles.levelNumber}>Level {level.id}</Text>
        </View>

        {/* Light sweep effect covering the entire card */}
        {isCurrentLevel && <LightSweepEffect />}
      </TouchableOpacity>
    );
  }
);

const HomeScreen = React.memo(function HomeScreen({
  onLevelSelect,
  levelProgress = {},
}) {
  const { setGameState, playerLevels, lastPlayedLevel } = useApp();
  const settingsModalRef = useRef(null);

  const handleOpenSettings = useCallback(() => {
    settingsModalRef.current?.open();
  }, []);

  const handleCloseSettings = useCallback(() => {
    settingsModalRef.current?.close();
  }, []);

  const handleOpenCollection = useCallback(() => {
    setGameState("collection");
  }, [setGameState]);

  // Combined function to reset both storage and collection
  const resetAllData = useCallback(async () => {
    try {
      // Clear AsyncStorage
      await AsyncStorage.clear();

      // Clear collection
      const { clearCollection } = require("../utils/collection");
      await clearCollection();

      console.log("All data cleared! Restart the app to see changes.");
      alert(
        "All data cleared! Stars and achievements reset. Restart the app to see changes."
      );
    } catch (error) {
      console.error("Error clearing data:", error);
      alert("Error clearing data. Check console for details.");
    }
  }, []);

  // Function to show rankings
  const handleShowRankings = useCallback(() => {
    setGameState("rankings");
  }, [setGameState]);

  const renderLevel = useCallback(
    (level) => {
      const progress = levelProgress?.[level.id] || {
        unlocked: level.unlocked || false,
        completed: false,
        stars: 0,
      };
      const isUnlocked = progress.unlocked;
      const isCompleted = progress.completed;
      const isCurrentLevel = lastPlayedLevel?.id === level.id;

      const borderColor = isUnlocked
        ? isCompleted
          ? theme.colors.success
          : theme.colors.accent
        : theme.colors.locked;

      return (
        <LevelCard
          key={level.id}
          level={level}
          progress={progress}
          isUnlocked={isUnlocked}
          isCompleted={isCompleted}
          isCurrentLevel={isCurrentLevel}
          borderColor={borderColor}
          onPress={() => isUnlocked && onLevelSelect(level)}
        />
      );
    },
    [levelProgress, onLevelSelect, lastPlayedLevel]
  );

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          {/* First row: Game icon and title */}
          <View style={styles.titleRow}>
            <Image
              source={require("../assets/icon.png")}
              style={styles.titleIcon}
              resizeMode="contain"
            />
            <Text style={styles.title}>Puzz</Text>
          </View>

          {/* Second row: Action buttons */}
          <View style={styles.buttonsRow}>
            {/* Clear All Data Button (Trash Icon) */}
            <Pressable
              onPress={resetAllData}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="trash"
                size={theme.iconStyles.sizes.lg}
                variant="navigationButton"
                bright
              />
            </Pressable>

            {/* Collection Button */}
            <Pressable
              onPress={handleOpenCollection}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="albums-outline"
                size={theme.iconStyles.sizes.lg}
                variant="navigationButton"
                bright
              />
            </Pressable>

            {/* Rankings Button (Cup Icon) */}
            <Pressable
              onPress={handleShowRankings}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="trophy"
                size={theme.iconStyles.sizes.lg}
                variant="navigationButton"
                bright
              />
            </Pressable>

            {/* Settings Button */}
            <Pressable
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="settings"
                size={theme.iconStyles.sizes.lg}
                variant="navigationButton"
                bright
              />
            </Pressable>
          </View>
        </View>

        <View style={styles.levelsGrid}>
          {playerLevels.map((level) => renderLevel(level))}
        </View>
      </ScrollView>

      <SettingsModal ref={settingsModalRef} />
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
    backgroundColor: theme.colors.headerBackground,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: theme.spacing.lg,
  },
  buttonsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: theme.spacing.xl,
  },
  actionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.lg,
    backgroundColor: theme.colors.headerButtonBg, // Use consistent red background
    ...theme.shadows.sm,
    minWidth: 52,
    minHeight: 52,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: theme.spacing.xs,
  },
  titleIcon: {
    width: 48, // Bigger icon
    height: 48, // Bigger icon
    marginRight: theme.spacing.md,
  },
  title: {
    fontSize: theme.typography.sizes.lg, // Match header component size
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.headerText,
    textAlign: "center",
  },
  subtitle: {
    fontSize: theme.typography.sizes.md,
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
    backgroundColor: "rgba(0, 0, 0, 0.85)", // Darker overlay for mystery
    justifyContent: "center",
    alignItems: "center",
  },
  blurEffect: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(30, 30, 60, 0.9)", // Deep mysterious blue-black
    borderRadius: theme.borderRadius.lg,
  },
  mysteryContent: {
    position: "relative",
    width: "90%",
    height: "90%",
    justifyContent: "center",
    alignItems: "center",
  },
  silhouetteContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
  },
  glowLayer: {
    position: "absolute",
    width: "80%",
    height: "80%",
    borderRadius: 15,
  },
  silhouetteImage: {
    width: "80%",
    height: "80%",
    borderRadius: 15,
  },
  sparklesContainer: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  sparklePosition: {
    position: "absolute",
  },
  sparkle: {
    justifyContent: "center",
    alignItems: "center",
  },
  sparkleText: {
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 5,
  },
  mysteryTextContainer: {
    position: "absolute",
    bottom: 10,
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    borderWidth: 1,
    borderColor: "rgba(255, 215, 0, 0.3)",
  },
  lockIcon: {
    fontSize: 20,
    marginBottom: 2,
    color: "#FFD700", // Gold color for mystery
    textShadowColor: "rgba(255, 215, 0, 0.8)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  mysteryText: {
    fontSize: 10,
    color: "#FFD700", // Gold color for mystery
    fontFamily: theme.typography.fontFamily.regular,
    // fontWeight: "bold",
    letterSpacing: 1,
    textShadowColor: "rgba(255, 215, 0, 0.6)",
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 4,
  },
  levelInfo: {
    padding: theme.spacing.sm,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: theme.colors.tileBorder,
  },
  levelNumber: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textLight,
  },
  rarity: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.regular,
    marginTop: 2,
  },
  starsMiddleContainer: {
    position: "absolute",
    bottom: 43, // Push down to overlay the level info section
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  starsContainer: {
    flexDirection: "row",
  },
  starsRow: {
    padding: 0,
  },
  star: {
    fontSize: 12,
    // marginHorizontal: 1,
    textShadowColor: "rgba(255, 255, 255, 1)", // White border effect
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 1,
  },
  footer: {
    padding: theme.spacing.lg,
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
  footerText: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textLight,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: theme.typography.weights.medium,
  },
});
