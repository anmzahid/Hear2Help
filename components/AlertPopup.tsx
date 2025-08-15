import React from "react";
import { Modal, View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

interface Props {
  visible: boolean;
  gif: any;
  soundName: string;
  onAcknowledge: () => void;
  onSnooze: () => void;
}

export default function AlertPopup({ visible, gif, soundName, onAcknowledge, onSnooze }: Props) {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.popup}>
          <Image source={gif} style={styles.gif} />
          <Text style={styles.name}>{soundName}</Text>
          <View style={styles.buttons}>
            <TouchableOpacity style={styles.btn} onPress={onAcknowledge}>
              <Text style={styles.btnText}>Acknowledge</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.btn} onPress={onSnooze}>
              <Text style={styles.btnText}>Snooze</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  popup: { backgroundColor: "#fff", padding: 20, borderRadius: 12, alignItems: "center" },
  gif: { width: 100, height: 100, marginBottom: 12 },
  name: { fontSize: 20, fontWeight: "bold", marginBottom: 12 },
  buttons: { flexDirection: "row", gap: 10 },
  btn: { backgroundColor: "#007bff", padding: 10, borderRadius: 8, marginHorizontal: 5 },
  btnText: { color: "#fff" },
});
