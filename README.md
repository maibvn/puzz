# 🧩 Puzz

**Puzz** is a tile-based image puzzle built with React Native and Expo. Players progress through multiple levels, each with unique images, solving shuffled 3x3 puzzles by sliding tiles into an empty slot located just outside the bottom-right of the grid. Features a Candy Crush-style level progression system with stars and unlockable content.

**🎨 Design Theme:** Soft pastel colors with playful Fredoka One typography for a friendly, approachable gaming experience.

---

## 🚀 Features

- **10 Progressive Levels** - Unlock new puzzles by completing previous ones
- **Star Rating System** - Earn 1-3 stars based on completion time
- **Level Progression** - Candy Crush-style roadmap with locked/unlocked states
- **Persistent Progress** - Your achievements are saved automatically
- **3x3 image puzzle** (9 tiles) with unique external empty slot mechanic
- **Slide only adjacent tiles** into the empty slot
- **Victory detection** when tiles are ordered correctly
- **Smooth tile transitions** and win animations
- **Beautiful puzzle images** from Kenney.nl (free assets)
- **Pastel color theme** with soft, calming interface colors
- **Fredoka One font** for playful, kid-friendly typography

---

## 🎮 Level System

### **Difficulty Progression:**

- **Easy (Levels 1-3)**: Simple patterns, bright colors
- **Medium (Levels 4-6)**: More complex images with varied textures
- **Hard (Levels 7-9)**: Detailed scenes requiring careful observation
- **Expert (Level 10)**: Final boss level with intricate artwork

### **Star Rating:**

- ⭐⭐⭐ **3 Stars**: Complete in under 30 seconds
- ⭐⭐ **2 Stars**: Complete in under 1 minute
- ⭐ **1 Star**: Complete in under 2 minutes

### **Progression System:**

- Start with Level 1 unlocked
- Complete a level to unlock the next
- Stars are persistent - replay for better scores
- Visual progress tracking like Candy Crush

---

## 🧩 Puzzle Logic

- The grid is **3x3** (rows x columns), displaying 9 image tiles (numbered 0–8)
- The empty slot starts at **position [3][2]** (outside and below the bottom-right of the grid)
- Tiles can move in any direction to adjacent empty spaces (full sliding puzzle mechanics)
- The puzzle is solved when all tiles are in the original order (0-8) and the empty slot is empty
- Win screen displays the complete image with celebration effects

---

## 🛠️ Tech Stack & Design

- **React Native** with **Expo**
- **Google Fonts** - Fredoka One for playful typography
- **Pastel Color Palette** - Soft, calming colors for UI
- Touch handling with `PanResponder` for drag-and-drop functionality
- **Expo AV** for sound effects (lightweight audio)
- **Animated API** for smooth transitions and win effects
- Use **Kenney.nl** assets for puzzle images and sounds (royalty-free)
- Remove unused assets and dependencies before release
- For Google Play: use Expo's EAS Build with `minify` and `shrinkResources` enabled for smallest APK/AAB

### **Color Palette:**

```javascript
// Pastel Theme Colors
const colors = {
  primary: "#FFB3E6", // Pastel Pink
  secondary: "#B3E5FF", // Pastel Blue
  accent: "#FFFFB3", // Pastel Yellow
  success: "#B3FFB3", // Pastel Green
  warning: "#FFD9B3", // Pastel Orange
  error: "#FFB3B3", // Pastel Red
  background: "#F5F0FF", // Very Light Lavender
  surface: "#FFFFFF", // Pure White
  text: "#4A4A4A", // Soft Dark Gray
  textLight: "#8A8A8A", // Light Gray
};
```

---

## 🎨 Assets from Kenney.nl

### **Recommended Puzzle Images:**

- **Abstract Platonic**: Perfect geometric patterns for puzzles
- **UI Pack**: Clean, colorful interface elements
- **Boardgame Pack**: Detailed illustrations great for puzzle solving
- **Pixel Art**: Retro-style images with clear visual details

### **Recommended Sound Effects:**

- **UI Audio**: Button clicks, success sounds, error sounds
- **Digital Audio**: Retro game sounds for tile movements
- **Interface Sounds**: Satisfying feedback for user interactions

**Download from**: [kenney.nl/assets](https://kenney.nl/assets) (100% free, no attribution required)

---

## 📂 Project Structure

```
/puzz
├── assets/
│   ├── images/
│   │   ├── puzzle1.png      # Main puzzle image from Kenney.nl
│   │   ├── puzzle2.png      # Alternative puzzle options
│   │   └── puzzle3.png
│   └── sounds/
│       ├── tile-move.wav    # Tile movement sound
│       ├── tile-place.wav   # Tile placement sound
│       └── victory.wav      # Win celebration sound
├── components/
│   ├── Tile.js
│   ├── PuzzleBoard.js
│   └── WinScreen.js
├── utils/
│   └── shuffle.js
├── App.js
└── README.md
```

---

## 📦 Getting Started

```bash
# 1. Create a new Expo project (minimal template)
npx create-expo-app puzz --template blank
cd puzz

# 2. Install dependencies
npx expo install @react-native-async-storage/async-storage

# Note: Fredoka One has been deprecated from Google Fonts
# The app uses system fonts with bold weights for a playful look
# Alternatively, you can add custom fonts to assets/fonts/

# 3. Download assets from Kenney.nl
# Visit: https://kenney.nl/assets
# Download: Abstract Platonic, UI Audio, Digital Audio packs

# 4. Add your assets to assets/ folder as per structure above

# 5. Start the app
npx expo start

# 6. For Google Play, build a release APK/AAB
npx expo install eas-cli
eas build -p android --profile preview
```

---

## 🎵 Adding Sound Effects

Install Expo AV for lightweight audio:

```bash
npx expo install expo-av
```

Example usage in your components:

```javascript
import { Audio } from "expo-av";

// Load sounds
const [moveSound] = Audio.Sound.createAsync(
  require("./assets/sounds/tile-move.wav")
);

// Play on tile movement
const playMoveSound = async () => {
  await moveSound.replayAsync();
};
```

---

## 📸 Asset Sources

- **Images**: [Kenney.nl Abstract Platonic Pack](https://kenney.nl/assets/abstract-platonic)
- **Sounds**: [Kenney.nl UI Audio Pack](https://kenney.nl/assets/ui-audio)
- **Alternative**: [Kenney.nl Digital Audio Pack](https://kenney.nl/assets/digital-audio)

**All Kenney.nl assets are:**
✅ **100% Free** - No cost, no registration required  
✅ **Royalty-Free** - Use in commercial projects  
✅ **No Attribution Required** - Credit is appreciated but not mandatory  
✅ **High Quality** - Professional game-ready assets

---

## 🚀 Optimization Tips

- **Choose lightweight images**: 512x512 or smaller from Kenney packs
- **Compress audio**: Use short, compressed WAV files for quick loading
- **Remove unused assets**: Only include the images/sounds you actually use
- **Enable minification**: Use EAS Build optimization for smaller app size
