# 🧩 Puzz

**Puzz** is a collectible puzzle game built with React Native and Expo. Each player receives a **randomized set of levels unique to them**, creating a personalized gaming experience. Solve 3x3 sliding puzzles to collect rare characters and images, with each completed level adding that character to your personal collection. Hunt for legendary characters as you progress through your unique level sequence!

**🎯 Core Concept:** Every player gets different levels in different orders - making each playthrough unique and encouraging competition through public rankings where players can see how they compare with others.

**⭐ Star Economy:** Stars serve as both rewards and currency - earn them by completing puzzles efficiently and spend them on avatar accessories to personalize your character.

**🏆 Global Rankings:** Compete with other players on public leaderboards based on stars earned and legendary characters collected.

**🎨 Design Theme:** Soft pastel colors with playful Fredoka One typography for a friendly, approachable gaming experience.

---

## 🚀 Key Features

### **Unique Player Experience** 🎲

- **Randomized Level Sets** - Each player gets a unique sequence of levels
- **Personal Collection Journey** - Your level order is different from every other player
- **Character Collecting** - Complete levels to earn characters for your collection
- **Rarity-Based Discovery** - Find common, rare, epic, and legendary characters
- **Personalized Progress** - Your game state is unique to you

### **Star Economy System** ⭐

- **Dual Purpose Currency** - Stars serve as both rewards and spendable currency
- **Performance-Based Rewards** - Earn 1-3 stars based on completion time
- **Avatar Customization** - Spend stars on avatar accessories and personalization items
- **Meaningful Progression** - Stars create tangible value for efficient puzzle solving
- **Balance Design** - No separate coin system - stars are the universal currency

### **Global Rankings & Competition** 🏆

- **Public Leaderboards** - See how you rank against other players worldwide
- **Multi-Factor Scoring** - Rankings based on stars earned + legendary characters collected
- **Real-Time Competition** - Live leaderboard updates showing your current position
- **Achievement Tracking** - Separate counts for legendary, epic, rare, and common discoveries
- **Rank Tiers** - Progress from Apprentice → Skilled Player → Expert Puzzler → Master Collector
- **Social Discovery** - View other players' achievements and collection progress

### **Core Puzzle Mechanics** 🧩

- **3x3 Sliding Puzzles** - Classic puzzle mechanics with unique external empty slot
- **Smart Timer System** - Separate timer component with pause support
- **Advanced Game Controls** - Pause/Resume functionality with dedicated pause modal
- **Victory Detection** - Automatic win detection when tiles are correctly ordered
- **Smooth Animations** - Fluid tile transitions and celebratory win effects
- **Personalized Victory Messages** - "Great, you've got [Character Name]!" instead of generic text

### **Enhanced Collection System** �

- **Personal Character Gallery** - View all characters you've collected
- **Rarity-Based Organization** - Common, Rare, Epic, and Legendary categories
- **Smart Filtering** - Click on rarity badges to filter your collection
- **Collection Progress Tracking** - Visual summary of characters discovered
- **One-Click Collection Management** - Clear collection button for testing/reset
- **Full-Screen Gallery** - Dedicated collection screen with intuitive navigation

### **Streamlined UI & Controls** 🎨

- **Centralized Component System** - Unified Icon and Button components with consistent theming
- **Smart Action Bar** - Four key actions: Data Reset, Collection, Rankings, Settings
- **Global Typography** - FredokaOne font consistently applied across all screens
- **Bright Icon System** - Enhanced icon colors with theme-based color variants
- **Pastel Color Palette** - Soft, calming interface colors throughout
- **Enhanced Audio Experience** - Victory sounds, drag sounds, and background music

### **Visual & Audio Polish**

- **Beautiful puzzle images** with unique character designs (Hamham, Kiki, Pizz, etc.)
- **Responsive touch interactions** with visual feedback
- **Smart audio management** - Victory sounds play on puzzle completion
- **Smooth tile transitions** and win animations
- **Icon-based navigation** with consistent branding

