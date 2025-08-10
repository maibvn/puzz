import React from "react";
import { View, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import theme from "../theme";
import { useApp } from "../contexts/AppProvider";

const SoundToggleRow = ({ onVolumeChange }) => {
  const {
    isMusicPlaying,
    isDragSoundEnabled,
    toggleBackgroundMusic,
    toggleDragSound,
  } = useApp();

  const handleMusicToggle = () => {
    toggleBackgroundMusic();
    if (onVolumeChange) {
      onVolumeChange(!isMusicPlaying);
    }
  };

  const handleSoundToggle = () => {
    toggleDragSound();
    if (onVolumeChange) {
      onVolumeChange(!isDragSoundEnabled);
    }
  };

  return (
    <View style={theme.modalStyles.soundToggleRow}>
      <TouchableOpacity
        style={[
          theme.modalStyles.soundButton,
          {
            backgroundColor: isMusicPlaying
              ? theme.colors.primary
              : theme.colors.background,
          },
        ]}
        onPress={handleMusicToggle}
      >
        <Icon
          name={isMusicPlaying ? "musical-notes" : "musical-notes-outline"}
          size={32}
          color={isMusicPlaying ? theme.colors.surface : theme.colors.textLight}
          style={{ marginLeft: -1, marginRight: 1 }}
        />
      </TouchableOpacity>

      <TouchableOpacity
        style={[
          theme.modalStyles.soundButton,
          {
            backgroundColor: isDragSoundEnabled
              ? theme.colors.primary
              : theme.colors.background,
          },
        ]}
        onPress={handleSoundToggle}
      >
        <Icon
          name={isDragSoundEnabled ? "volume-high" : "volume-mute"}
          size={32}
          color={
            isDragSoundEnabled ? theme.colors.surface : theme.colors.textLight
          }
          style={{ marginLeft: -1, marginRight: 1 }}
        />
      </TouchableOpacity>
    </View>
  );
};

export default SoundToggleRow;
