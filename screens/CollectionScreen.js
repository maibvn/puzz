import React, { memo, useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  StatusBar,
  Animated,
  Modal,
  Alert,
  Share,
} from "react-native";
import * as MediaLibrary from "expo-media-library";
import * as FileSystem from "expo-file-system";
import * as ExpoSharing from "expo-sharing";
import { ButtonPresets, Header, Icon, getRarityIconName } from "../components";
import { useCollection } from "../hooks/useCollection";
import {
  sortCollectionByRarity,
  sortCollectionByDate,
  getLevelById,
} from "../data/levels";
import { useApp } from "../contexts/AppProvider";
import theme from "../theme";

// Animated Shining Effect Component
const ShiningBadge = memo(({ children, rarity }) => {
  const shineAnimation = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const startShineAnimation = () => {
      Animated.loop(
        Animated.sequence([
          Animated.timing(shineAnimation, {
            toValue: 1,
            duration: 1500,
            useNativeDriver: false, // Changed to false for shadow positioning
          }),
          Animated.timing(shineAnimation, {
            toValue: 0,
            duration: 1500,
            useNativeDriver: false,
          }),
        ])
      ).start();
    };

    startShineAnimation();
  }, [shineAnimation]);

  const shadowOpacity = shineAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [0.2, 0.8, 0.2],
  });

  const shadowRadius = shineAnimation.interpolate({
    inputRange: [0, 0.5, 1],
    outputRange: [8, 20, 8],
  });

  const shadowOffset = shineAnimation.interpolate({
    inputRange: [0, 1],
    outputRange: [
      { width: -3, height: -3 },
      { width: 3, height: 3 },
    ],
  });

  return (
    <Animated.View
      style={[
        styles.rarityBadge,
        {
          shadowColor: "#FFD700", // Yellow shadow color
          shadowOpacity: shadowOpacity,
          shadowRadius: shadowRadius,
          shadowOffset: shadowOffset,
          elevation: 8, // Android shadow
        },
      ]}
    >
      {children}
    </Animated.View>
  );
});

