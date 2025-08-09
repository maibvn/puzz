# Collection System Documentation

## Overview

The collection system allows players to collect puzzle images as they complete levels for the first time. Each image has a rarity tier that affects its visual presentation and collection value.

## Rarity Tiers

- **Common** (Gray ◆): Basic puzzle images
- **Rare** (Blue ♦): Uncommon puzzle images
- **Epic** (Purple ★): Special puzzle images
- **Legendary** (Gold 👑): Ultra-rare puzzle images

## Files Created/Modified

### Core Data (`data/levels.js`)

- Added `rarity` field to each level
- Added rarity helper functions:
  - `getRarityColor(rarity)` - Get color for rarity
  - `getRarityIcon(rarity)` - Get icon for rarity
  - `unlockLevelImage(levelId, collection)` - Core unlock logic
  - Collection sorting and stats functions

### Collection Storage (`utils/collection.js`)

- `loadCollection()` - Load from AsyncStorage
- `saveCollection(collection)` - Save to AsyncStorage
- `addLevelToCollection(levelId)` - Add level to collection
- `getCollectionStatistics()` - Get collection stats
- `getRecentlyUnlocked()` - Get recent unlocks
- `clearCollection()` - Reset collection (for testing)

### React Hook (`hooks/useCollection.js`)

- `useCollection()` - Main hook for collection management
- Provides collection state, loading states, error handling
- Helper functions for UI integration

### UI Component (`screens/CollectionScreen.js`)

- Complete collection viewing modal
- Shows progress, statistics, sorting options
- Grid view of collected images with rarity indicators

## Integration Examples

### 1. Basic Level Completion

```javascript
import { useCollection } from "../hooks/useCollection";

const GameScreen = () => {
  const { unlockLevel } = useCollection();

  const handleLevelComplete = async (levelId) => {
    const result = await unlockLevel(levelId);

    if (result.newUnlock) {
      // Show celebration for new image unlocked!
      showNewUnlockNotification(result.unlockedItem);
    }
  };
};
```

### 2. Display Collection Status

```javascript
import { useCollection } from "../hooks/useCollection";

const HomeScreen = () => {
  const { statistics, getCollectionProgress } = useCollection();
  const progress = getCollectionProgress();

  return (
    <View>
      <Text>
        Collection: {progress.collected}/{progress.total}
      </Text>
      <Text>Legendary: {statistics.legendary}</Text>
    </View>
  );
};
```

### 3. Check if Level is Collected

```javascript
const { isLevelCollected } = useCollection();

const LevelButton = ({ levelId }) => {
  const isCollected = isLevelCollected(levelId);

  return <View>{isCollected && <Text>✓ Collected</Text>}</View>;
};
```

## Usage Tips

1. **Call `unlockLevel()` only when a level is completed for the first time**
2. **The system automatically handles duplicates** - won't add same image twice
3. **Use `isLevelCollected()` to show collection status in UI**
4. **Collection data persists between app sessions** via AsyncStorage
5. **All functions are async** - remember to use await/then

## Rarity Distribution Suggestion

- **Levels 1-2**: Common
- **Levels 3-4**: Rare
- **Levels 5-7**: Epic
- **Levels 8-10**: Legendary

## Future Enhancements

- Achievement system based on collection milestones
- Trade/share system for duplicate images
- Special effects for legendary unlocks
- Collection export/import functionality
- Seasonal/event-based rare images

## Testing

Use `clearCollection()` from `utils/collection.js` to reset collection during development.
