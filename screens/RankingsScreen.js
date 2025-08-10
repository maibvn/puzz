import React, { memo, useEffect, useState } from "react";
import { View, Text, ScrollView, StyleSheet, StatusBar } from "react-native";
import { Header, Icon } from "../components";
import { useApp } from "../contexts/AppProvider";
import { useCollection } from "../hooks/useCollection";
import theme, { getRarityColor } from "../theme";

// Dummy leaderboard data
const DUMMY_LEADERBOARD = [
  {
    id: 1,
    username: "PuzzleMaster99",
    totalStars: 51,
    legendaryCount: 4,
    epicCount: 12,
    rareCount: 25,
    commonCount: 30,
    rank: "Master Collector",
    avatar: "👑",
  },
  {
    id: 2,
    username: "StarCollector",
    totalStars: 48,
    legendaryCount: 3,
    epicCount: 15,
    rareCount: 22,
    commonCount: 28,
    rank: "Expert Puzzler",
    avatar: "⭐",
  },
  {
    id: 3,
    username: "LegendHunter",
    totalStars: 45,
    legendaryCount: 4,
    epicCount: 8,
    rareCount: 20,
    commonCount: 25,
    rank: "Master Collector",
    avatar: "🏆",
  },
  {
    id: 4,
    username: "DiamondSeeker",
    totalStars: 42,
    legendaryCount: 2,
    epicCount: 18,
    rareCount: 15,
    commonCount: 22,
    rank: "Expert Puzzler",
    avatar: "💎",
  },
  {
    id: 5,
    username: "PuzzleWizard",
    totalStars: 39,
    legendaryCount: 3,
    epicCount: 10,
    rareCount: 18,
    commonCount: 20,
    rank: "Expert Puzzler",
    avatar: "🧙",
  },
  {
    id: 6,
    username: "GemCollector",
    totalStars: 36,
    legendaryCount: 1,
    epicCount: 16,
    rareCount: 12,
    commonCount: 18,
    rank: "Skilled Player",
    avatar: "💰",
  },
  {
    id: 7,
    username: "TileExplorer",
    totalStars: 33,
    legendaryCount: 2,
    epicCount: 8,
    rareCount: 15,
    commonCount: 16,
    rank: "Skilled Player",
    avatar: "🗺️",
  },
  {
    id: 8,
    username: "ImageHunter",
    totalStars: 30,
    legendaryCount: 1,
    epicCount: 12,
    rareCount: 10,
    commonCount: 15,
    rank: "Skilled Player",
    avatar: "📷",
  },
  {
    id: 9,
    username: "RaritySeeker",
    totalStars: 27,
    legendaryCount: 1,
    epicCount: 8,
    rareCount: 12,
    commonCount: 14,
    rank: "Apprentice",
    avatar: "🔍",
  },
  {
    id: 10,
    username: "BeginnerLuck",
    totalStars: 24,
    legendaryCount: 0,
    epicCount: 10,
    rareCount: 8,
    commonCount: 12,
    rank: "Apprentice",
    avatar: "🍀",
  },
];

