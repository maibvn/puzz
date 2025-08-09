import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Pressable,
  Dimensions,
} from "react-native";
import Icon from "./Icon";
import Button from "./Button";
import theme from "../theme";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window");

export default function PauseModal({
  visible,
  onResume,
  onRestart,
  onHome,
  onClose,
}) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* Backdrop */}
      <Pressable style={styles.backdrop} onPress={onClose}>
        <View style={styles.modalContainer}>
          <Pressable onPress={(e) => e.stopPropagation()}>
            <View style={styles.modal}>
              <Text style={styles.title}>Game Paused</Text>

              {/* Resume Button */}
              <Button
                title="Resume"
                onPress={onResume}
                variant="primary"
                size="lg"
                iconName="play"
                style={styles.button}
              />

              {/* Restart Button */}
              <Button
                title="Restart"
                onPress={onRestart}
                variant="warning"
                size="lg"
                iconName="refresh"
                style={styles.button}
              />

              {/* Home Button */}
              <Button
                title="Home"
                onPress={onHome}
                variant="secondary"
                size="lg"
                iconName="home"
                style={styles.button}
              />
            </View>
          </Pressable>
        </View>
      </Pressable>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.7)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    width: screenWidth,
    height: screenHeight,
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    backgroundColor: theme.colors.background,
    borderRadius: theme.borderRadius.xl,
    padding: theme.spacing.xl,
    alignItems: "center",
    minWidth: 280,
    ...theme.shadows.xl,
    borderWidth: 2,
    borderColor: theme.colors.border,
  },
  title: {
    fontSize: theme.typography.sizes.xl,
    fontWeight: theme.typography.weights.bold,
    fontFamily: theme.typography.fontFamily.regular,
    color: theme.colors.text,
    marginBottom: theme.spacing.lg,
    textAlign: "center",
  },
  button: {
    width: 220,
    marginBottom: theme.spacing.md,
  },
});
