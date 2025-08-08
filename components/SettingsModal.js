import React, { useState, useCallback, memo } from "react";
import { Modal, View, Text, Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useApp } from "../contexts/AppProvider";
import theme from "../theme";

const SettingsModal = memo(function SettingsModal({ visible, onClose }) {
  const {
    isMusicPlaying,
    toggleBackgroundMusic,
    toggleDragSound,
    isDragSoundEnabled,
  } = useApp();

  const handleToggleMusic = useCallback(() => {
    toggleBackgroundMusic();
  }, [toggleBackgroundMusic]);

  const handleToggleDragSound = useCallback(() => {
    toggleDragSound();
  }, [toggleDragSound]);

  const handleClose = useCallback(() => {
    onClose();
  }, [onClose]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>⚙️ Settings</Text>
            <Pressable
              onPress={handleClose}
              style={({ pressed }) => [
                styles.closeButton,
                pressed && { opacity: 0.6, transform: [{ scale: 0.95 }] },
              ]}
            >
              <Ionicons name="close" size={24} color={theme.colors.text} />
            </Pressable>
          </View>

          <View style={styles.settingsOptions}>
            {/* Theme Music Toggle */}
            <Pressable
              onPress={handleToggleMusic}
              style={({ pressed }) => [
                styles.settingOption,
                pressed && { opacity: 0.6, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.settingLeft}>
                <Ionicons
                  name={
                    isMusicPlaying ? "musical-notes" : "musical-notes-outline"
                  }
                  size={28}
                  color={
                    isMusicPlaying
                      ? theme.colors.primary
                      : theme.colors.textLight
                  }
                />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Theme Music</Text>
                  <Text style={styles.settingDescription}>
                    {isMusicPlaying ? "Playing" : "Muted"}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: isMusicPlaying
                      ? theme.colors.primary
                      : theme.colors.inactive,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    { transform: [{ translateX: isMusicPlaying ? 20 : 0 }] },
                  ]}
                />
              </View>
            </Pressable>

            {/* Drag Sound Toggle */}
            <Pressable
              onPress={handleToggleDragSound}
              style={({ pressed }) => [
                styles.settingOption,
                pressed && { opacity: 0.6, transform: [{ scale: 0.98 }] },
              ]}
            >
              <View style={styles.settingLeft}>
                <Ionicons
                  name={isDragSoundEnabled ? "volume-high" : "volume-mute"}
                  size={28}
                  color={
                    isDragSoundEnabled
                      ? theme.colors.primary
                      : theme.colors.textLight
                  }
                />
                <View style={styles.settingText}>
                  <Text style={styles.settingTitle}>Drag Sound Effects</Text>
                  <Text style={styles.settingDescription}>
                    {isDragSoundEnabled ? "Enabled" : "Disabled"}
                  </Text>
                </View>
              </View>
              <View
                style={[
                  styles.toggle,
                  {
                    backgroundColor: isDragSoundEnabled
                      ? theme.colors.primary
                      : theme.colors.inactive,
                  },
                ]}
              >
                <View
                  style={[
                    styles.toggleThumb,
                    {
                      transform: [{ translateX: isDragSoundEnabled ? 20 : 0 }],
                    },
                  ]}
                />
              </View>
            </Pressable>
          </View>
        </View>
      </View>
    </Modal>
  );
});

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    margin: theme.spacing.lg,
    minWidth: 300,
    ...theme.shadows.lg,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: theme.spacing.xl,
  },
  modalTitle: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  closeButton: {
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    backgroundColor: theme.colors.background,
  },
  settingsOptions: {
    gap: theme.spacing.lg,
  },
  settingOption: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: theme.spacing.md,
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.lg,
  },
  settingLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  settingText: {
    marginLeft: theme.spacing.md,
    flex: 1,
  },
  settingTitle: {
    fontSize: theme.typography.sizes.md,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
  },
  settingDescription: {
    fontSize: theme.typography.sizes.sm,
    color: theme.colors.textLight,
    marginTop: 2,
  },
  toggle: {
    width: 44,
    height: 24,
    borderRadius: 12,
    justifyContent: "center",
    paddingHorizontal: 2,
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: theme.colors.surface,
    ...theme.shadows.sm,
  },
});

export default SettingsModal;
