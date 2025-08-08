// Level configuration for the puzzle game
export const LEVELS = [
  {
    id: 1,
    name: "Colorful Cubes",
    image: require("../assets/images/level1.png"), // Abstract geometric
    difficulty: "easy",
    unlocked: true,
    completed: false,
    stars: 0, // 0-3 stars based on time/moves
  },
  {
    id: 2,
    name: "Ocean Waves",
    image: require("../assets/images/level2.png"), // Nature scene
    difficulty: "easy",
    unlocked: false,
    completed: false,
    stars: 0,
  },
  {
    id: 3,
    name: "City Lights",
    image: require("../assets/images/level3.png"), // Urban scene
    difficulty: "easy",
    unlocked: false,
    completed: false,
    stars: 0,
  },
  {
    id: 4,
    name: "Forest Path",
    image: require("../assets/images/level4.png"), // Forest scene
    difficulty: "medium",
    unlocked: false,
    completed: false,
    stars: 0,
  },
  {
    id: 5,
    name: "Space Station",
    image: require("../assets/images/level5.png"), // Sci-fi scene
    difficulty: "medium",
    unlocked: false,
    completed: false,
    stars: 0,
  },
  //   {
  //     id: 6,
  //     name: "Ancient Temple",
  //     image: require("../assets/images/level6.png"), // Historical
  //     difficulty: "medium",
  //     unlocked: false,
  //     completed: false,
  //     stars: 0,
  //   },
  //   {
  //     id: 7,
  //     name: "Crystal Cave",
  //     image: require("../assets/images/level7.png"), // Fantasy
  //     difficulty: "hard",
  //     unlocked: false,
  //     completed: false,
  //     stars: 0,
  //   },
  //   {
  //     id: 8,
  //     name: "Robot Factory",
  //     image: require("../assets/images/level8.png"), // Industrial
  //     difficulty: "hard",
  //     unlocked: false,
  //     completed: false,
  //     stars: 0,
  //   },
  //   {
  //     id: 9,
  //     name: "Dragon's Lair",
  //     image: require("../assets/images/level9.png"), // Epic fantasy
  //     difficulty: "hard",
  //     unlocked: false,
  //     completed: false,
  //     stars: 0,
  //   },
  //   {
  //     id: 10,
  //     name: "Galaxy Master",
  //     image: require("../assets/images/level10.png"), // Final boss
  //     difficulty: "expert",
  //     unlocked: false,
  //     completed: false,
  //     stars: 0,
  //   },
];

export const getDifficultyColor = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return "#B3FFB3"; // Pastel Green
    case "medium":
      return "#FFD9B3"; // Pastel Orange
    case "hard":
      return "#FFB3B3"; // Pastel Red
    case "expert":
      return "#E6B3FF"; // Pastel Purple
    default:
      return "#B3E5FF"; // Pastel Blue
  }
};

export const getStarsForTime = (seconds) => {
  if (seconds <= 30) return 3; // 3 stars for under 30 seconds
  if (seconds <= 60) return 2; // 2 stars for under 1 minute
  if (seconds <= 120) return 1; // 1 star for under 2 minutes
  return 1; // Always give at least 1 star for completing
};
