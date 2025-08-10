import React, { forwardRef, useImperativeHandle, useState } from "react";
import { View, Modal, TouchableOpacity } from "react-native";
import Icon from "./Icon";
import SoundToggleRow from "./SoundToggleRow";
import theme from "../theme";

const SettingsModal = forwardRef(({ onVolumeChange }, ref) => {
  const [visible, setVisible] = useState(false);

  const open = () => setVisible(true);
  const close = () => setVisible(false);

  useImperativeHandle(ref, () => ({
    open,
    close,
  }));

  if (!visible) return null;

  return (
    <Modal transparent visible={true} animationType="fade">
      <TouchableOpacity
        style={theme.modalStyles.overlay}
        onPress={close}
        activeOpacity={1}
      >
        <TouchableOpacity style={theme.modalStyles.content} activeOpacity={1}>
          <View style={theme.modalStyles.header}>
            <View style={{ flex: 1 }} />
            <TouchableOpacity
              onPress={close}
              style={theme.modalStyles.closeButton}
            >
              <Icon name="close" size={20} color={theme.colors.headerText} />
            </TouchableOpacity>
          </View>

          <SoundToggleRow onVolumeChange={onVolumeChange} />
        </TouchableOpacity>
      </TouchableOpacity>
    </Modal>
  );
});

export default SettingsModal;
