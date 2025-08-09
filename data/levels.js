// Level configuration for the puzzle game with randomization support

// Base character pool - all available characters
export const CHARACTER_POOL = [
  {
    id: 1,
    name: "Hamham",
    image: require("../assets/images/level1.png"),
    rarity: "common",
  },
  {
    id: 2,
    name: "Kiki",
    image: require("../assets/images/level2.png"),
    rarity: "common",
  },
  {
    id: 3,
    name: "Pizz",
    image: require("../assets/images/level3.png"),
    rarity: "legendary",
  },
  {
    id: 4,
    name: "Poto",
    image: require("../assets/images/level4.png"),
    rarity: "rare",
  },
  {
    id: 5,
    name: "Hamster",
    image: require("../assets/images/level5.png"),
    rarity: "rare",
  },
  {
    id: 6,
    name: "Ian",
    image: require("../assets/images/level6.png"),
    rarity: "epic",
  },
  {
    id: 7,
    name: "Susu",
    image: require("../assets/images/level7.png"),
    rarity: "legendary",
  },
  {
    id: 8,
    name: "Dodo",
    image: require("../assets/images/level8.png"),
    rarity: "common",
  },
  {
    id: 9,
    name: "Poka",
    image: require("../assets/images/level9.png"),
    rarity: "common",
  },
  {
    id: 10,
    name: "Dudu",
    image: require("../assets/images/level10.png"),
    rarity: "epic",
  },
  {
    id: 11,
    name: "Icy",
    image: require("../assets/images/level11.png"),
    rarity: "rare",
  },
  {
    id: 12,
    name: "Pip",
    image: require("../assets/images/level12.png"),
    rarity: "common",
  },
  {
    id: 13,
    name: "Hoshi",
    image: require("../assets/images/level13.png"),
    rarity: "legendary",
  },
  {
    id: 14,
    name: "Moewlow",
    image: require("../assets/images/level14.png"),
    rarity: "epic",
  },
  {
    id: 15,
    name: "Tasu",
    image: require("../assets/images/level15.png"),
    rarity: "rare",
  },
  {
    id: 16,
    name: "Nunu",
    image: require("../assets/images/level16.png"),
    rarity: "common",
  },
  {
    id: 17,
    name: "Paka",
    image: require("../assets/images/level17.png"),
    rarity: "legendary",
  },
];

// Rarity weights for random selection
const RARITY_WEIGHTS = {
  common: 60,
  rare: 25,
  epic: 10,
  legendary: 5,
};

// Generate a seeded random number generator
const seededRandom = (seed) => {
  let x = Math.sin(seed++) * 10000;
  return x - Math.floor(x);
};

// Generate a unique player seed based on device/install
const generatePlayerSeed = () => {
  // This creates a unique seed per device/install
  const timestamp = Date.now();
  const random = Math.random();
  return Math.floor((timestamp + random * 1000000) % 1000000);
};

// Select characters based on rarity weights
const selectCharacterByRarity = (seed, index) => {
  const random = seededRandom(seed + index);
  const totalWeight = Object.values(RARITY_WEIGHTS).reduce(
    (sum, weight) => sum + weight,
    0
  );

  let cumulativeWeight = 0;
  let selectedRarity = "common";

  for (const [rarity, weight] of Object.entries(RARITY_WEIGHTS)) {
    cumulativeWeight += weight;
    if (random * totalWeight <= cumulativeWeight) {
      selectedRarity = rarity;
      break;
    }
  }

  // Find characters of selected rarity
  const availableCharacters = CHARACTER_POOL.filter(
    (char) => char.rarity === selectedRarity
  );

  if (availableCharacters.length === 0) {
    // Fallback to common if no characters of selected rarity
    return (
      CHARACTER_POOL.find((char) => char.rarity === "common") ||
      CHARACTER_POOL[0]
    );
  }

  // Select random character from available ones
  const charIndex = Math.floor(
    seededRandom(seed + index + 100) * availableCharacters.length
  );
  return availableCharacters[charIndex];
};

