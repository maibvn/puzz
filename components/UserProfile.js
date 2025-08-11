import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import theme from "../theme";
import { Pressable } from "react-native";
import Icon from "./Icon";

// Example user user (replace with props or context in real use)
// const user = {
//   id: 1,
//   username: "PuzzleMaster99",
//   totalStars: 51,
//   legendaryCount: 4,
//   epicCount: 12,
//   rareCount: 25,
//   commonCount: 30,
//   rank: "Master Collector",
//   avatar: require("../assets/images/level1.png"), // Example local image
// };

export default function UserProfile({ user }) {
  const {
    username,
    totalStars,
    legendaryCount,
    epicCount,
    rareCount,
    commonCount,
    rank,
    avatar,
    filterBy,
    handleRarityFilter,
    getRarityIconName,
    theme: userTheme,
    statistics,
  } = user;

  return (
    <View style={styles.container}>
      <View style={styles.avatarContainer}>
        <Image source={avatar} style={styles.avatar} />
      </View>
      <Text style={styles.username}>{username}</Text>
      <Text style={styles.rank}>{rank}</Text>
      {/* Rarity Breakdown */}
      <View style={styles.raritySection}>
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
              size={
                userTheme?.iconStyles?.sizes?.lg || theme.iconStyles.sizes.lg
              }
              color={
                userTheme?.colors?.iconBright?.rarity?.common ||
                theme.colors.iconBright.rarity.common
              }
              variant="rarity"
            />
            <Text style={styles.statText}>{commonCount}</Text>
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
              size={
                userTheme?.iconStyles?.sizes?.lg || theme.iconStyles.sizes.lg
              }
              color={
                userTheme?.colors?.iconBright?.rarity?.rare ||
                theme.colors.iconBright.rarity.rare
              }
              variant="rarity"
            />
            <Text style={styles.statText}>{rareCount}</Text>
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
              size={
                userTheme?.iconStyles?.sizes?.lg || theme.iconStyles.sizes.lg
              }
              color={
                userTheme?.colors?.iconBright?.rarity?.epic ||
                theme.colors.iconBright.rarity.epic
              }
              variant="rarity"
            />
            <Text style={styles.statText}>{epicCount}</Text>
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
              size={
                userTheme?.iconStyles?.sizes?.lg || theme.iconStyles.sizes.lg
              }
              color={
                userTheme?.colors?.iconBright?.rarity?.legendary ||
                theme.colors.iconBright.rarity.legendary
              }
              variant="rarity"
            />
            <Text style={styles.statText}>{legendaryCount}</Text>
            <Text style={styles.statLabel}>Legendary</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    backgroundColor: theme.colors.surface,
    borderRadius: 20,
    width: "100%",
    borderRadius: 15,
    paddingVertical: theme.spacing.md,
    paddingHorizontal: 0,
    // backgroundColor: "red",
    marginTop: 16,
    marginBottom: 20,
    alignItems: "center",
    marginHorizontal: 0,
    ...theme.shadows.sm,
  },
  avatarContainer: {
    borderRadius: 60,
    overflow: "hidden",
    marginBottom: 12,
    borderWidth: 3,
    borderColor: theme.colors.primary,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
  },
  username: {
    fontSize: 20,
    fontFamily: theme.typography.fontFamily.bold,
    color: theme.colors.text,
    marginBottom: 4,
  },
  rank: {
    fontSize: 14,
    color: theme.colors.textSecondary,
    marginBottom: 16,
    fontFamily: theme.typography.fontFamily.regular,
  },
  raritySection: {
    width: "100%",
    // backgroundColosr: "red",
    // padding: 0,
    // marginBottom: 20,
    margin: 0,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    marginBottom: 12,
    textAlign: "center",
  },
  statsSection: {
    // alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-around",
    backgroundColor: theme.colors.surface,
    borderRadius: 15,
    paddingHorizontal: theme.spacing.sm,
    paddingVertical: theme.spacing.md,
    // marginBottom: 20,
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
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  statLabel: {
    fontSize: theme.typography.sizes.xs,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.textSecondary,
    marginTop: 2,
  },
  //   statsRow: {
  //     flexDirection: "row",
  //     justifyContent: "space-between",
  //     width: "100%",
  //     marginTop: 8,
  //   },
  //   statBox: {
  //     alignItems: "center",
  //     flex: 1,
  //   },
  //   statValue: {
  //     fontSize: 18,
  //     fontFamily: theme.typography.fontFamily.bold,
  //     color: theme.colors.primary,
  //   },
  //   statLabel: {
  //     fontSize: 12,
  //     color: theme.colors.textSecondary,
  //     fontFamily: theme.typography.fontFamily.regular,
  //   },
});
