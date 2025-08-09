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
import { ButtonPresets, Icon } from "../components";
import { useApp } from "../contexts/AppProvider";
import SettingsModal from "../components/SettingsModal";
import theme, { getRarityColor } from "../theme";
import AsyncStorage from "@react-native-async-storage/async-storage";

const windowWidth = Dimensions.get("window").width;
const LEVEL_SIZE = (windowWidth - 60) / 3; // 3 levels per row with margins

// Animated Sparkle Component
const AnimatedSparkle = ({ delay = 0, size = 12, color = "#FFD700" }) => {
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const scaleAnim = useRef(new Animated.Value(0.5)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animate = () => {
      Animated.sequence([
        Animated.delay(delay),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 1.2,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(rotateAnim, {
            toValue: 1,
            duration: 2400,
            useNativeDriver: true,
          }),
        ]),
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 1200,
            useNativeDriver: true,
          }),
          Animated.timing(scaleAnim, {
            toValue: 0.5,
            duration: 1200,
            useNativeDriver: true,
          }),
        ]),
      ]).start(() => animate());
    };

    animate();
  }, [fadeAnim, scaleAnim, rotateAnim, delay]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  });

  return (
    <Animated.View
      style={[
        styles.sparkle,
        {
          opacity: fadeAnim,
          transform: [{ scale: scaleAnim }, { rotate: spin }],
        },
      ]}
    >
      <Text style={[styles.sparkleText, { fontSize: size, color }]}>✨</Text>
    </Animated.View>
  );
};

// Light Sweep Effect Component for Currently Playing Level
const LightSweepEffect = () => {
  const sweepAnim = useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    const animate = () => {
      Animated.loop(
        Animated.sequence([
          // Reset to starting position
          Animated.timing(sweepAnim, {
            toValue: -1,
            duration: 0, // Instant reset
            useNativeDriver: true,
          }),
          Animated.delay(200), // Much shorter wait before starting
          // Sweep from left to right
          Animated.timing(sweepAnim, {
            toValue: 1,
            duration: 800, // Faster sweep - 0.8 seconds
            useNativeDriver: true,
          }),
          Animated.delay(300), // Much shorter wait before repeating
        ])
      ).start();
    };
    animate();
  }, [sweepAnim]);

  return (
    <>
      {/* Sweeping light effect */}
      <Animated.View
        style={[
          styles.lightSweep,
          {
            transform: [
              {
                translateX: sweepAnim.interpolate({
                  inputRange: [-1, 1],
                  outputRange: [-250, 250], // Wider sweep range
                }),
              },
            ],
            opacity: sweepAnim.interpolate({
              inputRange: [-1, -0.3, 0, 0.3, 1],
              outputRange: [0, 0.9, 1, 0.9, 0], // Higher peak opacity and smoother fade
            }),
          },
        ]}
      />
    </>
  );
};