---

## 🎮 Game Systems Deep Dive

### **Star Economy & Ranking System:**

**⭐ How Stars Work:**

- **Earn Stars**: Complete puzzles efficiently to earn 1-3 stars per level
- **Spend Stars**: Use stars as currency to buy avatar accessories and customization items
- **No Separate Currency**: Stars replace traditional coins - one unified reward system
- **Performance Incentive**: Better completion times = more stars = more purchasing power

**🏆 Public Rankings:**

- **Global Leaderboard**: Compete with all players worldwide
- **Multi-Factor Scoring**: Rankings combine stars earned + character achievements
- **Live Competition**: See your current rank and compare with top players
- **Ranking Tiers**: Progress through Apprentice → Skilled → Expert → Master Collector
- **Achievement Tracking**: Legendary, epic, rare, and common counts tracked separately

**🎯 Scoring Formula:**

- Stars: 15 points each (primary currency weight)
- Legendary Characters: 100 points each
- Epic Characters: 50 points each
- Rare Characters: 20 points each
- Common Characters: 5 points each

### **Randomized Level & Collection System:**

- **Unique Player Seeds** - Each player gets a unique random seed on first launch
- **Personalized Level Order** - Levels are shuffled differently for each player
- **Guaranteed Legendary Access** - All players can encounter all legendary characters (positions vary)
- **Rarity Distribution** - Rare characters appear less frequently in level sets
- **Progressive Unlocking** - Complete levels in your unique sequence to unlock the next
- **Consistent Experience** - Your level order stays the same across app sessions

### **Character Rarity System:**

- 🟢 **Common (60% chance)**: Easy to find, green borders - characters like Hamham, Kiki
- 🔵 **Rare (25% chance)**: Moderate rarity, blue borders - characters like Poto
- 🟣 **Epic (10% chance)**: Hard to find, purple borders - special characters
- 🟡 **Legendary (5% chance)**: Ultra rare, gold borders - characters like Pizz (shown first!)

### **Mystery & Discovery System:**

- **Locked Level Mystery** - Unrevealed levels show as blurred, grayscale images with "???" text
- **Visual Progression** - Unlocked levels reveal character names and rarity colors
- **Enhanced Anticipation** - Dark overlays and golden mystery indicators build suspense
- **Progressive Revelation** - Each unlocked level reveals its true character and rarity

### **Collection Mechanics:**

- **Character Discovery**: Complete any level → character becomes available to collect
- **Manual Collection**: Players must manually add characters to their collection (feature coming soon)
- **Personal Gallery**: View all characters you've discovered and collected
- **Rarity Hunting**: Try to find all legendary characters across your levels
- **Progress Tracking**: See how many characters you've collected vs total available
- **Persistent Collection**: Your discovered characters are saved permanently

### **What Makes Each Player Unique:**

- **Different Level Order**: Your Level 1 might be another player's Level 3
- **Varied Rarity Encounters**: You might get a legendary early, others might not see any
- **Personal Discovery Journey**: Your collection grows based on your unique level sequence
- **Replayability**: Different players will have completely different experiences

### **Star Rating System:**

- ⭐⭐⭐ **3 Stars**: Complete in under 30 seconds
- ⭐⭐ **2 Stars**: Complete in under 1 minute
- ⭐ **1 Star**: Complete in under 2 minutes

### **Navigation & Controls:**

- 🏠 **Home Screen**: Your personalized level sequence with streamlined 4-button action bar
  - 🗑️ **Trash Icon**: Clear all data (reset progress and collection)
  - 📚 **Collection Icon**: Browse your discovered characters
  - 🏆 **Trophy Icon**: View global rankings and your current position
  - ⚙️ **Settings Icon**: Audio controls and game preferences
