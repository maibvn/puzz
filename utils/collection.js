import AsyncStorage from "@react-native-async-storage/async-storage";
import { unlockLevelImage } from "../data/levels";

const COLLECTION_STORAGE_KEY = "@puzzle_collection";

/**
 * Load the user's collection from AsyncStorage
 * @returns {Promise<Array>} The user's collection
 */
export const loadCollection = async () => {
  try {
    const collectionData = await AsyncStorage.getItem(COLLECTION_STORAGE_KEY);
    return collectionData ? JSON.parse(collectionData) : [];
  } catch (error) {
    console.error("Error loading collection:", error);
    return [];
  }
};

/**
 * Save the user's collection to AsyncStorage
 * @param {Array} collection - The collection to save
 * @returns {Promise<boolean>} Success status
 */
export const saveCollection = async (collection) => {
  try {
    await AsyncStorage.setItem(
      COLLECTION_STORAGE_KEY,
      JSON.stringify(collection)
    );
    return true;
  } catch (error) {
    console.error("Error saving collection:", error);
    return false;
  }
};

/**
 * Add a level image to the collection when a level is completed for the first time
 * @param {number} levelId - The ID of the completed level
 * @returns {Promise<{success: boolean, collection: Array, newUnlock: boolean}>}
 */
export const addLevelToCollection = async (levelId) => {
  try {
    // Load current collection
    const currentCollection = await loadCollection();

    // Check if already collected
    const alreadyCollected = currentCollection.some(
      (item) => item.id === levelId
    );

    if (alreadyCollected) {
      return {
        success: true,
        collection: currentCollection,
        newUnlock: false,
      };
    }

    // Unlock the level image (add to collection)
    const updatedCollection = unlockLevelImage(levelId, currentCollection);

    // Save the updated collection
    const saveSuccess = await saveCollection(updatedCollection);

    return {
      success: saveSuccess,
      collection: updatedCollection,
      newUnlock: true,
    };
  } catch (error) {
    console.error("Error adding level to collection:", error);
    return {
      success: false,
      collection: [],
      newUnlock: false,
    };
  }
};

/**
 * Get collection statistics for display purposes
 * @returns {Promise<Object>} Collection statistics
 */
export const getCollectionStatistics = async () => {
  try {
    const collection = await loadCollection();
    const stats = {
      total: collection.length,
      common: 0,
      rare: 0,
      epic: 0,
      legendary: 0,
    };

    collection.forEach((item) => {
      if (stats.hasOwnProperty(item.rarity)) {
        stats[item.rarity]++;
      }
    });

    return stats;
  } catch (error) {
    console.error("Error getting collection statistics:", error);
    return { total: 0, common: 0, rare: 0, epic: 0, legendary: 0 };
  }
};

/**
 * Get recently unlocked items (last 5)
 * @returns {Promise<Array>} Recently unlocked collection items
 */
export const getRecentlyUnlocked = async () => {
  try {
    const collection = await loadCollection();
    return collection
      .sort((a, b) => new Date(b.dateUnlocked) - new Date(a.dateUnlocked))
      .slice(0, 5);
  } catch (error) {
    console.error("Error getting recently unlocked items:", error);
    return [];
  }
};

/**
 * Clear the entire collection (for testing or reset purposes)
 * @returns {Promise<boolean>} Success status
 */
export const clearCollection = async () => {
  try {
    await AsyncStorage.removeItem(COLLECTION_STORAGE_KEY);
    return true;
  } catch (error) {
    console.error("Error clearing collection:", error);
    return false;
  }
};

/**
 * Export collection data (for sharing or backup)
 * @returns {Promise<Object>} Collection export data
 */
export const exportCollectionData = async () => {
  try {
    const collection = await loadCollection();
    const stats = await getCollectionStatistics();

    return {
      exportDate: new Date().toISOString(),
      totalItems: stats.total,
      collection: collection,
      statistics: stats,
    };
  } catch (error) {
    console.error("Error exporting collection data:", error);
    return null;
  }
};
