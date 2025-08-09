import React, { memo, useState } from "react";
import {
  View,
  Text,
  ScrollView,
  Image,
  StyleSheet,
  Pressable,
  StatusBar,
} from "react-native";
import { ButtonPresets, Icon, getRarityIconName } from "../components";
import { useCollection } from "../hooks/useCollection";
import {
  sortCollectionByRarity,
  sortCollectionByDate,
  getLevelById,
} from "../data/levels";
import { useApp } from "../contexts/AppProvider";
import theme from "../theme";

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
      <StatusBar hidden={true} />

      {/* Header with Home Button */}
      <View style={styles.header}>
        <Pressable
          onPress={handleBackToHome}
          style={({ pressed }) => [
            styles.navigationButton,
            pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
          ]}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Icon
            name="home"
            size={theme.iconStyles.sizes.lg}
            variant="navigationButton"
            bright
          />
        </Pressable>
        <Text style={styles.title}>🖼️ My Collection</Text>
        <View style={styles.headerSpacer} />
      </View>

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
                    <View key={item.id} style={styles.collectionItem}>
                      {/* Name at top */}
                      <Text style={styles.itemName}>{item.name}</Text>

                      {/* Image with rarity badge and date */}
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

                        {/* Rarity badge on top-right */}
                        <View style={styles.rarityBadge}>
                          <Icon
                            name={getRarityIconName(item.rarity)}
                            size={theme.iconStyles.sizes.sm}
                            color={theme.colors.iconBright.rarity[item.rarity]}
                            variant="badge"
                          />
                        </View>

                        {/* Date on bottom-right */}
                        <View style={styles.dateBadge}>
                          <Text style={styles.dateTextOverlay}>
                            {new Date(item.dateUnlocked).toLocaleDateString()}
                          </Text>
                        </View>
                      </View>
                    </View>
                  );
                })}
              </View>
            )}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 12,
    backgroundColor: theme.colors.background,
    borderBottomWidth: 1,
    borderBottomColor: theme.colors.surface,
  },
  navigationButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
    ...theme.shadows.sm,
  },
  headerSpacer: {
    width: 44, // Same as button width for centering
  },
  title: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    textAlign: "center",
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
    padding: 12,
    marginBottom: 15,
    alignItems: "center",
  },
  imageContainer: {
    width: 120,
    height: 120,
    borderRadius: 15,
    marginVertical: 8,
    overflow: "hidden",
    backgroundColor: theme.colors.textSecondary,
    justifyContent: "center",
    alignItems: "center",
    position: "relative",
  },
  collectionImage: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  rarityBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "rgba(255, 255, 255, 0.9)",
    borderRadius: 12,
    padding: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 5,
  },
  dateBadge: {
    position: "absolute",
    bottom: 4,
    right: 4,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.3,
    shadowRadius: 2,
    elevation: 3,
  },
  dateTextOverlay: {
    fontSize: 9,
    fontFamily: theme.typography.fontFamily.regular,
    color: "#FFFFFF",
    textAlign: "center",
    textShadowColor: "rgba(0, 0, 0, 0.8)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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
  itemName: {
    fontSize: 14,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    textAlign: "center",
    marginBottom: 0,
    lineHeight: 16,
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
});

export default CollectionScreen;