// Generate personalized levels for a player with guaranteed legendary distribution
export const generatePlayerLevels = (playerSeed, numLevels = 17) => {
  const playerLevels = [];
  const totalCharacters = CHARACTER_POOL.length;

  // Since we have exactly 17 characters, we'll use each character once
  // and randomize their order based on the player seed
  const availableCharacters = [...CHARACTER_POOL];

  // Shuffle the characters based on player seed
  for (let i = availableCharacters.length - 1; i > 0; i--) {
    const j = Math.floor(seededRandom(playerSeed + i) * (i + 1));
    [availableCharacters[i], availableCharacters[j]] = [
      availableCharacters[j],
      availableCharacters[i],
    ];
  }

  // Generate levels using the shuffled characters (no repeats)
  for (let i = 0; i < Math.min(numLevels, totalCharacters); i++) {
    const character = availableCharacters[i];

    playerLevels.push({
      id: i + 1,
      name: character.name,
      image: character.image,
      rarity: character.rarity,
      characterId: character.id, // Reference to base character
      unlocked: i === 0, // Only first level unlocked initially
      completed: false,
      stars: 0,
    });
  }

  return playerLevels;
}; // For backwards compatibility, export a default set of levels
export const LEVELS = CHARACTER_POOL.map((char, index) => ({
  ...char,
  unlocked: index === 0,
  completed: false,
  stars: 0,
}));

// Player seed management
export const getPlayerSeed = async () => {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  try {
    let seed = await AsyncStorage.getItem("playerSeed");
    if (!seed) {
      seed = generatePlayerSeed().toString();
      await AsyncStorage.setItem("playerSeed", seed);
    }
    return parseInt(seed);
  } catch (error) {
    console.error("Error managing player seed:", error);
    return generatePlayerSeed();
  }
};

// Get or generate player's personalized levels
export const getPlayerLevels = async (numLevels = 17) => {
  const AsyncStorage =
    require("@react-native-async-storage/async-storage").default;
  try {
    // Check if player already has generated levels
    const existingLevels = await AsyncStorage.getItem("playerLevels");
    if (existingLevels) {
      return JSON.parse(existingLevels);
    }

    // Generate new levels for first-time player
    const playerSeed = await getPlayerSeed();
    const playerLevels = generatePlayerLevels(playerSeed, numLevels);

    // Save the generated levels
    await AsyncStorage.setItem("playerLevels", JSON.stringify(playerLevels));
    return playerLevels;
  } catch (error) {
    console.error("Error getting player levels:", error);
    // Fallback to default levels
    return LEVELS;
  }
};

export const getRarityIcon = (rarity) => {
  switch (rarity) {
    case "common":
      return "radio-button-off-outline"; // Circle outline
    case "rare":
      return "diamond-outline"; // Diamond outline
    case "epic":
      return "star"; // Filled star
    case "legendary":
      return "trophy"; // Trophy
    default:
      return "radio-button-off-outline";
  }
};

export const getStarsForTime = (seconds) => {
  if (seconds <= 30) return 3; // 3 stars for under 30 seconds
  if (seconds <= 60) return 2; // 2 stars for under 1 minute
  if (seconds <= 120) return 1; // 1 star for under 2 minutes
  return 1; // Always give at least 1 star for completing
};

// Collection Management System
export const getLevelById = (levelId) => {
  return CHARACTER_POOL.find((level) => level.id === levelId);
};

export const isImageInCollection = (collection, levelId) => {
  return collection.some((item) => item.id === levelId);
};

export const unlockLevelImage = (levelId, currentCollection = []) => {
  // Check if the image is already in the collection
  if (isImageInCollection(currentCollection, levelId)) {
    return currentCollection; // No change needed
  }

  // Find the level data
  const level = getLevelById(levelId);
  if (!level) {
    console.warn(`Level with id ${levelId} not found`);
    return currentCollection;
  }

  // Create new collection item
  const newCollectionItem = {
    id: level.id,
    name: level.name,
    image: level.image,
    rarity: level.rarity,
    dateUnlocked: new Date().toISOString(),
  };

  // Return updated collection
  return [...currentCollection, newCollectionItem];
};

export const getCollectionStats = (collection) => {
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
};

export const sortCollectionByRarity = (collection) => {
  const rarityOrder = { common: 1, rare: 2, epic: 3, legendary: 4 };

  return [...collection].sort((a, b) => {
    const rarityA = rarityOrder[a.rarity] || 0;
    const rarityB = rarityOrder[b.rarity] || 0;

    if (rarityA !== rarityB) {
      return rarityB - rarityA; // Highest rarity first
    }

    // If same rarity, sort by unlock date (newest first)
    return new Date(b.dateUnlocked) - new Date(a.dateUnlocked);
  });
};

export const sortCollectionByDate = (collection) => {
  return [...collection].sort(
    (a, b) => new Date(b.dateUnlocked) - new Date(a.dateUnlocked)
  );
};
