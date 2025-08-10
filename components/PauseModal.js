import React from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import Button from "./Button";
import SoundToggleRow from "./SoundToggleRow";
import theme from "../theme";

export default function PauseModal({
  visible,
  onResume,
  onRestart,
  onHome,
  onClose,
  onVolumeChange,
}) {
  if (!visible) return null;

  return (
    <Modal
      visible={true}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <TouchableOpacity
        style={theme.modalStyles.overlay}
        onPress={onClose}
        activeOpacity={1}
      >
        <TouchableOpacity style={theme.modalStyles.content} activeOpacity={1}>
          <View style={theme.modalStyles.header}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={onClose}
              style={theme.modalStyles.closeButton}
            >
              <Icon name="close" size={20} color={theme.colors.headerText} />
            </TouchableOpacity>
          </View>

          {/* Sound Toggle Row */}
          <SoundToggleRow onVolumeChange={onVolumeChange} />

          {/* Game Control Buttons */}
          <View style={theme.modalStyles.buttonContainer}>
            <Button
              title="Resume"
              onPress={onResume}
              variant="primary"
              size="lg"
              iconName="play"
              style={theme.modalStyles.gameButton}
            />

            <Button
              title="Restart"
              onPress={onRestart}
              variant="warning"
              size="lg"
              iconName="refresh"
              style={theme.modalStyles.gameButton}
            />

            <Button
              title="Home"
              onPress={onHome}
              variant="secondary"
              size="lg"
              iconName="home"
              style={theme.modalStyles.gameButton}
            />
          </View>
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
}