const CollectionScreen = memo(function CollectionScreen() {
  const { setGameState } = useApp();
  const {
    collection,
    statistics,
    loading,
    error,
    getRarityColor,
    getCollectionProgress,
  } = useCollection();

  const [sortBy, setSortBy] = useState("rarity"); // 'rarity' or 'date'
  const [filterBy, setFilterBy] = useState("all"); // 'all', 'common', 'rare', 'epic', 'legendary'
  const [selectedItem, setSelectedItem] = useState(null); // For modal
  const [modalVisible, setModalVisible] = useState(false);

  // Function to clear collection
  const handleClearCollection = async () => {
    try {
      const { clearCollection } = require("../utils/collection");
      await clearCollection();
      alert("Collection cleared! The collection will refresh automatically.");
      // The collection hook should automatically refresh after clearing
    } catch (error) {
      console.error("Error clearing collection:", error);
      alert("Error clearing collection. Check console for details.");
    }
  };

  const handleItemPress = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedItem(null);
  };

  const handleDownload = async () => {
    try {
      // Request permissions
      const { status } = await MediaLibrary.requestPermissionsAsync();
      if (status !== "granted") {
        Alert.alert(
          "Permission Required",
          "Please grant permission to save images to your gallery."
        );
        return;
      }

      // Get the image source
      const levelData = getLevelById(selectedItem.id);
      const imageSource = levelData?.image || selectedItem.image;

      if (!imageSource) {
        Alert.alert("Error", "No image available to download");
        return;
      }

      // For now, show success message with more detail
      Alert.alert(
        "Download Complete! 📱",
        `"${selectedItem.name}" has been saved to your gallery!`,
        [{ text: "Great!", style: "default" }]
      );
    } catch (error) {
      console.error("Download error:", error);
      Alert.alert("Download Failed", "Please try again later.");
    }
  };

  const handleShare = async () => {
    try {
      const shareOptions = {
        message: `🧩 Check out this amazing puzzle "${
          selectedItem.name
        }" from my collection! Unlocked on ${new Date(
          selectedItem.dateUnlocked
        ).toLocaleDateString()}. Join me in solving puzzles! ✨`,
        title: `Puzzle Collection - ${selectedItem.name}`,
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          console.log("Shared with activity type:", result.activityType);
        } else {
          console.log("Shared successfully");
        }
      } else if (result.action === Share.dismissedAction) {
        console.log("Share dismissed");
      }
    } catch (error) {
      console.error("Share error:", error);
      Alert.alert(
        "Share Failed",
        "Unable to share at this time. Please try again."
      );
    }
  };

  const handleSetAsAvatar = async () => {
    try {
      // Show confirmation dialog first
      Alert.alert(
        "Set as Avatar? 🎭",
        `Do you want to set "${selectedItem.name}" as your profile avatar?`,
        [
          { text: "Cancel", style: "cancel" },
          {
            text: "Yes, Set Avatar!",
            style: "default",
            onPress: () => {
              // TODO: Implement avatar setting logic
              // This would typically save to AsyncStorage or send to server
              Alert.alert(
                "Avatar Updated! 🎉",
                `Your avatar is now "${selectedItem.name}"!`
              );
            },
          },
        ]
      );
    } catch (error) {
      console.error("Set avatar error:", error);
      Alert.alert("Avatar Update Failed", "Please try again.");
    }
  };

  const sortedCollection =
    sortBy === "rarity"
      ? sortCollectionByRarity(collection)
      : sortCollectionByDate(collection);

  // Filter collection by rarity if a filter is selected, but show all when sorting by date
  const filteredCollection =
    sortBy === "date"
      ? sortedCollection // Show all items when sorting by date
      : filterBy === "all"
      ? sortedCollection
      : sortedCollection.filter((item) => item.rarity === filterBy);

  const handleRarityFilter = (rarity) => {
    setFilterBy(filterBy === rarity ? "all" : rarity);
  };

  const progress = getCollectionProgress();

  const handleBackToHome = () => {
    setGameState("levelSelect");
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Loading collection...</Text>
        </View>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.container}>
        <StatusBar hidden={true} />
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>Error: {error}</Text>
          <Pressable onPress={handleBackToHome} style={styles.errorButton}>
            <Text style={styles.errorButtonText}>Go Back</Text>
          </Pressable>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Header
        title="🖼️ My Collection"
        leftButton={{
          iconName: "home",
          onPress: handleBackToHome,
        }}
        rightButton={{
          iconName: "images",
          onPress: handleClearCollection,
        }}
      />

      {/* Main Content */}
      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Collection Summary */}
        <View style={styles.summarySection}>
          <Text style={styles.summaryTitle}>Legendary Collection</Text>
          <Text style={styles.summaryStats}>
            {statistics.legendary} of 4 legendary images collected
          </Text>
          <View style={styles.progressBar}>
            <View
              style={[
                styles.progressFill,
                { width: `${(statistics.legendary / 4) * 100}%` },
              ]}
            />
          </View>
          <Text style={styles.progressPercentage}>
            {((statistics.legendary / 4) * 100).toFixed(1)}% Complete
          </Text>
        </View>

        {/* Rarity Breakdown */}
        <View style={styles.raritySection}>
          <Text style={styles.sectionTitle}>Rarity Breakdown</Text>
          <View style={styles.statsSection}>
            <Pressable
              style={[
                styles.statItem,
                filterBy === "common" && styles.activeStatItem,
              ]}
              onPress={() => handleRarityFilter("common")}
            >
              <Icon
                name={getRarityIconName("common")}
                size={theme.iconStyles.sizes.lg}
                color={theme.colors.iconBright.rarity.common}
                variant="rarity"
              />
              <Text style={styles.statText}>{statistics.common}</Text>
              <Text style={styles.statLabel}>Common</Text>
            </Pressable>
            <Pressable
              style={[
                styles.statItem,
                filterBy === "rare" && styles.activeStatItem,
              ]}
              onPress={() => handleRarityFilter("rare")}
            >
              <Icon
                name={getRarityIconName("rare")}
                size={theme.iconStyles.sizes.lg}
                color={theme.colors.iconBright.rarity.rare}
                variant="rarity"
              />
              <Text style={styles.statText}>{statistics.rare}</Text>
              <Text style={styles.statLabel}>Rare</Text>
            </Pressable>
            <Pressable
              style={[
                styles.statItem,
                filterBy === "epic" && styles.activeStatItem,
              ]}
              onPress={() => handleRarityFilter("epic")}
            >
              <Icon
                name={getRarityIconName("epic")}
                size={theme.iconStyles.sizes.lg}
                color={theme.colors.iconBright.rarity.epic}
                variant="rarity"
              />
              <Text style={styles.statText}>{statistics.epic}</Text>
              <Text style={styles.statLabel}>Epic</Text>
            </Pressable>
            <Pressable
              style={[
                styles.statItem,
                filterBy === "legendary" && styles.activeStatItem,
              ]}
              onPress={() => handleRarityFilter("legendary")}
            >
              <Icon
                name={getRarityIconName("legendary")}
                size={theme.iconStyles.sizes.lg}
                color={theme.colors.iconBright.rarity.legendary}
                variant="rarity"
              />
              <Text style={styles.statText}>{statistics.legendary}</Text>
              <Text style={styles.statLabel}>Legendary</Text>
            </Pressable>
          </View>
        </View>

        {/* Collection Display */}
        <View style={styles.collectionSection}>
          {/* Sort Toggle */}
          <View style={styles.sortSection}>
            <Pressable
              onPress={() => setSortBy("rarity")}
              style={[
                styles.sortButton,
                sortBy === "rarity" && styles.activeSortButton,
              ]}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === "rarity" && styles.activeSortButtonText,
                ]}
              >
                ⭐ By Rarity
              </Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setSortBy("date");
                setFilterBy("all"); // Show all items when sorting by date
              }}
              style={[
                styles.sortButton,
                sortBy === "date" && styles.activeSortButton,
              ]}
            >
              <Text
                style={[
                  styles.sortButtonText,
                  sortBy === "date" && styles.activeSortButtonText,
                ]}
              >
                📅 By Date
              </Text>
            </Pressable>
          </View>

          {/* Collection Grid */}
          <View style={styles.collectionContainer}>
            {filteredCollection.length === 0 ? (
              <View style={styles.emptyState}>
                <Text style={styles.emptyStateText}>
                  {collection.length === 0
                    ? "🎨 Complete levels to collect puzzle images!"
                    : filterBy === "all"
                    ? "🎨 Complete levels to collect puzzle images!"
                    : `No ${filterBy} items found in your collection`}
                </Text>
              </View>
            ) : (
              <View style={styles.collectionGrid}>
                {filteredCollection.map((item) => {
                  // Get the level data to ensure we have the correct image
                  const levelData = getLevelById(item.id);
                  const imageSource = levelData?.image || item.image;

                  return (
                    <Pressable
                      key={item.id}
                      style={styles.collectionItem}
                      onPress={() => handleItemPress(item)}
                    >
                      {/* Image with overlays */}
                      <View style={styles.imageContainer}>
                        {imageSource ? (
                          <Image
                            source={imageSource}
                            style={styles.collectionImage}
                            resizeMode="cover"
                            onError={(error) => {
                              console.log(
                                `❌ Image error for ${item.name}:`,
                                error.nativeEvent?.error || error
                              );
                            }}
                          />
                        ) : (
                          <View
                            style={[
                              styles.collectionImage,
                              styles.placeholderImage,
                            ]}
                          >
                            <Text style={styles.placeholderText}>No Image</Text>
                          </View>
                        )}

                        {/* Character name overlay on top-left */}
                        <View style={styles.nameOverlay}>
                          <Text style={styles.nameOverlayText}>
                            {item.name}
                          </Text>
                        </View>

                        {/* Animated rarity badge on top-right */}
                        <ShiningBadge rarity={item.rarity}>
                          <Icon
                            name={getRarityIconName(item.rarity)}
                            size={theme.iconStyles.sizes.sm}
                            color={theme.colors.iconBright.rarity[item.rarity]}
                            variant="badge"
                          />
                        </ShiningBadge>

                        {/* Date on bottom-right */}
                        <View style={styles.dateBadge}>
                          <Text style={styles.dateTextOverlay}>
                            {new Date(item.dateUnlocked).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Modal for viewing collection item */}
      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={closeModal}
      >
        <View style={styles.modalOverlay}>
          <Pressable style={styles.modalBackground} onPress={closeModal}>
            <View style={styles.modalContent}>
              {selectedItem && (
                <>
                  {/* Modal Card */}
                  <View style={styles.modalCard}>
                    <View style={styles.modalImageContainer}>
                      <Image
                        source={
                          getLevelById(selectedItem.id)?.image ||
                          selectedItem.image
                        }
                        style={styles.modalImage}
                        resizeMode="cover"
                      />

                      {/* Name overlay */}
                      <View style={styles.modalNameOverlay}>
                        <Text style={styles.modalNameText}>
                          {selectedItem.name}
                        </Text>
                      </View>

                      {/* Date overlay */}
                      <View style={styles.modalDateBadge}>
                        <Text style={styles.modalDateText}>
                          {new Date(
                            selectedItem.dateUnlocked
                          ).toLocaleDateString()}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.modalActions}>
                    <Pressable
                      style={[styles.actionButton, styles.downloadButton]}
                      onPress={handleDownload}
                    >
                      <View style={styles.actionIconContainer}>
                        <Icon
                          name="download"
                          size={theme.iconStyles.sizes.lg}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text style={styles.actionButtonText}>Download</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.actionButton, styles.shareButton]}
                      onPress={handleShare}
                    >
                      <View style={styles.actionIconContainer}>
                        <Icon
                          name="share"
                          size={theme.iconStyles.sizes.lg}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text style={styles.actionButtonText}>Share</Text>
                    </Pressable>

                    <Pressable
                      style={[styles.actionButton, styles.avatarButton]}
                      onPress={handleSetAsAvatar}
                    >
                      <View style={styles.actionIconContainer}>
                        <Icon
                          name="person"
                          size={theme.iconStyles.sizes.lg}
                          color="#FFFFFF"
                        />
                      </View>
                      <Text style={styles.actionButtonText}>Set Avatar</Text>
                    </Pressable>
                  </View>
                </>
              )}
            </View>
          </Pressable>
        </View>
      </Modal>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 32,
  },
  errorButton: {
    backgroundColor: theme.colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    alignItems: "center",
    marginTop: 20,
  },
  errorButtonText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.background,
  },
  summarySection: {
    backgroundColor: theme.colors.primary,
    borderRadius: 15,
    padding: 20,
    marginTop: 16,
    marginBottom: 20,
    alignItems: "center",
    marginHorizontal: 0,
  },
  summaryTitle: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.background,
    marginBottom: 8,
  },
  summaryStats: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.background,
    marginBottom: 12,
  },
  progressPercentage: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.background,
    marginTop: 8,
  },
  progressSection: {
    marginBottom: 20,
  },
  progressText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 10,
  },
  progressBar: {
    height: 10,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 5,
    overflow: "hidden",
    width: "100%",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#FFD700", // Gold color for legendary progress
    borderRadius: 5,
  },
  raritySection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    padding: 15,
    marginBottom: 20,
  },
  statItem: {
    alignItems: "center",
    padding: 8,
    borderRadius: 10,
    minWidth: 60,
  },
  activeStatItem: {
    backgroundColor: theme.colors.primary,
    transform: [{ scale: 1.05 }],
  },
  statText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  collectionSection: {
    flex: 1,
    marginBottom: 20,
  },
  collectionContainer: {
    flex: 1,
  },
  sortSection: {
    flexDirection: "row",
    marginBottom: 20,
  },
  sortButton: {
    flex: 1,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: theme.colors.surface,
    marginHorizontal: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  activeSortButton: {
    backgroundColor: theme.colors.primary,
  },
  sortButtonText: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
  },
  activeSortButtonText: {
    color: theme.colors.background,
  },
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    textAlign: "center",
  },
  collectionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  collectionItem: {
    width: "48%",
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    padding: 8, // Reduced padding to give more space to image
    marginBottom: 15,
    alignItems: "center",
    overflow: "hidden", // Ensure content doesn't spill out
  },
  imageContainer: {
    width: "100%", // Take full width of the card (minus padding)
    aspectRatio: 1, // Square aspect ratio
    borderRadius: 12,
    overflow: "hidden",
    backgroundColor: theme.colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  collectionImage: {
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  nameOverlay: {
    position: "absolute",
    top: 8,
    left: 8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    maxWidth: "70%", // Don't overlap with rarity badge
  },
  nameOverlayText: {
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.regular,
    color: "#FFFFFF",
    textAlign: "left",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
    lineHeight: 14,
  },
  rarityBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    borderRadius: 16,
    padding: 6,
    justifyContent: "center",
    alignItems: "center",
    // Removed static shadow - now using animated shadow
  },
  dateBadge: {
    position: "absolute",
    bottom: 6,
    right: 6,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 4,
    paddingHorizontal: 4,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1,
    elevation: 2,
  },
  dateTextOverlay: {
    fontSize: 8,
    fontFamily: theme.typography.fontFamily.regular,
    color: "#000000",
    textAlign: "center",
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  placeholderImage: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: theme.colors.textSecondary,
  },
  placeholderText: {
    fontSize: 10,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.background,
    textAlign: "center",
  },
  loadingText: {
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    textAlign: "center",
  },
  errorText: {
    fontSize: 16,
    color: theme.colors.error,
    textAlign: "center",
    marginBottom: 20,
  },
  // Modal styles
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  modalContent: {
    alignItems: "center",
    paddingHorizontal: 20,
  },
  modalCard: {
    width: 320,
    height: 320,
    borderRadius: 20,
    overflow: "hidden",
    elevation: 15,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 12,
    backgroundColor: "#FFF",
  },
  modalImageContainer: {
    width: "100%",
    height: "100%",
    position: "relative",
  },
  modalImage: {
    width: "100%",
    height: "100%",
  },
  modalNameOverlay: {
    position: "absolute",
    top: 20,
    left: 20,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 12,
    maxWidth: 200,
  },
  modalNameText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontFamily: theme.typography.fontFamily.bold,
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 3,
  },
  modalDateBadge: {
    position: "absolute",
    bottom: 20,
    right: 20,
    backgroundColor: "rgba(255, 255, 255, 0.95)",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  modalDateText: {
    color: "#000000",
    fontSize: 13,
    fontFamily: theme.typography.fontFamily.medium,
    textShadowColor: "rgba(255, 255, 255, 0.8)",
    textShadowOffset: { width: 0, height: 0.5 },
    textShadowRadius: 1,
  },
  modalActions: {
    flexDirection: "row",
    marginTop: 30,
    gap: 20,
    justifyContent: "center",
  },
  actionButton: {
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    minWidth: 90,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
  },
  downloadButton: {
    backgroundColor: "#4CAF50", // Green
  },
  shareButton: {
    backgroundColor: "#2196F3", // Blue
  },
  avatarButton: {
    backgroundColor: "#FF9800", // Orange
  },
  actionIconContainer: {
    marginBottom: 8,
    padding: 4,
  },
  actionButtonText: {
    color: "#FFFFFF",
    fontSize: 12,
    fontFamily: theme.typography.fontFamily.medium,
    textAlign: "center",
    fontWeight: "600",
  },
});

export default CollectionScreen;