const RankingsScreen = memo(function RankingsScreen() {
  const { setGameState, playerLevels, levelProgress } = useApp();
  const { collection, statistics } = useCollection();
  const [playerStats, setPlayerStats] = useState({
    totalStars: 0,
    legendaryCount: 0,
    epicCount: 0,
    rareCount: 0,
    commonCount: 0,
    completedLevels: 0,
  });
  const [leaderboardWithPlayer, setLeaderboardWithPlayer] = useState([]);
  const [playerRank, setPlayerRank] = useState(null);

  useEffect(() => {
    // Calculate player statistics
    let totalStars = 0;
    let completedLevels = 0;

    // Calculate stars from level progress
    Object.values(levelProgress || {}).forEach((progress) => {
      if (progress.completed) {
        completedLevels++;
        totalStars += progress.stars || 0;
      }
    });

    const currentPlayerStats = {
      totalStars,
      legendaryCount: statistics.legendary || 0,
      epicCount: statistics.epic || 0,
      rareCount: statistics.rare || 0,
      commonCount: statistics.common || 0,
      completedLevels,
    };

    setPlayerStats(currentPlayerStats);

    // Create player entry for leaderboard
    const playerEntry = {
      id: "player",
      username: "You",
      ...currentPlayerStats,
      rank: calculateRankFromStats(currentPlayerStats),
      avatar: "🎮",
    };

    // Combine with dummy data and sort by total score
    const combinedLeaderboard = [...DUMMY_LEADERBOARD, playerEntry];
    const sortedLeaderboard = combinedLeaderboard.sort((a, b) => {
      const scoreA = calculateTotalScore(a);
      const scoreB = calculateTotalScore(b);
      return scoreB - scoreA; // Descending order
    });

    // Find player rank
    const playerPosition =
      sortedLeaderboard.findIndex((player) => player.id === "player") + 1;
    setPlayerRank(playerPosition);
    setLeaderboardWithPlayer(sortedLeaderboard);
  }, [levelProgress, statistics]);

  const calculateTotalScore = (stats) => {
    // Stars as primary currency/reward, achievement counts track progress
    const legendaryScore = stats.legendaryCount * 100;
    const epicScore = stats.epicCount * 50;
    const rareScore = stats.rareCount * 20;
    const commonScore = stats.commonCount * 5;
    const starScore = stats.totalStars * 15; // Increased weight for stars as primary currency
    return legendaryScore + epicScore + rareScore + commonScore + starScore;
  };

  const calculateRankFromStats = (stats) => {
    const totalScore = calculateTotalScore(stats);
    // Updated thresholds considering stars as primary currency with 15x weight
    if (totalScore >= 1200) return "Master Collector";
    if (totalScore >= 600) return "Expert Puzzler";
    if (totalScore >= 300) return "Skilled Player";
    return "Apprentice";
  };

  const getRankColor = (rank) => {
    switch (rank) {
      case "Master Collector":
        return getRarityColor("legendary");
      case "Expert Puzzler":
        return getRarityColor("epic");
      case "Skilled Player":
        return getRarityColor("rare");
      default:
        return getRarityColor("common");
    }
  };

  const handleBackToHome = () => {
    setGameState("levelSelect");
  };

  const calculateOverallRank = () => {
    return {
      rank: calculateRankFromStats(playerStats),
      color: getRankColor(calculateRankFromStats(playerStats)),
    };
  };

  const currentRank = calculateOverallRank();

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />

      <Header
        title="🏆 Rankings"
        leftButton={{
          iconName: "home",
          onPress: handleBackToHome,
        }}
      />

      <ScrollView
        style={styles.mainContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Current Player Rank Section */}
        <View style={styles.rankSection}>
          <Icon
            name="trophy"
            size={48}
            color={currentRank.color}
            style={styles.trophyIcon}
          />
          <Text style={[styles.rankTitle, { color: currentRank.color }]}>
            {currentRank.rank}
          </Text>
          <Text style={styles.rankSubtitle}>
            Your Current Rank: #{playerRank || "Calculating..."}
          </Text>
          <Text style={styles.starCurrencyNote}>
            ⭐ Stars serve as both rewards and currency for avatar accessories
          </Text>
        </View>

        {/* Global Leaderboard */}
        <View style={styles.leaderboardSection}>
          <Text style={styles.sectionTitle}>Global Leaderboard</Text>
          <View style={styles.leaderboardList}>
            {leaderboardWithPlayer.slice(0, 10).map((player, index) => (
              <View
                key={player.id}
                style={[
                  styles.leaderboardItem,
                  player.id === "player" && styles.currentPlayerItem,
                  index === 0 && styles.firstPlaceItem,
                  index === 1 && styles.secondPlaceItem,
                  index === 2 && styles.thirdPlaceItem,
                ]}
              >
                <View style={styles.playerRankContainer}>
                  <Text
                    style={[
                      styles.playerRankNumber,
                      player.id === "player" && styles.currentPlayerRankNumber,
                      index < 3 && styles.topThreeRankNumber,
                    ]}
                  >
                    {index + 1}
                  </Text>
                  {index === 0 && <Text style={styles.crownEmoji}>👑</Text>}
                  {index === 1 && <Text style={styles.medalEmoji}>🥈</Text>}
                  {index === 2 && <Text style={styles.medalEmoji}>🥉</Text>}
                </View>

                <View style={styles.playerInfo}>
                  <View style={styles.playerHeader}>
                    <Text style={styles.playerAvatar}>{player.avatar}</Text>
                    <Text
                      style={[
                        styles.playerUsername,
                        player.id === "player" && styles.currentPlayerUsername,
                      ]}
                    >
                      {player.username}
                    </Text>
                    <Text
                      style={[
                        styles.playerRank,
                        { color: getRankColor(player.rank) },
                      ]}
                    >
                      {player.rank}
                    </Text>
                  </View>

                  <View style={styles.playerStats}>
                    <View style={styles.statGroup}>
                      <Icon
                        name="star"
                        size={16}
                        color={theme.colors.starActive}
                      />
                      <Text style={styles.statValue}>{player.totalStars}</Text>
                    </View>
                    <View style={styles.statGroup}>
                      <Icon
                        name="trophy"
                        size={16}
                        color={getRarityColor("legendary")}
                      />
                      <Text style={styles.statValue}>
                        {player.legendaryCount}
                      </Text>
                    </View>
                    <View style={styles.statGroup}>
                      <Icon
                        name="star"
                        size={16}
                        color={getRarityColor("epic")}
                      />
                      <Text style={styles.statValue}>{player.epicCount}</Text>
                    </View>
                    <View style={styles.statGroup}>
                      <Icon
                        name="diamond-outline"
                        size={16}
                        color={getRarityColor("rare")}
                      />
                      <Text style={styles.statValue}>{player.rareCount}</Text>
                    </View>
                  </View>
                </View>

                <View style={styles.totalScoreContainer}>
                  <Text style={styles.totalScoreLabel}>Score</Text>
                  <Text
                    style={[
                      styles.totalScore,
                      player.id === "player" && styles.currentPlayerScore,
                    ]}
                  >
                    {calculateTotalScore(player).toLocaleString()}
                  </Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </View>
  );
});

export default RankingsScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.background,
  },
  mainContent: {
    flex: 1,
  },
  rankSection: {
    alignItems: "center",
    paddingVertical: theme.spacing.xl,
    paddingHorizontal: theme.spacing.lg,
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.md,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  trophyIcon: {
    marginBottom: theme.spacing.sm,
  },
  rankTitle: {
    fontSize: theme.typography.sizes.xl,
    fontFamily: theme.typography.fontFamily.regular,
    textAlign: "center",
    marginBottom: theme.spacing.xs,
  },
  rankSubtitle: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    textAlign: "center",
  },
  starCurrencyNote: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.starActive,
    textAlign: "center",
    fontStyle: "italic",
    marginTop: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
  },
  leaderboardSection: {
    backgroundColor: theme.colors.surface,
    marginHorizontal: theme.spacing.md,
    marginTop: theme.spacing.lg,
    marginBottom: theme.spacing.lg,
    padding: theme.spacing.lg,
    borderRadius: theme.borderRadius.lg,
    ...theme.shadows.md,
  },
  leaderboardList: {
    gap: theme.spacing.sm,
  },
  leaderboardItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: theme.colors.background,
    padding: theme.spacing.md,
    borderRadius: theme.borderRadius.md,
    borderWidth: 1,
    borderColor: theme.colors.tileBorder,
  },
  currentPlayerItem: {
    borderColor: theme.colors.accent,
    borderWidth: 2,
    backgroundColor: `${theme.colors.accent}10`,
  },
  firstPlaceItem: {
    borderColor: "#FFD700",
    backgroundColor: `#FFD70010`,
  },
  secondPlaceItem: {
    borderColor: "#C0C0C0",
    backgroundColor: `#C0C0C010`,
  },
  thirdPlaceItem: {
    borderColor: "#CD7F32",
    backgroundColor: `#CD7F3210`,
  },
  playerRankContainer: {
    alignItems: "center",
    justifyContent: "center",
    width: 50,
    marginRight: theme.spacing.md,
  },
  playerRankNumber: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.medium,
  },
  currentPlayerRankNumber: {
    color: theme.colors.accent,
    fontWeight: theme.typography.weights.bold,
  },
  topThreeRankNumber: {
    fontWeight: theme.typography.weights.bold,
    fontSize: theme.typography.sizes.xl,
  },
  crownEmoji: {
    fontSize: 20,
    marginTop: 2,
  },
  medalEmoji: {
    fontSize: 16,
    marginTop: 2,
  },
  playerInfo: {
    flex: 1,
    marginRight: theme.spacing.md,
  },
  playerHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: theme.spacing.xs,
  },
  playerAvatar: {
    fontSize: 20,
    marginRight: theme.spacing.sm,
  },
  playerUsername: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.medium,
    flex: 1,
  },
  currentPlayerUsername: {
    color: theme.colors.accent,
    fontWeight: theme.typography.weights.bold,
  },
  playerRank: {
    fontSize: theme.typography.sizes.sm,
    fontFamily: theme.typography.fontFamily.regular,
    fontWeight: theme.typography.weights.medium,
  },
  playerStats: {
    flexDirection: "row",
    gap: theme.spacing.md,
  },
  statGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  statValue: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    fontWeight: theme.typography.weights.medium,
  },
  totalScoreContainer: {
    alignItems: "center",
    minWidth: 70,
  },
  totalScoreLabel: {
    fontSize: theme.typography.sizes.xs,
    color: theme.colors.textLight,
    marginBottom: 2,
  },
  totalScore: {
    fontSize: theme.typography.sizes.md,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    fontWeight: theme.typography.weights.medium,
  },
  currentPlayerScore: {
    color: theme.colors.accent,
    fontWeight: theme.typography.weights.bold,
  },
  sectionTitle: {
    fontSize: theme.typography.sizes.lg,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    marginBottom: theme.spacing.md,
    textAlign: "center",
    fontWeight: theme.typography.weights.medium,
  },
});
