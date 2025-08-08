# 🧩 Puzz

**Puzz** is a tile-based image puzzle built with React Native and Expo. Players solve a shuffled 3x3 image by sliding tiles into an empty slot located just outside the bottom-right of the grid. Only tiles adjacent to the empty slot can move into it, mimicking classic sliding puzzle behavior with a unique twist.

---

## 🚀 Features

- 3x3 image puzzle (9 tiles)
- One empty slot outside the grid (bottom-right)
- Slide only adjacent tiles into the empty slot
- Victory detection when tiles are ordered correctly
- Smooth tile transitions
- Sound effects and animations (coming soon)

---

## 🧩 Puzzle Logic

- The grid is **3x3** (rows x columns), displaying 9 image tiles (numbered 0–8)
- The empty slot starts at **position [3][2]** (outside and below the bottom-right of the grid)
- Only tiles adjacent to the empty slot (left or above) can be moved into it by dragging in the correct direction (right or down)
- After a move, the tile disappears from the grid and appears in the empty slot
- The puzzle is solved when all tiles are in the original order and the empty slot is outside the grid

---

## 🛠️ Tech Stack & Lightweight Build

- **React Native** with **Expo** (for easy development and build)
- Touch handling with `PanResponder` for drag-and-drop functionality
- No sound or animation libraries by default (add only if needed)
- Use a single, small image for the puzzle (optimize for size)
- Remove unused assets and dependencies before release
- For Google Play: use Expo's EAS Build with `minify` and `shrinkResources` enabled for smallest APK/AAB

---

## 📂 Project Structure

```
/puzz
├── assets/
│   ├── images/
│   └── sounds/
├── components/
│   ├── Tile.js
│   └── PuzzleBoard.js
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

# 2. Add your assets and code as per the structure above

# 3. Start the app
npx expo start

# 4. For Google Play, build a release APK/AAB
npx expo install eas-cli
eas build -p android --profile preview
```

---

## 📸 Assets

- Images: [Unsplash](https://unsplash.com), [Pexels](https://pexels.com)
- Sounds: [Freesound](https://freesound.org), [Kenney.nl](https://kenney.nl/assets)
