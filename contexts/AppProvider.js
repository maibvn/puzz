import React, { createContext, useContext, useState, useEffect } from "react";
import {
  useFonts,
  FredokaOne_400Regular,
} from "@expo-google-fonts/fredoka-one";
import * as SplashScreen from "expo-splash-screen";
import {
  useAudioPlayer,
  useAudioPlayerStatus,
  setAudioModeAsync,
} from "expo-audio";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LEVELS, getStarsForTime } from "../data/levels";

const AppContext = createContext();

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useApp must be used within AppProvider");
  }
  return context;
};

export const AppProvider = ({ children }) => {
  // Font loading
  const [fontsLoaded] = useFonts({
    FredokaOne_400Regular,
  });

  // Global game state
  const [gameState, setGameState] = useState("levelSelect");
  const [currentLevel, setCurrentLevel] = useState(null);
  const [levelProgress, setLevelProgress] = useState({});
  const [completionStats, setCompletionStats] = useState({ time: 0, stars: 0 });
  const [isDragSoundEnabled, setIsDragSoundEnabled] = useState(true);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);

  // Audio setup
  const clickSound = require("../assets/sounds/drag.mp3");
  const player = useAudioPlayer(clickSound);
  const status = useAudioPlayerStatus(player);

  // Background music setup
  const themeMusic = require("../assets/sounds/theme/theme.mp3");
  const musicPlayer = useAudioPlayer(themeMusic);
  const musicStatus = useAudioPlayerStatus(musicPlayer);

  // Handle font loading and splash screen
  useEffect(() => {
    async function prepare() {
      try {
        await SplashScreen.preventAutoHideAsync();
      } catch (e) {
        console.warn(e);
      }
    }
    prepare();
  }, []);

  useEffect(() => {
    async function hideSplash() {
      if (fontsLoaded) {
        await SplashScreen.hideAsync();
      }
    }
    hideSplash();
  }, [fontsLoaded]);

  // Configure audio on app start
  useEffect(() => {
    const configureAudio = async () => {
      try {
        await setAudioModeAsync({
          playsInSilentMode: true,
          allowsRecording: false,
          shouldPlayInBackground: false,
        });

        // Start background music when audio is configured
        startBackgroundMusic();
      } catch (error) {
        // Silently handle audio configuration errors
      }
    };
    configureAudio();
  }, []);

  // Load progress from AsyncStorage
  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const savedProgress = await AsyncStorage.getItem("puzzleProgress");
      if (savedProgress) {
        setLevelProgress(JSON.parse(savedProgress));
      } else {
        const initialProgress = {
          1: { unlocked: true, completed: false, stars: 0 },
        };
        setLevelProgress(initialProgress);
        await AsyncStorage.setItem(
          "puzzleProgress",
          JSON.stringify(initialProgress)
        );
      }
    } catch (error) {
      // Silently handle progress loading errors
    }
  };

  const saveProgress = async (progress) => {
    try {
      await AsyncStorage.setItem("puzzleProgress", JSON.stringify(progress));
      setLevelProgress(progress);
    } catch (error) {
      // Silently handle progress saving errors
    }
  };

  const playMoveSound = async () => {
    try {
      if (isDragSoundEnabled && status.isLoaded) {
        if (status.currentTime >= status.duration && status.duration > 0) {
          await player.seekTo(0);
        }
        player.play();
      }
    } catch (error) {
      // Silently handle audio playback errors
    }
  };

  const startBackgroundMusic = async () => {
    try {
      if (musicStatus.isLoaded) {
        // Set music to loop
        musicPlayer.setIsLooping(true);
        // Start playing at lower volume
        musicPlayer.setVolume(0.3);
        musicPlayer.play();
        setIsMusicPlaying(true);
      }
    } catch (error) {
      // Silently handle background music errors
    }
  };

  const stopBackgroundMusic = async () => {
    try {
      if (musicStatus.isLoaded) {
        musicPlayer.pause();
        setIsMusicPlaying(false);
      }
    } catch (error) {
      // Silently handle background music errors
    }
  };

  const toggleBackgroundMusic = async () => {
    try {
      if (musicStatus.isLoaded) {
        if (isMusicPlaying) {
          musicPlayer.pause();
          setIsMusicPlaying(false);
        } else {
          musicPlayer.play();
          setIsMusicPlaying(true);
        }
      }
    } catch (error) {
      // Silently handle background music errors
    }
  };

  const toggleDragSound = () => {
    setIsDragSoundEnabled(!isDragSoundEnabled);
  };

  const handleLevelComplete = (completionTime, stars) => {
    const newProgress = { ...levelProgress };
    newProgress[currentLevel.id] = {
      unlocked: true,
      completed: true,
      stars: Math.max(stars, levelProgress[currentLevel.id]?.stars || 0),
    };

    // Unlock next level
    const nextLevelId = currentLevel.id + 1;
    if (nextLevelId <= LEVELS.length) {
      newProgress[nextLevelId] = {
        unlocked: true,
        completed: false,
        stars: 0,
      };
    }

    saveProgress(newProgress);
    setCompletionStats({ time: completionTime, stars });
    setGameState("won");
    return { time: completionTime, stars };
  };

  const value = {
    // State
    gameState,
    setGameState,
    currentLevel,
    setCurrentLevel,
    levelProgress,
    fontsLoaded,
    completionStats,

    // Audio state
    isMusicPlaying,
    isDragSoundEnabled,

    // Functions
    loadProgress,
    saveProgress,
    playMoveSound,
    handleLevelComplete,
    startBackgroundMusic,
    stopBackgroundMusic,
    toggleBackgroundMusic,
    toggleDragSound,
  };

  if (!fontsLoaded) {
    return null;
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};