- ⏸️ **Pause System**: Advanced pause modal with Resume/Restart/Home options
- 🎮 **Game Screen**: Active puzzle solving with smart timer and pause controls
- 📚 **Collection Screen**: Browse, filter, and manage your character collection (includes clear collection button)
- 🏆 **Rankings Screen**: Global leaderboard showing top players and your ranking
- ⚙️ **Settings**: Audio controls and preferences with centralized UI components

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
- **Centralized Component Architecture** - Unified Icon, Button, and Timer components
- **Google Fonts** - FredokaOne_400Regular for consistent playful typography across all components
- **Advanced State Management** - Context API with enhanced game state and pause functionality
- **Pastel Color Palette** - Soft, calming colors with bright icon variants
- **AsyncStorage** - Persistent game progress and collection data
- **Enhanced Audio System** - Victory sounds, drag sounds, and background music with smart audio management
- Touch handling with `PanResponder` for drag-and-drop functionality
- **Expo AV** for advanced sound effects (victory.wav, drag.mp3, theme music)
- **Animated API** for smooth transitions and win effects
- **Custom hooks** - useCollection for collection management
- **Modular components** - Reusable UI elements with centralized theming

### **Updated Architecture:**

```
App.js (Global font configuration + navigation)
├── contexts/AppProvider.js (Game state management)
├── screens/
│   ├── HomeScreen.js (Level selection with streamlined action bar)
│   ├── GameScreen.js (Puzzle gameplay)
│   ├── CollectionScreen.js (Full-screen collection browser)
│   └── RankingsScreen.js (Global leaderboard and player rankings)
├── components/
│   ├── PuzzleBoard.js
│   ├── Tile.js
│   ├── Button.js
│   ├── Header.js (Centralized header with left/right button support)
│   ├── Icon.js (Enhanced icon system with theme integration)
│   ├── Timer.js (Smart timer with pause support)
│   ├── PauseModal.js
│   ├── SettingsModal.js
│   └── WinScreen.js
├── hooks/
│   └── useCollection.js (Collection state & filtering)
├── data/
│   └── levels.js (Level data with rarity system)
├── utils/
│   ├── collection.js (Collection utilities)
│   └── shuffle.js
└── theme/
    └── index.js (Centralized styling system)
```

### **Color Palette:**

```javascript
// Pastel Theme Colors (Enhanced)
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

  // Collection & Rarity Colors
  common: "#B3FFB3", // Green
  rare: "#B3E5FF", // Blue
  epic: "#E6B3FF", // Purple
  legendary: "#FFD700", // Gold
  starActive: "#FFD700", // Gold stars
  starInactive: "#E0E0E0", // Gray stars
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
│   │   ├── level1.png       # Hamham character
│   │   ├── level2.png       # Kiki character
│   │   ├── level3.png       # Pizz character (Legendary!)
│   │   ├── level4.png       # Poto character
│   │   └── level5.png       # Hamster character
│   ├── sounds/
│   │   ├── drag.mp3         # Tile movement sound
│   │   └── theme/
│   │       └── theme.mp3    # Background music
│   ├── icon.png             # App icon (used in header)
│   ├── favicon.png
│   ├── adaptive-icon.png
│   └── splash-icon.png
├── components/
│   ├── PuzzleBoard.js       # Main puzzle game board
│   ├── Tile.js              # Individual puzzle tile
│   ├── Timer.js             # Reusable timer component with pause support
│   ├── PauseModal.js        # Game pause modal with Resume/Restart/Home
│   ├── Icon.js              # Centralized icon component with theme integration
│   ├── Button.js            # Unified button component with variants
│   ├── SettingsModal.js     # Settings overlay
│   ├── WinScreen.js         # Victory screen with personalized messages
│   └── index.js             # Centralized component exports
├── contexts/
│   └── AppProvider.js       # Global state management
├── screens/
│   ├── HomeScreen.js        # Level selection with 4-button action bar
│   ├── GameScreen.js        # Active puzzle gameplay
│   ├── CollectionScreen.js  # Full collection browser with clear option
│   └── RankingsScreen.js    # Global leaderboard and player ranking
├── hooks/
│   └── useCollection.js     # Collection state management
├── data/
│   └── levels.js            # Level data with rarity system
├── utils/
│   ├── collection.js        # Collection helper functions
│   └── shuffle.js           # Puzzle shuffling logic
├── theme/
│   └── index.js             # Centralized styling & colors
├── examples/
│   └── collection-integration.js # Collection system examples
├── App.js                   # Main app with global font setup
├── COLLECTION_README.md     # Collection system documentation
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
npx expo install expo-font
npx expo install @expo-google-fonts/fredoka-one
npx expo install @expo/vector-icons

# 3. Install optional dependencies
npx expo install expo-av  # For sound effects

# 4. Set up the project structure as shown above
# - Copy all components, screens, contexts, hooks, data, utils, and theme folders
# - Add your custom puzzle images to assets/images/
# - Ensure FredokaOne font is loaded in App.js

# 5. Key Files to Configure:
# - App.js: Global font setup and navigation
# - data/levels.js: Your puzzle levels with rarity assignments
# - contexts/AppProvider.js: Game state management
# - theme/index.js: Color palette and typography

# 6. Start the app
npx expo start

# 7. For Google Play, build a release APK/AAB
npx expo install @expo/cli
npx expo build:android
```