// Glowing Silhouette Component
const GlowingSilhouette = ({ image, glowColor = "#FFD700" }) => {
  const glowAnim = useRef(new Animated.Value(0.3)).current;

  useEffect(() => {
    const pulse = () => {
      Animated.sequence([
        Animated.timing(glowAnim, {
          toValue: 0.8,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(glowAnim, {
          toValue: 0.3,
          duration: 2000,
          useNativeDriver: true,
        }),
      ]).start(() => pulse());
    };

    pulse();
  }, [glowAnim]);

  return (
    <View style={styles.silhouetteContainer}>
      {/* Glow effect layers */}
      <Animated.View
        style={[
          styles.glowLayer,
          {
            opacity: glowAnim,
            shadowColor: glowColor,
            shadowOpacity: 0.8,
            shadowRadius: 20,
            elevation: 10,
          },
        ]}
      >
        <Image
          source={image}
          style={[
            styles.silhouetteImage,
            {
              tintColor: glowColor,
              opacity: 0.4,
            },
          ]}
          resizeMode="cover"
        />
      </Animated.View>

      {/* Main silhouette */}
      <Image
        source={image}
        style={[
          styles.silhouetteImage,
          {
            tintColor: "rgba(0, 0, 0, 0.8)",
            opacity: 0.6,
          },
        ]}
        resizeMode="cover"
      />
    </View>
  );
};

const HomeScreen = React.memo(function HomeScreen({
  onLevelSelect,
  levelProgress = {},
}) {
  const { setGameState, playerLevels, lastPlayedLevel } = useApp();
  const [showSettings, setShowSettings] = useState(false);

  const handleOpenSettings = useCallback(() => {
    setShowSettings(true);
  }, []);

  const handleCloseSettings = useCallback(() => {
    setShowSettings(false);
  }, []);

  const handleOpenCollection = useCallback(() => {
    setGameState("collection");
  }, [setGameState]);

  // Temporary function to reset storage for testing
  const resetStorage = useCallback(async () => {
    try {
      await AsyncStorage.clear();
      console.log("Storage cleared! Restart the app to see changes.");
      alert("Storage cleared! Restart the app to see changes.");
    } catch (error) {
      console.error("Error clearing storage:", error);
    }
  }, []);

  // Temporary function to clear collection for testing
  const clearCollectionDebug = useCallback(async () => {
    try {
      const { clearCollection } = require("../utils/collection");
      await clearCollection();
      console.log("Collection cleared!");
      alert("Collection cleared!");
    } catch (error) {
      console.error("Error clearing collection:", error);
    }
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
        unlocked: level.unlocked || false, // Use the level's unlocked property from playerLevels
        completed: false,
        stars: 0,
      };
      const isUnlocked = progress.unlocked;
      const isCompleted = progress.completed;
      const isCurrentLevel = lastPlayedLevel?.id === level.id;

      const borderColor = isUnlocked
        ? getRarityColor(level.rarity) // Always use rarity color for unlocked levels
        : theme.colors.locked;

      return (
        <TouchableOpacity
          key={level.id}
          style={[
            styles.levelCard,
            {
              backgroundColor: isUnlocked
                ? theme.colors.surface
                : theme.colors.locked,
            },
            // Apply border styles separately to ensure they override
            {
              borderColor: borderColor,
              borderWidth: 4,
              borderStyle: "solid", // Explicitly set border style
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
              style={[
                styles.levelImage,
                {
                  opacity: isUnlocked ? 1 : 0.4,
                  // Add grayscale and blur effects for locked levels
                  ...(isUnlocked
                    ? {}
                    : {
                        tintColor: "rgba(128, 128, 128, 0.8)", // Grayscale effect
                        transform: [{ scale: 0.95 }], // Slightly smaller
                      }),
                },
              ]}
              resizeMode="cover"
              fadeDuration={100}
              defaultSource={require("../assets/images/level1.png")}
            />
            {!isUnlocked && (
              <View style={styles.lockOverlay}>
                <View style={styles.blurEffect} />

                {/* Animated Sparkles - Full Container */}
                <View style={styles.sparklesContainer}>
                  <View
                    style={[
                      styles.sparklePosition,
                      { top: "10%", left: "10%" },
                    ]}
                  >
                    <AnimatedSparkle delay={0} size={10} />
                  </View>
                  <View
                    style={[
                      styles.sparklePosition,
                      { top: "20%", right: "15%" },
                    ]}
                  >
                    <AnimatedSparkle delay={500} size={8} color="#FFF" />
                  </View>
                  <View
                    style={[
                      styles.sparklePosition,
                      { bottom: "30%", left: "20%" },
                    ]}
                  >
                    <AnimatedSparkle delay={1000} size={12} />
                  </View>
                  <View
                    style={[styles.sparklePosition, { top: "5%", right: "8%" }]}
                  >
                    <AnimatedSparkle delay={1500} size={9} color="#FFE4B5" />
                  </View>
                  <View
                    style={[
                      styles.sparklePosition,
                      { bottom: "15%", right: "25%" },
                    ]}
                  >
                    <AnimatedSparkle delay={2000} size={11} color="#FFF8DC" />
                  </View>
                  <View
                    style={[styles.sparklePosition, { top: "40%", left: "5%" }]}
                  >
                    <AnimatedSparkle delay={2500} size={9} color="#FFFACD" />
                  </View>
                  <View
                    style={[
                      styles.sparklePosition,
                      { bottom: "5%", left: "8%" },
                    ]}
                  >
                    <AnimatedSparkle delay={3000} size={10} color="#F0E68C" />
                  </View>
                  <View
                    style={[
                      styles.sparklePosition,
                      { top: "60%", right: "10%" },
                    ]}
                  >
                    <AnimatedSparkle delay={3500} size={8} color="#FFD700" />
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

          {/* Level Info */}
          <View style={styles.levelInfo}>
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
            {isCompleted && renderStars(progress.stars)}
            <Text style={styles.levelNumber}>Level {level.id}</Text>
          </View>

          {/* Light sweep effect covering the entire card */}
          {isCurrentLevel && <LightSweepEffect />}
        </TouchableOpacity>
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
          <View style={styles.headerTop}>
            <Pressable
              onPress={handleOpenCollection}
              style={({ pressed }) => [
                styles.collectionButton,
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

            <View style={styles.titleContainer}>
              <Image
                source={require("../assets/icon.png")}
                style={styles.titleIcon}
                resizeMode="contain"
              />
              <Text style={styles.title}>Puzz</Text>
            </View>

            <Pressable
              onPress={handleOpenSettings}
              style={({ pressed }) => [
                styles.settingsButton,
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

            {/* Temporary Reset Button for Testing */}
            <Pressable
              onPress={resetStorage}
              style={({ pressed }) => [
                styles.settingsButton,
                { backgroundColor: "#FF6B6B" }, // Red background
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="refresh"
                size={theme.iconStyles.sizes.lg}
                variant="navigationButton"
                bright
              />
            </Pressable>

            {/* Temporary Clear Collection Button for Testing */}
            <Pressable
              onPress={clearCollectionDebug}
              style={({ pressed }) => [
                styles.settingsButton,
                { backgroundColor: "#FF9500" }, // Orange background
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Icon
                name="images"
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
    backgroundColor: theme.colors.background,
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
  collectionButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },
  titleIcon: {
    width: 32,
    height: 32,
    marginRight: theme.spacing.sm,
  },
  title: {
    fontSize: 24,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
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
  lightSweep: {
    position: "absolute",
    top: 0, // Start from the very top of the card
    bottom: 0, // Extend to the very bottom of the card
    left: -60, // Start outside the card
    width: 60, // Thinner light sweep
    backgroundColor: "rgba(255, 255, 255, 0.9)", // Much brighter white light
    borderRadius: theme.borderRadius.lg,
    shadowColor: "#FFFFFF",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 1,
    shadowRadius: 20, // Bigger glow
    elevation: 15,
    transform: [{ skewX: "-15deg" }], // Less angled for better visibility
    // Add a gradient effect
    opacity: 0.8,
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
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  rarity: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.regular,
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
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textLight,
    textAlign: "center",
    fontStyle: "italic",
    fontWeight: theme.typography.weights.medium,
  },
});
