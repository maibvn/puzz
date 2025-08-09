import { useState, useEffect, useCallback } from "react";
import {
  loadCollection,
  saveCollection,
  addLevelToCollection,
  getCollectionStatistics,
} from "../utils/collection";
import { getRarityIcon } from "../data/levels";
import { getRarityColor } from "../theme";

/**
 * Custom hook for managing the user's puzzle image collection
 * @returns {Object} Collection state and management functions
 */
export const useCollection = () => {
  const [collection, setCollection] = useState([]);
  const [statistics, setStatistics] = useState({
    total: 0,
    common: 0,
    rare: 0,
    epic: 0,
    legendary: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load collection on mount
  useEffect(() => {
    loadCollectionData();
  }, []);

  const loadCollectionData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const [collectionData, statsData] = await Promise.all([
        loadCollection(),
        getCollectionStatistics(),
      ]);

      setCollection(collectionData);
      setStatistics(statsData);
    } catch (err) {
      setError("Failed to load collection");
      console.error("Error loading collection data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const unlockLevel = useCallback(async (levelId) => {
    try {
      const result = await addLevelToCollection(levelId);

      if (result.success && result.newUnlock) {
        // Update local state with new collection
        setCollection(result.collection);

        // Update statistics
        const newStats = await getCollectionStatistics();
        setStatistics(newStats);

        return {
          success: true,
          newUnlock: true,
          unlockedItem: result.collection.find((item) => item.id === levelId),
        };
      }

      return {
        success: result.success,
        newUnlock: result.newUnlock,
        unlockedItem: null,
      };
    } catch (err) {
      setError("Failed to unlock level");
      console.error("Error unlocking level:", err);
      return { success: false, newUnlock: false, unlockedItem: null };
    }
  }, []);

  const isLevelCollected = useCallback(
    (levelId) => {
      return collection.some((item) => item.id === levelId);
    },
    [collection]
  );

  const getCollectionByRarity = useCallback(
    (rarity) => {
      return collection.filter((item) => item.rarity === rarity);
    },
    [collection]
  );

  const getRecentlyUnlocked = useCallback(
    (count = 5) => {
      return [...collection]
        .sort((a, b) => new Date(b.dateUnlocked) - new Date(a.dateUnlocked))
        .slice(0, count);
    },
    [collection]
  );

  const getCollectionProgress = useCallback(() => {
    // This would need to be updated with total available levels
    // For now, using the current LEVELS array length
    const totalLevels = 5; // Update this based on your actual levels
    return {
      collected: statistics.total,
      total: totalLevels,
      percentage: totalLevels > 0 ? (statistics.total / totalLevels) * 100 : 0,
    };
  }, [statistics.total]);

  const refreshCollection = useCallback(() => {
    loadCollectionData();
  }, [loadCollectionData]);

  return {
    // State
    collection,
    statistics,
    loading,
    error,

    // Actions
    unlockLevel,
    refreshCollection,

    // Utilities
    isLevelCollected,
    getCollectionByRarity,
    getRecentlyUnlocked,
    getCollectionProgress,

    // Helper functions for UI
    getRarityColor,
    getRarityIcon,
  };
};