### **🎯 Key Features to Test:**

1. **Star Economy System**: Complete puzzles → earn stars → view as currency for future avatar purchases
2. **Global Rankings**: Tap trophy icon → see global leaderboard with your current position
3. **Streamlined Action Bar**: Test all 4 home screen buttons (Trash, Collection, Rankings, Settings)
4. **Collection Management**: Use collection screen's clear button to reset collection data
5. **Advanced Pause System**: Tap pause icon → test Resume/Restart/Home functionality
6. **Enhanced Victory Experience**: Complete puzzle → hear victory sound + personalized message
7. **Centralized UI Components**: Notice consistent theming across all icons and buttons
8. **Smart Timer**: Verify timer pauses during pause modal and resumes correctly
9. **Level Progression**: Complete Level 1 to unlock Level 2
10. **Ranking Calculation**: Notice how stars + achievements combine for your ranking score
11. **Font Consistency**: Verify FredokaOne font across all screens including rankings
12. **Data Reset**: Use trash icon to clear all progress and test fresh start experience

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
  require("./assets/sounds/drag.mp3")
);

// Play on tile movement
const playMoveSound = async () => {
  await moveSound.replayAsync();
};
```

---

## 🎁 Collection System Deep Dive

The collection system automatically tracks completed puzzles and organizes them by rarity:

### **How It Works:**

1. **Auto-Collection**: Complete any level → image automatically added to collection
2. **Rarity Assignment**: Each level has a rarity (common/rare/epic/legendary)
3. **Smart Sorting**: Legendary items shown first, then by date collected
4. **Progress Tracking**: Visual summary shows total collected vs available
5. **Interactive Filtering**: Tap rarity badges to filter by type

### **Collection Screen Features:**

- **Full-Screen Layout**: Dedicated screen accessible via home screen icon
- **Rarity Breakdown**: "Common: 2" badges you can tap to filter
- **Image Gallery**: View high-quality versions of puzzle images
- **Progress Bar**: Visual indicator of collection completion
- **Responsive Design**: Works on different screen sizes

### **Integration Points:**

- `useCollection` hook manages all collection state
- `AsyncStorage` persists collection data between sessions
- `getRarityColor()` provides consistent rarity-based coloring
- Collection data flows through `AppProvider` context

---

## 🚀 Recent Updates & Improvements

### **v4.0 - Star Economy & Global Rankings** ⭐🏆

✅ **Star-Based Currency System** - Stars serve as both rewards and spendable currency for avatar accessories  
✅ **Global Rankings** - Public leaderboard where players compete based on stars + achievements  
✅ **Comprehensive Scoring** - Multi-factor ranking system balancing performance and collection progress  
✅ **Ranking Tiers** - Progress from Apprentice to Master Collector with meaningful milestones  
✅ **Streamlined UI** - 4-button action bar: Trash (reset), Collection, Rankings, Settings  
✅ **Enhanced Collection Management** - One-click collection clearing for testing and reset  
✅ **Social Competition** - View other players' achievements and see your global position

### **v3.0 - Enhanced UI & Game Experience**

✅ **Centralized Component System** - Unified Icon and Button components with consistent theming  
✅ **Advanced Pause Functionality** - Smart pause modal with Resume/Restart/Home options  
✅ **Enhanced Audio System** - Victory sounds, improved audio management, and smart sound timing  
✅ **Personalized Victory Messages** - "Great, you've got [Character Name]!" instead of generic text  
✅ **Smart Timer Component** - Reusable timer with pause support and better state management  
✅ **Bright Icon System** - Enhanced icon colors with theme-based variants  
✅ **Global Typography Consistency** - FredokaOne font applied to all components including victory messages

### **v2.0 - Collection System**

✅ Added comprehensive collection screen with filtering  
✅ Implemented rarity-based reward system  
✅ Created full-screen collection browser  
✅ Added progress tracking and visual summaries

### **v1.5 - UI/UX Polish**

✅ Unified font system with global FredokaOne application  
✅ Replaced difficulty system with cleaner rarity system  
✅ Updated navigation with icon-based header design  
✅ Improved visual consistency across all screens

### **v1.0 - Core Game**

✅ 3x3 sliding puzzle mechanics  
✅ Level progression system  
✅ Star rating based on completion time  
✅ Persistent progress saving

---

## 📸 Asset Sources & Credits

- **Character Images**: Custom puzzle images featuring unique characters (Hamham, Kiki, Pizz, Poto, Hamster)
- **App Icon**: Custom designed puzzle piece icon
- **Sound Effects**: Custom audio for tile movements and theme music
- **Typography**: FredokaOne_400Regular from Google Fonts (playful, kid-friendly)

### **Alternative Asset Sources:**

- **Images**: [Kenney.nl Abstract Platonic Pack](https://kenney.nl/assets/abstract-platonic)
- **Sounds**: [Kenney.nl UI Audio Pack](https://kenney.nl/assets/ui-audio)
- **Icons**: [@expo/vector-icons](https://icons.expo.fyi/) for navigation elements

**All Kenney.nl assets are:**
✅ **100% Free** - No cost, no registration required  
✅ **Royalty-Free** - Use in commercial projects  
✅ **No Attribution Required** - Credit is appreciated but not mandatory  
✅ **High Quality** - Professional game-ready assets

---

## 🚀 Optimization Tips

### **Performance:**

- **Lightweight images**: 512x512 or smaller for smooth loading
- **Optimized audio**: Short, compressed MP3 files
- **Component optimization**: React.memo for expensive renders
- **State management**: Efficient context usage with selective updates

### **Bundle Size:**

- **Remove unused assets**: Only include images/sounds actually used
- **Enable minification**: Use Expo EAS Build optimization
- **Tree shaking**: Import only needed functions from libraries
- **Image optimization**: Use appropriate formats (PNG for graphics, JPG for photos)

### **User Experience:**

- **Persistent storage**: Save progress immediately after each action
- **Smooth animations**: 60fps transitions with React Native Animated
- **Responsive design**: Support different screen sizes and orientations
- **Error handling**: Graceful fallbacks for missing assets or storage failures

---

## 🤝 Contributing

Contributions are welcome! Areas for improvement:

- **More Levels**: Add additional puzzle images and levels
- **Enhanced Animations**: More sophisticated tile movement effects
- **Sound Design**: Additional audio feedback and background music
- **Accessibility**: Screen reader support and alternative input methods
- **Multiplayer**: Turn-based puzzle challenges
- **Themes**: Alternative color schemes and visual styles

---

## 📝 License

This project is open source and available under the [MIT License](LICENSE).
